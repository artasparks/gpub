goog.provide('gpub.diagrams.gnos');

/**
 * Gnos is a modification of the Gooe font series.
 * See https://github.com/Kashomon/go-type1.
 */
gpub.diagrams.gnos = {
  /**
   * Available font sizes for the gno characters, in pt.
   * @type{!Object<number, number>}
   */
  fontSize: {
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    14: 14,
    16: 16,
    20: 20
  },

  /**
   * Mapping from size to label size index. Keys in pt.
   * @type {!Object<number, number>}
   */
  singleCharSizeAtTen: {
    8: 1, // tiny
    9: 2, // footnotesize
    10: 2, // footnotesize
    11: 3, // small
    12: 3, // normalsize
    14: 4, // large
    16: 5, // Large
    20: 6  // LARGE
  },

  /**
   * Array of avaible latex sizes. Should probably be moved to the latex
   * package. It's sort of unpleasant that this is an array, but the reason is
   * that we sometimes bump the size up or down by one and latex sizes are
   * binned into the following (sequential) sizes.
   *
   * @type {!Array<string>}
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
   * We expect flattened and options to be defined.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string}
   */
  create: function(flat, opt) {
    var optSize = opt.goIntersectionSize;
    if (optSize) {
      optSize = gpub.util.size.parseSizeToPt(optSize);
    } else {
      optSize = 12;
    }
    if (!gpub.diagrams.gnos.fontSize[optSize]) {
      throw new Error('Font size not supported by Gnos diagarm type: ' + optSize
          + '. Supported font sizes: ' + Object.keys(gpub.diagrams.gnos.fontSize));
    }
    return gpub.diagrams.gnos.gnosString_(flat, optSize);
  },

  // TODO(kashomon): This should really be a macro.
  /** @private {string} */
  inlineWrapper_: '{\\raisebox{-.17em}{\\textnormal{%s}}}',

  /**
   * Render go stones that exist in a block of text.
   *
   * In particular, replace the phrases Black \d+ and White \d+ with
   * the relevant stone symbols i.e. Black 123 => \\gnosbi\\char23
   *
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} options
   * @return string
   */
  renderInline: function(text, options) {
    options = options || {}; // TODO(kashomon): Remove hack. Push up a level.
    var fontsize = gpub.util.size.parseSizeToPt(
        options.goIntersectionSize || gpub.diagrams.gnos.fontSize[12]);
    fontsize = Math.round(fontsize);
    // TODO(kashomon): The font size needs to be passed in here so we can select
    // the correct label size. Moreover, we need to use get getLabelDef to be
    // consistent between the diagram and inlined moves.
    return gpub.diagrams.replaceInline(text, function(full, player, label) {
      var stone = null;
      if (player === 'Black') {
        stone = glift.flattener.symbols.BSTONE;
      } else if (player === 'White') {
        stone = glift.flattener.symbols.WSTONE;
      } else {
        throw new Error('Error processing inline label! '
            + 'player != White && player != Black');
      }
      var labelSymbol = gpub.diagrams.gnos.getLabelDef(label, stone, fontsize);
      var labelSymbolVal = gpub.diagrams.gnos.Symbol[labelSymbol];
      var processed = gpub.diagrams.gnos.processTextLabel_(
          labelSymbol, labelSymbolVal, label, fontsize);
      return gpub.diagrams.gnos.inlineWrapper_.replace('%s', processed);
    });
  },

  ///////////////////////
  // 'private' helpers //
  ///////////////////////
  /**
   * Produce a gnos string array of lines.
   * @param {!glift.flattener.Flattened} flattened
   * @param {!number} size
   * @return {string} the rendered diagram
   * @private
   */
  gnosString_: function(flattened, size) {
    var latexNewLine = '\\\\';
    var buffer = '\\gnosfontsize{' + size + '}' +
        '{\\gnos'
    var footer = '}';
    var board = gpub.diagrams.gnos.gnosBoard_(flattened, size);
    for (var i = 0, arr = board.boardArray(); i < arr.length; i++) {
      buffer += arr[i].join('') + latexNewLine;
    }
    buffer += footer
    return buffer;
  },

  /**
   * Returns a flattener-symbol-board that's been transformed for into a
   * series of latex/gnos symbols.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @param {number} size
   * @return {!glift.flattener.Board<string>}
   * @private
   */
  gnosBoard_: function(flattened, size) {
    var toStr = glift.flattener.symbolStr;
    var Symbol = gpub.diagrams.gnos.Symbol;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
      if (i.textLabel() && i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        symbol = gpub.diagrams.gnos.getLabelDef(
            flattened.autoTruncateLabel(i.textLabel()), i.stone(), size);
      } else if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      }

      var out;
      if (Symbol[symbol]) {
        out = Symbol[symbol];
      } else {
        out = Symbol['EMPTY'];
      }
      var lbl = flattened.autoTruncateLabel(i.textLabel());
      if (lbl) {
        out = gpub.diagrams.gnos.processTextLabel_(
            symbol, out, lbl, size);
      } else if (i.mark() && !i.stone()) {
        out = gpub.diagrams.gnos.markOverlap_(
            Symbol[toStr(i.base())], out);
      }
      return out;
    });
    return newBoard;
  },

  /**
   * Mark a symbol as overlapping another symbol.
   *
   * @param {string} a Gnos symbol transformation
   * @param {string} b Gnos symbol transformation
   * @return {string}
   */
  markOverlap_: function(a, b) {
    return '\\gnosOverlap{' + a + '}{\\gnos' + b + '}';
  },

  /**
   * This needs some explanation because it's kinda nuts.
   *  - I prefer the raw fonts for double-character fonts.
   *  - I prefer the GOOE style gnosb/gnosw built-ins for >3 chars (e.g., 234)
   *  - At 8 point, the tiny font looks terrible, so defer to the gnosb/gnosw
   * label: string or null
   * stone: number symbol or null
   * size: string.  Size of the gnos font
   *
   * @param {string} label
   * @param {glift.flattener.symbols} stone
   * @param {number} sizeNum
   * @return {string} key
   */
  getLabelDef: function(label, stone, sizeNum) {
    var toStr = glift.flattener.symbolStr;
    var size = sizeNum + ''; // Ensure a string
    var out = '';
    if (label && /^\d+$/.test(label) && stone &&
        (size === '8' || label.length >= 3)) {
      var num = parseInt(label, 10);
      var stoneStr = toStr(stone)
      if (num > 0 && num < 100) {
        out = stoneStr + '_' + 'NUMLABEL_1_99';
      } else if (num >= 100 && num < 200) {
        out = stoneStr + '_' + 'NUMLABEL_100_199';
      } else if (num >= 200 && num < 299) {
        out = stoneStr + '_' + 'NUMLABEL_200_299';
      } else if (num >= 300 && num < 399) {
        out = stoneStr + '_' + 'NUMLABEL_300_399';
      } else {
        out = toStr(stone) + '_' + 'TEXTLABEL';
      }
    } else if (stone && label) {
      out = toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      out ='TEXTLABEL';
    }
    if (!gpub.diagrams.gnos.Symbol[out]) {
      // This shouldn't happen if I've written this method correctly.
      throw new Error('Programming error! Symbol [' + out + '] not defined in'
          + ' gpub.diagrams.gnos.Symbol');
    }
    return out;
  },

  /**
   * Apply the label to the symbol value. There are two cases:
   *
   * (1) Numbers using built-in Gnos NUMBLABEL fonts
   * We have special fonts for (gnosbi,gnoswii, etc.) that use the format
   * \\gnosbi\char{2}\d. Tho Gnos fonts accept precisely two characters.
   *
   * (2) Everything else. In this case, the characters are just overlayed
   * on the stone directly.
   *
   * @param {string} symbol Key in into gpub.diagrams.gnos.Symbol.
   * @param {string} symbolVal Element of gpub.diagrams.gnos.Symbol.
   * @param {string} label The text to place on a stone (usu. numbers).
   * @param {number} size The font size. Must be a supported gnos font size.
   * @return {string}
   * @private
   */
  processTextLabel_: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      // NUMLABEL are  a special categories of number-labeling where we use the
      // built-in font.  Each of these NUMLABEL fonts accept two characters.
      var lbl = parseInt(label, 10) % 100;
      if (isNaN(lbl)) {
        // Programming error:
        throw new Error('Regex thought that lbl was a number, but it was not! '
            + 'Was: ' + lbl);
      }
      return symbolVal.replace('%s', lbl + '');
    } else {
      // Here, we just overlay text on a stone.
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
