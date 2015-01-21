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
  version: '0.1.0'
};
/**
 * GPub utilities.
 */
gpub.util = {};
/**
 * Buffer Helper. Used to manage groupings items. This implementation allows
 * users to fill up the buffer past the maximum capacity -- it us up to the user
 * to check whether the buffer should be flushed via the atCapacity method.
 */
gpub.util.Buffer = function(maxSize) {
  this._maxSize = maxSize || 1;

  /** Array of arbitrary (non-null/non-undefined) items */
  this._buffer = [];
};

gpub.util.Buffer.prototype = {
  /**
   * Adds an item to the buffer.  The item must be defined.
   */
  add: function(item) {
    if (item != null) {
      this._buffer.push(item);
    }
    return this;
  },

  /**
   * Checks whether or not the internal buffer size is larger than the specified
   * max size.
   */
  atCapacity: function() {
    return this._buffer.length >= this._maxSize;
  },

  /**
   * Returns a copy of the items array and reset the underlying array.
   */
  flush: function() {
    var copy = this._buffer.slice(0);
    this._buffer = [];
    return copy;
  }
};
/**
 * Package for creating the books!
 */
gpub.book = {
  /**
   * Available book formats.
   */
  // TODO(kashomon): Move into diagram package?
  bookFormat: {
    /** Standard GLift web display */
    HTML: 'HTML',

    /** LaTeX output */
    LATEX: 'LATEX'
  }
};
/**
 * An html 'book' creator
 */
gpub.book.htmlBook = {
  /**
   * Expects a book definition, like the kind specified from gen.collection
   */
  create: function(options, template) {

  }
}
gpub.book.latex = {
  /**
   * Generate a LaTeX book!
   *
   * We assume that the options have already been generated.
   *
   * spec: A bookSpec -- i.e., a set of glift options.
   * templateString: the book template to use for the book
   * diagramType: The diagram format.
   * options: optional parameters. Including:
   *    Title: The title of the book
   *    Subtitle: Optional Subtitle
   *    Authors: Array of author names
   *    Publisher: Publisher Name
   *
   * Note: these parameters can also be specified in the spec metadata.
   */
  generate: function(spec, templateString, diagramType, options) {
    if (!spec) {
      throw new Error('Options must be defined. Was: ' + spec);
    }
    var diagramsPerPage = 2;

    var templateString = templateString || gpub.templates.latexBase;
    var diagramType = diagramType || gpub.diagrams.diagramType.GOOE

    var mgr = glift.widgets.createNoDraw(spec);
    var template = gpub.templates.parseLatexTemplate(templateString);
    var diagramTypePkg = gpub.diagrams[glift.enums.toCamelCase(diagramType)];
    var diagramTypeHeaders = diagramTypePkg.latexHeaders;

    var latexDefs = gpub.diagrams.latex;

    template.setExtraPackages(diagramTypeHeaders.packageDef())
        .setDiagramTypeDefs(diagramTypeHeaders.extraDefs())
        .setDiagramWrapperDefs(latexDefs.diagramDefs())
        .setTitleDef(this.basicTitleDef(
            'Relentless',
            'Gu Li vs Lee Sedol',
            ['Younggil An', 'David Ormerod', 'Josh Hoak'],
            'Go Game Guru'));

    var content = [];
    var diagramBuffer = []
    var chapter = 1;
    var section = 1;
    var lastPurpose = null;
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    for (var i = 0; i < mgr.sgfCollection.length; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var mt = glift.rules.movetree.getFromSgf(
          sgfObj.sgfString, sgfObj.initialPosition);
      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: sgfObj.nextMovesPath,
          boardRegion: sgfObj.boardRegion
      });

      var nodeData = gpub.book.NodeData.fromContext(
          mt, flattened, sgfObj.metadata, sgfObj.nextMovesPath || []);
      section = nodeData.setSectionFromCtx(mt, lastPurpose, section);
      chapter = nodeData.setChapterFromCtx(mt, lastPurpose, chapter);

      var diagram = gpub.diagrams.forPurpose(
          flattened,
          diagramType,
          gpub.book.bookFormat.LATEX,
          nodeData.purpose,
          nodeData);

      if (nodeData.purpose === diagramPurpose.SECTION_INTRO ||
          nodeData.purpose === diagramPurpose.GAME_REVIEW_CHAPTER ||
          nodeData.purpose !== lastPurpose) {
        // Flush the previous buffer centent to the page.
        content.push(gpub.book.latex.renderPage(diagramBuffer));

        diagramBuffer = [];
        diagramBuffer.push(diagram);
        content.push(gpub.book.latex.renderPage(diagramBuffer));
        diagramBuffer = [];
      } else {
        diagramBuffer.push(diagram);
        if (diagramBuffer.length === diagramsPerPage) {
          content.push(gpub.book.latex.renderPage(diagramBuffer));
          diagramBuffer = [];
        }
      }
      lastPurpose = nodeData.purpose;
    }
    return template.setContent(content.join('\n')).compile();
  },

  /**
   * Generates a basic title.
   *
   * title: title of the book as string
   * author: array of one or several authors as array af string
   * subtitle: the subtitle as string
   * publisher: the publisher as string
   *
   * Note: The LaTeX template expects the command \mainBookTitle.
   *
   * returns: filled in string.
   */
  // TODO(kashomon): Perhaps there should be a 'titles' package. Or perhaps each
  // booktype should get its own sub-package?
  basicTitleDef: function(title, subtitle, authors, publisher) {
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

  renderPage: function(buffer) {
    buffer.push('\\newpage');
    return buffer.join('\n');
  }
};
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
  }
};
/**
 * NodeData object.
 */
