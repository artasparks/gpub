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

  /**
   * The create method!
   * 
   * We expect flattened and options to be edfined
   */
  create: function(flattened, options) {
    options.size = options.size || gpub.diagrams.gnos.sizes['12'];
    return gpub.diagrams.gnos.gnosStringArr(flattened, options.size).join('\n');
  },

  _inlineWrapper: '{\\raisebox{-.17em}{\\textnormal{%s}}}',

  /** Render go stones that exist in a block of text. */
  renderInline: function(text, options) {
    var options = options || {}; // TODO(kashomon): Remove hack. Push up a level.
    var fontsize = options.size || gpub.diagrams.gnos.sizes['12'];
    // TODO(kashomon): The font size needs to be passed in here so we can select
    // the correct label size. Moreover, we need to use get getLabelDef to be
    // consistent between the diagram and inlined moves.
    return text.replace(/((Black)|(White)) (([A-Z])|([0-9]+))(?=([^a-z]|$))/g,
        function(fullmatch, p1, xx2, xx3, p4) {
      var stone = null;
      var label = p4;
      if (p1 === 'Black') {
        stone = glift.flattener.symbols.BSTONE;
      } else if (p1 === 'White') {
        stone = glift.flattener.symbols.WSTONE;
      } else {
        return fullmatch; // Shouldn't ever happen.
      }
      var labelSymbol = gpub.diagrams.gnos.getLabelDef(label, stone, fontsize);
      var labelSymbolVal = gpub.diagrams.gnos.symbolMap[labelSymbol];
      var processed = gpub.diagrams.gnos._processTextLabel(
          labelSymbol, labelSymbolVal, label, fontsize);
      return gpub.diagrams.gnos._inlineWrapper.replace('%s', processed);
    });
  },

  ///////////////////////
  // 'private' helpers //
  ///////////////////////

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
        out = gpub.diagrams.gnos._processTextLabel(
            symbol, out, lbl, size, true);
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
      } else {
        return toStr(stone) + '_' + 'TEXTLABEL';
      }
    } else if (stone && label) {
      return toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      return 'TEXTLABEL';
    }
  },

  /**
   * Apply the label to the symbol value. Note: We shouldn't ever need 3 digit
   * number-strings, since we have special fonts (gnosbi,gnoswii, etc.) that
   * use the format \\gnosbi\char\d\d.
   */
  _processTextLabel: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      lbl = parseInt(label) % 100;
      return symbolVal.replace('%s', lbl);
    } else {
      // TODO(kashomon): This looks like dead code, except for if the label is a
      // non-number.

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
