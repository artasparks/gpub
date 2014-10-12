/**
 * @preserve GPub: A Go publishing platform, built on Glift
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * --------------------------------------
 */
(function(w) {
var gpub = gpub || w.gpub || {};
if (w) {
  // expose Glift as a global.
  w.gpub = gpub;
}
})(window);
gpub.global = {
  /**
   * Semantic versioning is used to determine API behavior.
   * See: http://semver.org/
   * Currently in alpha.
   */
  version: '0.1.0',
};
gpub.book = {};
/**
 * Conversion related to managers
 */
gpub.book.manager = {
  /**
   * Convert all the panels in a widget manager into a LaTeX book using gooe
   * fonts. Returns the string form of the book
   */
  toBook: function(manager, callback) {
    var document = [];
    var showVars = glift.enums.showVariations.NEVER;
    var gooe = gpub.diagrams.gooe;
    var latex = gpub.diagrams.latex;
    var managerConverter = gpub.book.manager;
    var globalBookData = manager.bookData;
    var diagramTypes = gpub.diagrams.diagramTypes;

    document.push(latex.basicHeader());
    document.push(gooe.gooeDefs());
    document.push(latex.generateTitleDef(
        globalBookData.title,
        globalBookData.subtitle,
        globalBookData.authors,
        globalBookData.publisher));
    document.push('');
    document.push(latex.diagramLabelMacros());
    document.push(latex.startDocument());

    manager.prepopulateCache(function() {
      var maxPageBuf = globalBookData.diagramsPerPage;
      var counts = {
        curPageBuf: 1,
        varDiags: 1,
        mainDiags: 1
      };

      for (var i = 0, len = manager.sgfList.length; i < len; i++) {
        var curObj = manager.getSgfObj(i),
            boardRegion = curObj.boardRegion,
            initPos = curObj.initialPosition,
            treepath = glift.rules.treepath.parseInitPosition(initPos),
            nextMovesPath = [];

        // This should be synchronous since we've prepopulated the cache.
        manager.getSgfString(curObj, function(sobj) {
          // Movetree at root.
          var movetree = glift.rules.movetree.getFromSgf(sobj.sgfString, treepath);
          var isMainline = movetree.onMainline();
          if (isMainline) { counts.mainDiags++; }
          else { counts.varDiags++; }

          if (globalBookData.autoNumber) {
            var out = glift.rules.treepath.findNextMovesPath(movetree);
            movetree = out.movetree;
            treepath = out.treepath;
            nextMovesPath = out.nextMoves;
          }
          var goban = glift.rules.goban.getFromMoveTree(movetree).goban;
          var startNum = isMainline ? movetree.node().getNodeNum() + 1 : 1;
          var flattened = glift.bridge.flattener.flatten(
              movetree, goban, boardRegion, showVars, nextMovesPath, startNum);

          var diagramStr = '';
          if (sobj.bookData.showDiagram) {
            diagramStr = managerConverter.createDiagram(flattened, sobj.bookData);
          }
          var tex = managerConverter.typesetDiagram(
              diagramStr, flattened.comment, sobj.bookData,
              flattened.collisions, isMainline);

          if (!sobj.bookData.chapterTitle && counts.curPageBuf < maxPageBuf) {
            document.push('\\newpage');
            counts.curPageBuf++;
          } else {
            counts.curPageBuf = 1;
          }

          document.push(tex);
        });
      }
      document.push(latex.basicFooter);
      callback(document.join("\n"));
    });
  },

  createDiagram: function(flattened, bookData) {
    var gooe = gpub.diagrams.gooe;
    var size = gpub.diagrams.diagramSize.NORMAL;
    if (bookData.chapterTitle) {
      size = gpub.diagrams.diagramSize.LARGE;
    }
    var gooeArray = gooe.diagramArray(flattened, size);
    var diagram = gooe.diagramArrToString(gooeArray);
    return diagram;
  },

  /**
   * Typeset the diagram into LaTeX
   */
  typesetDiagram: function(str, comment, bookData, collisions, isMainline) {
    var diagramTypes = gpub.diagrams.diagramTypes;
    var latex = gpub.diagrams.latex;
    var label = '';
    if (bookData.diagramType === diagramTypes.GAME_REVIEW) {
      if (bookData.showDiagram) {
        var label = isMainline ? '\\gofigure' : '\\godiagram';
        var collisionLabel = latex.labelForCollisions(collisions);
        if (collisionLabel.length > 0) {
          label += '\n\n' + ' \\subtext{' + collisionLabel + '}';
        }
      }
      if (bookData.chapterTitle) {
        return latex.gameReviewChapterDiagram(
            str, comment, bookData.chapterTitle, label);
      } else {
        return latex.gameReviewDiagram(str, comment, label);
      }
    }
  }
};
gpub.diagrams = {
  /**
   * Types of diagram generation.
   */
  types: {
    /**
     * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
     */
    GOOE: 'GOOE',

    /**
     * Another LaTeX font / LaTeX style package
     * >> Not Currently Supported
     */
    IGO: 'IGO',

    /**
     * Native PDF generation
     * >> Not Currently Supported
     */
    PDF: 'PDF'
  },

  sizes: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  /**
   * Creates a diagram-for-print!
   */
  create: function(sgf, type, initPos, nextMovesPath, boardRegion) {
    var flattened = this.flatten(sgf, initPos, nextMovesPath, boardRegion);
    switch(type) {
      case 'GOOE':
        return gpub.diagrams.gooe.create(flattened);
      default:
        throw new Error('Not currently supported: ' + type);
    }
  },

  /**
   * Return a Flattened object, which is key for generating diagrams.
   */
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  }
};
/**
 * Create a gooe-font diagram.
 */