gpub.book.NodeData = function(purpose) {
  if (!gpub.diagrams.diagramPurpose[purpose]) {
    throw new Error(
        'Purpose not defined in gpub.diagrams.diagramPurpose: ' + purpose)
  }
  this.purpose = purpose;

  this.sectionTitle = null;
  this.sectionNumber = -1;

  this.chapterTitle = null;
  this.chapterNumber = -1;
};

/** Methods */
gpub.book.NodeData.prototype = {
  /** Sets the section title from the context. */
  setSectionFromCtx: function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.SECTION_INTRO) {
      // We're at the beginning of the game. Create a new section
      this.sectionTitle =
          mt.getTreeFromRoot().properties().getOneValue('GN') || '';
      this.sectionNumber = idx;
      return idx + 1;
    }
    return idx;
  },

  /** Sets the chapter title from the context. */
  setChapterFromCtx : function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.GAME_REVIEW_CHAPTER) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    } else if ((this.purpose === diagramPurpose.PROBLEM || 
        this.purpose === diagramPurpose.ANSWER) &&
        this.purpose !== previousPurpose) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    }
    return idx;
  }
};

/**
 * Staticly creates NodeData based on some context.  Basically, this uses
 * hueristics
 *
 * This method is pretty hacky and may need to be rethought.
 */
gpub.book.NodeData.fromContext = function(
    mt, flattened, sgfMetadata, nextMovesPath) {
  var diagramPurpose = gpub.diagrams.diagramPurpose;
  var exampleType = gpub.spec.exampleType;
  var purpose = diagramPurpose.GAME_REVIEW;
  sgfMetadata = sgfMetadata || {};

  if (diagramPurpose[sgfMetadata.exampleType]) {
    purpose = sgfMetadata.exampleType;
  }

  // We're at the beginning of a game. Don't display a board, but display the
  // comment (assuming there is one).
  if (mt.node().getNodeNum() === 0 &&
      nextMovesPath.length === 0 &&
      purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.SECTION_INTRO;
  }

  // Try out the chapter-title stuff.
  if (flattened.isOnMainPath() && purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.GAME_REVIEW_CHAPTER;
  }

  return new gpub.book.NodeData(purpose);
};
gpub.spec  = {
  /**
   * Types of specs to generate
   */
  specType: {
    /** Standard problem SGF Collection. */
    PROBLEM_SET: 'PROBLEM_SET',

    /**
     * Problems that have been converted into a book format. In other words,
     * we've flattened all the problems into EXAMPLEs.
     */
    PROBLEM_BOOK: 'PROBLEM_BOOK',

    /** Game that's been flattened into examples. */
    GAME_BOOK: 'GAME_BOOK'
  },

  /** The type of information the problem is intending to display */
  exampleType: {
    PROBLEM: 'PROBLEM',
    ANSWER: 'ANSWER',
    GAME_REVIEW: 'GAME_REVIEW'
  },

  /**
   * Creates a Glift collection from sgfs.
   *
   * sgfCol: Array of SGFs.
   * contents: An SGF Collection definition. Still needs processing.
   * stype: The spec type to generate
   * options: Has the following structure:
   *    {
   *      boardRegion: <boardRegion> -- The board region to display
   *      bufferSize: Usually 1. For problems, sometimes more.
   *    }
   *
   * returns: A full glift options specification.
   */
  fromSgfs: function(sgfCol, contents, specTypeIn, options) {
    var specType = gpub.spec.specType;
    var opts = options || {};
    var stype = specTypeIn || specType.GAME_BOOK;
    var spec = {
      // Since this is for a book definition, we don't need a divId. Clients
      // can add in a relevant ID later.
      divId: null,
      sgfCollection: [],
      // We must rely on SGF aliases to generate the collection to ensure the
      // collection is self contained.
      sgfMapping: {},
      sgfDefaults: {},
      metadata: {
        specType: stype
      }
    };

    var maxBufferSize = 1;

    var processingFn = null;
    switch(stype) {
      case 'GAME_BOOK':
        spec.sgfDefaults.widgetType = 'EXAMPLE';
        maxBufferSize = 1;
        processingFn = function(buf, sgfObj, optz) {
          return gpub.spec.gameBook.one(buf[0].movetree, buf[0].name, sgfObj, optz);
        };
        break;

      case 'PROBLEM_SET':
        spec.sgfDefaults.widgetType = 'STANDARD_PROBLEM';
        spec.sgfDefaults.region = 'AUTO';
        maxBufferSize = 1;
        processingFn = function(buf, sgfObj, optz) {
          return gpub.spec.problemSet.one(buf[0].movetree, buf[0].name, sgfObj, optz);
        };
        break;

      case 'PROBLEM_BOOK':
        spec.sgfDefaults.widgetType = 'EXAMPLE';
        processingFn = gpub.spec.problemBook.multi;
        var answerStyle = gpub.spec.problemBook.answerStyle;
        opts.answerStyle = opts.answerStyle || answerStyle.END_OF_SECTION;
        if (opts.answerStyle === answerStyle.END_OF_SECTION) {
          maxBufferSize = sgfs.length;
        } else if (opts.answerStyle === answerStyle.AFTER_PAGE) {
          maxBufferSize = opts.bufferSize || 4;
        } else {
          maxBufferSize = 1;
        }
        break;

      default:
        throw new Error('Unknown spec type: ' + stype);
    }

    var buffer = new gpub.util.Buffer(maxBufferSize);
    var sgfDefaults = glift.util.simpleClone(
        glift.widgets.options.baseOptions.sgfDefaults);
    for (var i = 0; sgfCol && i < sgfCol.length; i++) {
      var sgfObj = sgfCol[i];
      if (typeof sgfObj === 'string') {
        sgfObj = { url: sgfObj }
      }
      var fname = sgfObj.url;
      var sgfStr = contents[fname];
      var mt = glift.parse.fromString(sgfStr);
      var sgfName = mt.properties().getOneValue('GN') || fname;
      buffer.add({ movetree: mt, name: sgfName });
      if (buffer.atCapacity() || i === sgfs.length - 1) {
        spec.sgfCollection = spec.sgfCollection.concat(
            processingFn(buffer.flush(), sgfObj, opts));
      }
    }
    spec.sgfMapping = contents;

    return spec;
  },

  /**
   * Convert a movetree and a couple of options to an entry in the SGF
   * collection.
   * alias: Required. The cache alias.
   * initPos: Required. The init position
   * nextMoves: Required. Next moves path
   * region: not required. Defaults to ALL, but must be part of
   *    glift.enums.boardRegions.
   * exampleType: What the diagram is intended for.
   *    From gpub.spec.examplePurpose;
   */
  createExample: function(
      alias, initPos, nextMoves, region, exampleType) {
    region = region || glift.enums.boardRegions.ALL;
    if (!glift.enums.boardRegions[region]) {
      throw new Error('Unknown board region: ' + region);
    }
    var exType = gpub.spec.exampleType;
    var ipString = glift.rules.treepath.toInitPathString;
    var fragString = glift.rules.treepath.toFragmentString;
    var base = {
      widgetType: 'EXAMPLE',
      alias: alias,
      initialPosition: ipString(initPos),
      nextMovesPath: fragString(nextMoves),
      boardRegion: region
    };
    if (exampleType && exType[exampleType]) {
      base.metadata = {
        exampleType: exampleType
      }
    }
    return base;
  }
};
gpub.spec.gameBook = {
  /**
   * Convert a single movetree to a SGF Collection.
   *
   * mt: A movetree from which we want to generate our SGF Collection.
   * alias: The name of this movetree / SGF instance. This is used to create the
   *    alias.
   * sgfObj: base sgf object. currently unused.
   * options: options object.
   */
  one: function(mt, alias, sgfObj, options) {
    var boardRegions = glift.enums.boardRegions;
    var out = [];
    var varPathBuffer = [];
    var node = mt.node();
    while (node) {
      if (!mt.properties().getOneValue('C') && node.numChildren() > 0) {
        // Ignore positions don't have comments and aren't terminal.
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        var node = mt.node();
        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
      } else {
        // This node has a comment or is terminal.  Process this node and all
        // the variations.
        var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
        out.push(gpub.spec.createExample(
            alias, pathSpec.treepath, pathSpec.nextMoves));

        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
        for (var i = 0; i < varPathBuffer.length; i++) {
          var path = varPathBuffer[i];
          var mtz = mt.getTreeFromRoot(path);
          var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
          out.push(gpub.spec.createExample(
              alias, varPathSpec.treepath, varPathSpec.nextMoves));
        }
        varPathBuffer = [];
      }
      node = node.getChild(0); // Travel down
      mt.moveDown();
    }
    return out;
  },

  /**
   * Get an initial treepath to the point where we want to create a next-moves
   * path.
   *
   * mt: The movetree
   */
  variationPaths: function(mt) {
    mt = mt.newTreeRef();
    var out = [];
    var node = mt.node();
    if (!node.getParent()) {
      // There shouldn't variations an the root, so just return.
      return out;
    }

    mt.moveUp(); 
    for (var i = 1; i < mt.node().numChildren(); i++) {
      var mtz = mt.newTreeRef();
      mtz.moveDown(i);
      mtz.recurse(function(nmtz) {
        if (!nmtz.properties().getOneValue('C')) {
          return; // Must have a comment to return the variation.
        }
        out.push(nmtz.treepathToHere());
      });
    }
    return out;
  }
};
gpub.spec.problemBook = {
  answerStyle: {
    /** No answers. */
    NONE: 'NONE',

    /** The answers go at the end of section */
    END_OF_SECTION: 'END_OF_SECTION',

    /** The answers go immediately after the page. */
    AFTER_PAGE : 'END_OF_SECTION'
  },

  /** Converts a problem set into a problem book. */
  fromProblemSet: function(spec) {
    // TODO(kashomon): Implement.
  },

  /**
   * buffer: gpub.util.Buffer, with an SGF obj.
   *
   * options:
   *  region: default region.
   *  answerStyle: See above.
   *  numAnswerVars : Defaults to 3. -1 means all variations. set to 0 if the
   *      answer style is NONE.
   */
  multi: function(buffer, sgfObj, opts) {
    var opts = opts || {};
    var answerStyle = opts.answerStyle ||
        gpub.spec.problemBook.answerStyle.END_OF_SECTION;
    var numAnswerVars = opts.numAnswerVars || 3;
    var problems = [];
    var answers = [];
    var region  = opts.region || glift.enums.boardRegions.AUTO;
    for (var i = 0; i < buffer.length; i++) {
      // We assume the problem begins at the beginning.
      var mt = buffer[i].movetree.newTreeRef();
      var name = buffer[i].name;
      var ex = gpub.spec.createExample(name, [], [], region, 'PROBLEM');
      problems.push(ex);

      var answerVars = gpub.spec.problemBook.variationPaths(mt, numAnswerVars);
      for (var j = 0; j < answerVars.length; j++) {
        var ans = gpub.spec.createExample(name, '', answerVars[j], region, 'ANSWER');
        answers.push(ans);
      }
    }
    return problems.concat(answers);
  },

  /** Create the answer-variation paths for a problem */
  variationPaths: function(mt, maxVars) {
    var out = [];
    if (maxVars === 0) {
      return out;
    }

    mt.recurseFromRoot(function(mtz) { 
      // TODO(kashomon): Support partial continuations
      // if (mtz.properties().getOneValue('C')) {
        // out.push(mtz.treepathToHere());
        // return;
      // }
      if (mtz.node().numChildren() === 0) {
        out.push(mtz.treepathToHere());
      }
    });
    if (maxVars < 0) {
      return out;
    } else {
      return out.slice(0, maxVars);
    }
  }
};
/**
 * Generates a problem set spec.
 */