gpub.diagrams.gooe = {
  /**
   * Takes a flattened set of symbols and produces a full string diagram. These
   * diagrams are not stand alone and must live inside a LaTeX document to
   * viewed.
   *
   * flattened: A flattened object.
   * size: a member of gpub.diagrams.diagramSize;
   */
  create: function(flattened, size) {
    return gpub.diagrams.gooe.gooeStringArray(flattened, size).join('\n');
  },

  /**
   * Returns an array of string lines.
   */
  gooeStringArray: function(flattened, size) {
    var header = size === 'LARGE' ? '{\\bgoo' : '{\\goo';
    var footer = '}';
    var gooeBoard = gpub.diagrams.gooe.gooeBoard(flattened, size);
    var out = [header];
    for (var i = 0, arr = gooeBoard.boardArray(); i < arr.length; i++) {
      out.push(arr[i].join(''));
    }
    out.push(footer);
    return out;
  },

  /**
   * Returns a flattener-symbol-board that's transformed into a gooe-board.
   */
  gooeBoard: function(flattened, size) {
    var symbols = glift.flattener.symbols;
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gooe.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base());
      if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      }
      var symbolSizeOverride = symbol + '_' + size;
      var out = '';
      if (symbolMap[symbolSizeOverride]) {
        out = symbolMap[symbolSizeOverride];
      } else if (symbolMap[symbol]) {
        out = symbolMap[symbol];
      } else {
        out = symbolMap.EMPTY;
      }
      if (i.textLabel()) {
        out = out.replace('%s', i.textLabel());
      }
      return out;
    });
    return newBoard;
  }
};
gpub.diagrams.gooe.headers = {
  /**
   * Some built in defs that are useful for generating LaTeX books using Gooe
   * fonts.
   */
  defs: {
    sizeDefs: [
      '% Size definitions',
      '\\newdimen\\bigRaise',
      '\\bigRaise=4.3pt',
      '\\newdimen\\smallRaise',
      '\\smallRaise=3.5pt',
      '\\newdimen\\inlineRaise',
      '\\inlineRaise=3.5pt'
    ],

    bigBoardDefs: [
      '% Big-sized board defs',
      '\\def\\eLblBig#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\bigRaise\\hbox{\\tenpointeleven{#1}}\\hss}}',
      '\\def\\goWsLblBig#1{\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\tenpointeleven{#1}\\hss}}',
      '\\def\\goBsLblBig#1{\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\color{white}\\tenpointeleven{#1}\\color{white}\\hss}}'
    ],

    normalBoardDefs: [
      '% Normal-sized board defs',
      '\\def\\eLbl#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\smallRaise\\hbox{\\tenpoint{#1}}\\hss}}',
      '\\def\\goWsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\eightpointnine{#1}\\hss}}',
      '\\def\\goBsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\color{white}\\eightpointnine{#1}\\color{white}\\hss}}'
    ]
  },

  /**
   * Generates the LaTeX document headers as a string.
   *
   * Takes a base font family. Defaults to cmss (computer modern sans serif).
   */
  get: function(baseFont) {
    var defs = gpub.diagrams.gooe.headers.defs;
    var baseFont = baseFont || 'cmss';
    var fontDefsBase = [
      '% Gooe font definitions',
      '\\font\\tenpoint=' + baseFont + '10',
      '\\font\\tenpointeleven=' + baseFont + '10 at 11pt',
      '\\font\\eightpoint=' + baseFont + '8',
      '\\font\\eightpointnine=' + baseFont + '8 at 9pt'
    ]
    return fontDefsBase
      .concat(defs.sizeDefs)
      .concat(defs.bigBoardDefs)
      .concat(defs.normalBoardDefs).join('\n');
  }
}
/**
 * Mapping from flattened symbol to char
 */