gpub.spec.problemSet = {
  /**
   * Process one movetree.
   */
  one: function(mt, alias, sgfObj, options) {
    region = options.region || glift.enums.boardRegions.AUTO;
    var widgetType = options.widgetType || null;
    if (mt.getTreeFromRoot().node().numChildren() === 0) {
      widgetType = 'EXAMPLE';
    }
    var baseSgfObj = glift.util.simpleClone(sgfObj);
    if (widgetType) {
      baseSgfObj.widgetType = widgetType;
    }
    if (!baseSgfObj.url) {
      baseSgfObj.alias = alias;
    }
    return baseSgfObj;
  }
};
gpub.diagrams = {
  /**
   * Types of diagram output.
   */
  diagramType: {
    /**
     * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
     */
    GOOE: 'GOOE',

    /**
     * Josh Hoak's variant of Gooe
     */
    GNOS: 'GNOS',

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

  /**
   * Types of diagram purposes.
   */
  diagramPurpose: {
    SECTION_INTRO: 'SECTION_INTRO',

    GAME_REVIEW: 'GAME_REVIEW',
    GAME_REVIEW_CHAPTER: 'GAME_REVIEW_CHAPTER',

    PROBLEM: 'PROBLEM',
    ANSWER: 'ANSWER'
  },

  // TODO(kashomon): Remove this. Sizes are a property of the fonts, at least
  // for latex. Gooe only supports 2 sizes.  Gnos supports 8.
  sizes: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  /**
   * Generates a diagram for a specific purpose and a given format
   */
  forPurpose: function(
      flattened,
      diagramType,
      bookFormat,
      diagramPurpose,
      bookData) {
    if (!diagramType || !gpub.diagrams.diagramType[diagramType]) {
      throw new Error('Unknown diagram type: ' + diagramType);
    }
    if (!bookFormat || !gpub.book.bookFormat[bookFormat]) {
      throw new Error('Unknown diagram type: ' + bookFormat);
    }
    if (!diagramPurpose || !gpub.diagrams.diagramPurpose[diagramPurpose]) {
      throw new Error('Unknown diagram type: ' + diagramPurpose);
    }

    var bookData = bookData || {};
    var diagramString = gpub.diagrams.fromFlattened(flattened, diagramType);

    var pkg = null;
    switch(bookFormat) {
      case 'LATEX':
        pkg = gpub.diagrams.latex
        break;
      default:
        throw new Error('Unsupported book format: ' + bookFormat);
    }

    var label = null;
    switch(diagramPurpose) {
      case 'GAME_REVIEW': // fallthrough
      case 'GAME_REVIEW_CHAPTER': // fallthrough
      case 'SECTION_INTRO':
        label  = gpub.diagrams.constructLabel(
            flattened.collisions(),
            flattened.isOnMainPath(),
            flattened.startingMoveNum(),
            flattened.endingMoveNum());
        break;
      default:
        label = '';
    }

    return pkg.typeset(
        diagramString,
        diagramPurpose,
        flattened.comment(),
        label,
        flattened.isOnMainPath(),
        bookData);
  },

  /**
   * Creates a diagram-for-print! This is largely a convenience method.  Most
   * users will want
   */
  create: function(sgf, diagramType, initPos, nextMovesPath, boardRegion) {
    var flattened = this.flatten(sgf, initPos, nextMovesPath, boardRegion);
    return this.fromFlattened(flattened, diagramType);
  },

  /**
   * A flattener helper.  Returns a Flattened object, which is key for
   * generating diagrams.
   */
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  },

  /**
   * Return a diagram from a glift Flattened object.
   */
  fromFlattened: function(flattened, diagramType) {
    switch(diagramType) {
      case 'GOOE':
        return gpub.diagrams.gooe.create(flattened);
      case 'GNOS':
        return gpub.diagrams.gnos.create(flattened);
      default:
        throw new Error('Not currently supported: ' + diagramType);
    }
  },

  /**
   * Construct the label based on the collisions and the move numbers.
   * 
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  constructLabel: function(collisions, isOnMainline, startNum, endNum) {
    var baseLabel = '';
    if (isOnMainline) {
      var nums = [startNum];
      if (startNum !== endNum) {
        nums.push(endNum);
      }
      var moveLabel = nums.length > 1 ? 'Moves: ' : 'Move: ';
      baseLabel += '(' + moveLabel + nums.join('-') + ')';
    }

    if (collisions && collisions.length) {
      var buffer = [];
      for (var i = 0; i < collisions.length; i++) {
        var c = collisions[i];
        var col = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
        buffer.push(col + ' ' + c.mvnum + ' at ' + c.label);
      }
      if (baseLabel) {
        baseLabel += '\n';
      }
      baseLabel += buffer.join(', ') + '.';
    }

    return baseLabel;
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
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gooe.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
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
gpub.diagrams.gooe.latexHeaders = {
  packageDef: function() {
    return '\\usepackage{gooemacs}';
  },

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
      '\\def\\goWsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\tenpointeleven{#1}\\hss}}',
      '\\def\\goBsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\color{white}\\tenpointeleven{#1}\\color{white}\\hss}}'
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
  extraDefs: function(baseFont) {
    var defs = gpub.diagrams.gooe.latexHeaders.defs;
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
gpub.diagrams.gnos = {
  /** Available sizes. In pt. */
  sizes: {
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    14: '14',
    16: '16',
    20: '20'
  },

  /** Mapping from size to label size index. Keys in pt. */
  singleCharSizeAtTen: {
    8: 1, // tiny
    9: 2, // footnotesize
    10: 2, // footnotesize
    11: 3, // small
    12: 3, // normalsize
    14: 4, // large
    16: 5,
    20: 6
  },

  /**
   * Array of avaible latex sizes. Should probably be moved to the latex
   * package.
   */
  sizeArray: [
    'tiny',
    'scriptsize',
    'footnotesize',
    'small',
    'normalsize',
    'large',
    'Large',
    'LARGE',
    'huge',
    'Huge'
  ],

  create: function(flattened, size) {
    var size = size || gpub.diagrams.gnos.sizes['12'];
    return gpub.diagrams.gnos.gnosStringArr(flattened, size).join('\n');
  },

  createSimple: function(flattened, size) {
    var size = size || gpub.diagrams.gnos.sizes['12'];
    return gpub.diagrams.gnos.gnosStringArrSimple(flattened, size).join('\n');
  },

  gnosStringArrSimple: function(flattened, size) {
    var base = [
      '\\gnosfontsize{' + size + '}',
      '\\gnos'];
    var latexNewLine = '\\\\';
    var board = gpub.diagrams.gnos.gnosBoard(flattened, size);
    for (var i = 0, arr = board.boardArray(); i < arr.length; i++) {
      base.push(arr[i].join('') + latexNewLine);
    }
    return base;
  },

  gnosStringArr: function(flattened, size) {
    var latexNewLine = '\\\\';
    var header = [
        '\\gnosfontsize{' + size + '}',
        '{\\gnos'];
    var footer = '}';
    var board = gpub.diagrams.gnos.gnosBoard(flattened, size);
    for (var i = 0, arr = board.boardArray(); i < arr.length; i++) {
      header.push(arr[i].join('') + latexNewLine);
    }
    header.push(footer);
    return header;
  },

  /** Returns a flattener-symbol-board. */
  gnosBoard: function(flattened, size) {
    var size = size || '12';
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gnos.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
      if (i.textLabel() && i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        symbol = gpub.diagrams.gnos.getLabelDef(i.textLabel(), i.stone(), size);
      } else if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      }

      if (symbolMap[symbol]) {
        out = symbolMap[symbol];
      } else {
        out = symbolMap.EMPTY;
      }
      var lbl = i.textLabel();
      if (lbl) {
        out = gpub.diagrams.gnos._processTextLabel(symbol, out, lbl, size);
      } else if (i.mark() && !i.stone()) {
        out = gpub.diagrams.gnos.symbolMap.markOverlap(
            symbolMap[toStr(i.base())], out);
      }
      return out;
    });
    return newBoard;
  },

  /**
   * This needs some explanation because it's kinda nuts.
   *  - I prefer the raw fonts for double-character fonts.
   *  - I prefer the GOOE style gnosb/gnosw built-ins for >3 chars (e.g., 234)
   *  - At 8 point, the tiny font looks terrible, so defer to the gnosb/gnosw
   * label: string or null
   * stone: number symbol or null
   * size: string.  Size of the gnos font
   */
  getLabelDef: function(label, stone, size) {
    var toStr = glift.flattener.symbolStr;
    size = size + ''; // Ensure a string
    if (label && /^\d+$/.test(label) && stone &&
        (size === '8' || label.length >= 3)) {
      var num = parseInt(label);
      var stoneStr = toStr(stone)
      if (num > 0 && num < 100) {
        return stoneStr + '_' + 'NUMLABEL_1_99';
      } else if (num >= 100 && num < 200) {
        return stoneStr + '_' + 'NUMLABEL_100_199';
      } else if (num >= 200 && num < 299) {
        return stoneStr + '_' + 'NUMLABEL_200_299';
      } else if (num >= 300 && num < 399) {
        return stoneStr + '_' + 'NUMLABEL_300_399';
      }
    } else if (stone && label) {
      return toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      return 'TEXTLABEL';
    }
  },

  /**
   * Apply the label to the symbol value.
   */
  _processTextLabel: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      lbl = parseInt(label) % 100;
      return symbolVal.replace('%s', lbl);
    } else {
      // Make smaller for labels 2+ characters long
      var sizeIdx = gpub.diagrams.gnos.singleCharSizeAtTen[size] || 3;
      if (label.length > 1) {
        sizeIdx--;
      }
      var sizeMod = '\\' + (gpub.diagrams.gnos.sizeArray[sizeIdx] || 'tiny');
      return symbolVal.replace('%s', sizeMod + '{' + label + '}');
    }
  }
};
gpub.diagrams.gnos.latexHeaders = {
  packageDef: function(){ 
    return '\\usepackage{gnos}';
  },

  extraDefs: function(baseFont) {
    return '';
  }
};
/**
 * Symbol map.
 */
gpub.diagrams.gnos.symbolMap = {
  /** Placeholder symbol. */
  EMPTY: '\\gnosEmptyLbl{_}',

  /** Base layer. */
  TL_CORNER: '<',
  TR_CORNER: '>',
  BL_CORNER: ',',
  BR_CORNER: '.',
  TOP_EDGE: '(',
  BOT_EDGE: ')',
  LEFT_EDGE: '\\char91',
  RIGHT_EDGE: ']',
  CENTER: '+',
  CENTER_STARPOINT: '*',

  /**
   * Stone layer. We don't display the base layer if a stone layer exists.
   */
  BSTONE: '@',
  WSTONE: '!',

  /**
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
   */
  BSTONE_TRIANGLE: 'S',
  WSTONE_TRIANGLE: 's',
  TRIANGLE: '3',
  BSTONE_SQUARE: 'S',
  WSTONE_SQUARE: 's',
  SQUARE: '2',
  BSTONE_CIRCLE: 'C',
  WSTONE_CIRCLE: 'c',
  CIRCLE: '1',
  BSTONE_XMARK: 'X',
  WSTONE_XMARK: 'x',
  XMARK: '4',
  BSTONE_TEXTLABEL: '\\gnosOverlap{@}{\\color{white}%s}',
  WSTONE_TEXTLABEL: '\\gnosOverlap{!}{%s}',
  TEXTLABEL: '\\gnosEmptyLbl{%s}',

  BSTONE_NUMLABEL_1_99: '{\\gnosb\\char%s}',
  BSTONE_NUMLABEL_100_199: '{\\gnosbi\\char%s}',
  BSTONE_NUMLABEL_200_299: '{\\gnosbii\\char%s}',
  BSTONE_NUMLABEL_300_399: '{\\gnosbiii\\char%s}',

  WSTONE_NUMLABEL_1_99: '{\\gnosw\\char%s}',
  WSTONE_NUMLABEL_100_199: '{\\gnoswi\\char%s}',
  WSTONE_NUMLABEL_200_299: '{\\gnoswii\\char%s}',
  WSTONE_NUMLABEL_300_399: '{\\gnoswiii\\char%s}',

  markOverlap: function(a, b) {
    return '\\gnosOverlap{' + a + '}{\\gnos' + b + '}';
  }
};
gpub.diagrams.igo = {
  create: function(flattened) {

  }
};
/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(sgfobj) {

  }
};
/**
 * Some basic LaTeX definitions. This should perhaps be its own directory, once
 * more styles are added.
 */