gpub.diagrams.gooe.symbolMap = {
  /**
   * Generally, we don't display empty intersections for the gooe diagram type.
   */
  EMPTY: '\\eLbl{_}',

  /**
   * Base layer.
   */
  TL_CORNER: '\\0??<',
  TR_CORNER: '\\0??>',
  BL_CORNER: '\\0??,',
  BR_CORNER: '\\0??.',
  TOP_EDGE: '\\0??(',
  BOT_EDGE: '\\0??)',
  LEFT_EDGE: '\\0??[',
  RIGHT_EDGE: '\\0??]',
  CENTER: '\\0??+',
  CENTER_STARPOINT: '\\0??*',

  /**
   * Stone layer. We don't display the base layer if a stone layer exists.
   */
  BSTONE: '\\0??@',
  WSTONE: '\\0??!',

  /**
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
   */
  BSTONE_TRIANGLE: '\\0??S',
  WSTONE_TRIANGLE: '\\0??s',
  TRIANGLE: '\\0??3',
  BSTONE_SQUARE: '\\0??S',
  WSTONE_SQUARE: '\\0??s',
  SQUARE: '\\0??2',
  BSTONE_CIRCLE: '\\0??C',
  WSTONE_CIRCLE: '\\0??c',
  CIRCLE: '\\0??1',
  BSTONE_XMARK: '\\0??X',
  WSTONE_XMARK: '\\0??x',
  XMARK: '\\0??4',
  BSTONE_TEXTLABEL: '\\goBsLbl{%s}',
  WSTONE_TEXTLABEL: '\\goWsLbl{%s}',
  TEXTLABEL: '\\eLbl{%s}',

  /**
   * Here we have overrides for big-label types.
   */
  BSTONE_TEXTLABEL_LARGE: '\\goBsLblBig{%s}',
  WSTONE_TEXTLABEL_LARGE: '\\goWsLblBig{%s}',
  TEXTLABEL_LARGE: '\\eLblBig{%s}'

  // Formatting for inline stones.  Should these be there? Probably not.
  // BSTONE_INLINE: '\goinBsLbl{%s}',
  // WSTONE_INLINE: '\goinWsLbl{%s}',
  // MISC_STONE_INLINE: '\goinChar{%s}',
};
/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(sgfobj) {

  }
};
gpub.diagrams.latex = {
  basicHeader_: [
    '\\documentclass[letterpaper,12pt]{memoir}',
    '\\usepackage{gooemacs}',
    '\\usepackage{color}',
    '\\usepackage{wrapfig}',
    '\\usepackage{setspace}',
    '\\usepackage{unicode}',
    '\\usepackage[margin=1in]{geometry}',
    '',
    '\\setlength{\\parskip}{0.5em}',
    '\\setlength{\\parindent}{0pt}'
  ],

  /** Basic latex header. Uses memoir class. */
  basicHeader: function() {
    return gpub.diagrams.latex.basicHeader_.join('\n');
  },

  /** Diagram label macros. For making Figure.1, Dia.1, etc. */
  diagramLabelMacros: function() {
    return [
      '% Mainline Diagrams. reset at parts',
      '\\newcounter{GoFigure}[part]',
      '\\newcommand{\\gofigure}{%',
      ' \\stepcounter{GoFigure}',
      ' \\centerline{\\textit{Figure.\\thinspace\\arabic{GoFigure}}}',
      '}',
      '% Variation Diagrams. reset at parts.',
      '\\newcounter{GoDiagram}[part]',
      '\\newcommand{\\godiagram}{%',
      ' \\stepcounter{GoDiagram}',
      ' \\centerline{\\textit{Diagram.\\thinspace\\arabic{GoDiagram}}}',
      '}',
      '\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
      ''].join('\n');
  },

  /** Basic latex footer */
  basicFooter: '\\end{document}',

  /**
   * title: title of the book as string
   * author: array of one or several authors as array af string
   * subtitle: the subtitle as string
   * publisher: the publisher as string
   *
   * returns: filled in string.
   */
  generateTitleDef: function(title, subtitle, authors, publisher) {
    var strbuff = [
      '\\definecolor{light-gray}{gray}{0.55}',
      '\\newcommand*{\\mainBookTitle}{\\begingroup',
      '  \\raggedleft'];
    for (var i = 0; i < authors.length; i++) {
      strbuff.push('  {\\Large ' + authors[i] + '} \\\\')
      if (i === 0) {
        strbuff.push('  \\vspace*{0.5 em}');
      } else if (i < authors.length - 1) {
        strbuff.push('  \\vspace*{0.5 em}');
      }
    }
    return strbuff.concat(['  \\vspace*{5 em}',
      '  {\\textcolor{light-gray}{\\Huge ' + title + '}}\\\\',
      '  \\vspace*{\\baselineskip}',
      '  {\\small \\bfseries ' + subtitle + '}\\par',
      '  \\vfill',
      '  {\\Large ' + publisher + '}\\par',
      '  \\vspace*{2\\baselineskip}',
      '\\endgroup}']).join('\n');
  },

  /**
   * Start the latex document by doing \begin{document} and rendering some basic
   * frontmatter.
   */
  startDocument: function() {
    return [
      '\\begin{document}',
      '',
      '\\pagestyle{empty}',
      '\\mainBookTitle',
      '\\newpage',
      '\\tableofcontents',
      '',
      '\\chapterstyle{section}',
      '\\pagestyle{companion}',
      '\\makepagestyle{headings}',
      '\\renewcommand{\\printchapternum}{\\space}',
      '\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
      '\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}'
      ].join('\n');
  },

  /**
   * Generate a GameReview diagram.
   *
   * diagramString: Literal string for the diagram
   * comment: Comment for diagram
   * label: Diagram label
   *
   * returns: filled-in latex string.
   */
  gameReviewDiagram: function(diagramString, comment, label) {
    return [
      '',
      '\\rule{\\textwidth}{0.5pt}',
      '',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      diagramString,
      label,
      '\\end{minipage}',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      '\\setlength{\\parskip}{0.5em}',
      comment,
      '\\end{minipage}',
      '\\vfill'].join('\n');
  },

  /**
   * Generate a Game Review Chapter Diagram.
   */
  gameReviewChapterDiagram: function(diagStr, comment, title, label) {
    return [
      '\\chapter{' + title + '}',
      '{\\centering',
      diagStr,
      '}',
      label,
      '',
      comment,
      '\\vfill'].join('\n');
  },

  /**
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  labelForCollisions: function(collisions) {
    if (!collisions ||
        glift.util.typeOf(collisions) !== 'array' ||
        collisions.length === 0) {
      return '';
    }
    var buffer = [];
    for (var i = 0; i < collisions.length; i++) {
      var c = collisions[i];
      var col = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
      buffer.push(col + ' ' + c.mvnum + ' at ' + c.label);
    }
    return buffer.join(', ') + '.'
  }
};