gpub.diagrams.latex = {
  /**
   * Sanitizes latex input. This isn't particularly robust, but it is meant to
   * protect us against accidental characters.
   */
  sanitize: function(text) {
    return text.replace(/[$#}{]/g, function(match) {
      return '\\' + match;
    });
  },

  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(str, purpose, comment, label, isMainLine, bookData) {
    comment = this.sanitize(comment);

    var camelCaseName = glift.enums.toCamelCase(purpose)
    var func = gpub.diagrams.latex[camelCaseName];
    switch(purpose) {
      case 'GAME_REVIEW':
      case 'GAME_REVIEW_CHAPTER':
        var baseLabel = isMainLine ? '\\gofigure' : '\\godiagram';
        if (label) {
          var splat = label.split('\n');
          for (var i = 0; i < splat.length; i++ ) {
            baseLabel += '\n\n\\subtext{' + splat[i] + '}';
          }
        }
        var label = baseLabel;
        break;
      default:
        // Do nothing.  This switch is for processing the incoming label.
    }
    return func(str, comment, label, bookData);
  },

  /**
   * Return a section intro.
   */
  sectionIntro: function(diagramString, comment, label, bookData) {
    var part = bookData.sectionTitle || '';
    var chapter = bookData.chapterTitle || '';
    return [
      '\\part{' + part + '}',
      '\\chapter{' + chapter + '}',
      comment
    ].join('\n');
  },

  /**
   * Generate a GAME_REVIEW diagram.
   *
   * diagramString: Literal string for the diagram
   * comment: Comment for diagram
   * label: Diagram label
   *
   * returns: filled-in latex string.
   */
  gameReview: function(diagramString, comment, label) {
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
  gameReviewChapter: function(diagramString, comment, label, bookdata) {
    return [
      '\\chapter{' + bookdata.chapterTitle + '}',
      '{\\centering',
      diagramString,
      '}',
      label,
      '',
      comment,
      '\\vfill'].join('\n');
  },

  problem: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
  },

  answer: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
  }
};
/**
 * Diagram label macros. For making Figure.1, Dia.1, etc.
 *
 * This is the basic style.  Used for games, primarily.
 * Defines:
 *  \gofigure: mainline variations.
 *  \godiagram: variation diagrams.
 */
gpub.diagrams.latex.diagramDefs = function(diagramPurpose) {
  // TODO(kashomon): Switch off of diagramPurpose.
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
};
gpub.templates = {};

/**
 * A representation of a GPub template. Like normal HTML templating, but quite
 * a bit simpler.
 */
gpub.templates._Template = function(sections, paramMap) {
  this._sections = sections;
  this._paramMap = paramMap;
  this._paramContent = {};
};

gpub.templates._Template.prototype = {
  /** Compiles the template with the new template variables. */
  compile: function() {
    var sectionsCopy = this._sections.slice(0);
    for (var key in this._paramMap) {
      var idx = this._paramMap[key];
      var content = this._paramContent[key] || '';
      sectionsCopy[idx] = content;
    }
    return sectionsCopy.join('');
  },

  /** Returns true if the template has parameter given by 'key' */
  hasParam: function(key) {
    return !!this._paramMap[key];
  },

  /** Sets a template parameter. */
  setParam: function(key, value) {
    if (!this._paramMap[key]) {
      throw new Error('Unknown key: ' + key);
    }
    this._paramContent[key] = value.toString();
  }
};
/**
 * Basic latex template. Generally, these should be defined as the relevant
 * filetype (e.g., .tex).  However, this is defined within javascript for
 * convenience.
 */
gpub.templates.latexBase = [
'\\documentclass[letterpaper,12pt]{memoir}',
'\\usepackage{color}',
'\\usepackage{wrapfig}',
'\\usepackage{setspace}',
'\\usepackage{unicode}',
'\\usepackage[margin=1in]{geometry}',
'%%% Define any extra packages %%%',
'{{ extraPackages }}',
'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',
'%%% Extra defs',
'% Necessary for the particular digaram type.',
'{{ diagramTypeDefs }}',
'',
'%%% Diagram Figure defs.',
'% Must expose two commands',
'%  \\gofigure  (mainline diagrams)',
'%  \\godiagram (variation diagrams)',
'{{ diagramWrapperDefs }}',
'',
'%%% Define the main title %%%',
'{{ mainBookTitleDef }}',
'',
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
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
'',
'%%% The content. %%%',
'{{ content }}',
'',
'\\end{document}'].join('\n');
/**
 * Parse a latexTemplate.  LaTeX templates are only special in that they require
 * several specific parameters.  The parse step validates that these parameters
 * exist.
 */
gpub.templates.parseLatexTemplate = function(str) {
  var expectedParams = [
    'extraPackages',
    'diagramTypeDefs',
    'diagramWrapperDefs',
    'mainBookTitleDef',
    'content'
  ]
  var template = gpub.templates.parse(str);
  expectedParams.forEach(function(key) {
    if (!template.hasParam(key)) {
      throw new Error('Expected template to have key: ' + key);
    }
  });
  return new gpub.templates.LatexTemplate(template);
};

gpub.templates.LatexTemplate = function(template) {
  /** A parsed GPub template. */
  this._template = template;
};

gpub.templates.LatexTemplate.prototype = {
  setExtraPackages: function(str) {
    this._template.setParam('extraPackages', str);
    return this;
  },
  setDiagramTypeDefs: function(str) {
    this._template.setParam('diagramTypeDefs', str);
    return this;
  },
  setDiagramWrapperDefs: function(str) {
    this._template.setParam('diagramWrapperDefs', str);
    return this;
  },
  setTitleDef: function(str) {
    this._template.setParam('mainBookTitleDef', str);
    return this;
  },
  setContent: function(str) {
    this._template.setParam('content', str);
    return this;
  },
  compile: function() {
    return this._template.compile();
  }
};
/**
 * A simplistic template parser.
 */
gpub.templates.parse = function(template) {
  var sections = [];
  var paramMap = {}; // key to position
  var states = {
    DEFAULT: 'DEFAULT',
    IN_PARAM: 'IN_PARAM'
  };
  var curstate = states.DEFAULT;
  var buffer = [];
  var prev = null;
  var position = 0;
  for (var i = 0; i < template.length; i++) {
    var c = template.charAt(i);
    switch(curstate) {
      case 'DEFAULT':
        if (c === '{') {
          if (prev === '{') {
            sections.push(buffer.join(''));
            curstate = states.IN_PARAM;
            position++;
            buffer = [];
          }
          // Else move on
        } else {
          if (prev === '{') buffer.push(prev);
          buffer.push(c);
        }
        break;
      case 'IN_PARAM':
        if (c === '}') {
          if (prev === '}') {
            sections.push(null);
            var param = buffer.join('').replace(/^\s*|\s*$/g, '');
            paramMap[param] = position;
            position++;
            curstate = states.DEFAULT;
            buffer = [];
          }
          // else ignore and move on
        } else {
          buffer.push(c)
        }
        break
      default: 
        throw new Error('Unknown state: ' + curstate);
    }
    prev = c;
  }
  sections.push(buffer.join(''));
  return new gpub.templates._Template(sections, paramMap);
};
