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

  /** Mapping from size to label size. Keys in pt. */
  sizeToModAtTen: {
    8: 'tiny',
    9: 'scriptsize',
    10: 'scriptsize',
    11: 'footnotesize',
    12: 'footnotesize',
    14: 'small',
    16: 'normalsize',
    20: 'Large'
  },

  sizeToModAtTwelve: {
    8: 'tiny',
    9: 'scriptsize',
    10: 'scriptsize',
    11: 'footnotesize',
    12: 'footnotesize',
    14: 'small',
    16: 'normalsize',
    20: 'Large'
  },

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
        if (/^\d+$/.test(lbl) && /NUMLABEL/.test(symbol)) {
          lbl = parseInt(lbl) % 100;
        }
        out = out.replace('%s', lbl);
      }
      return out;
    });
    return newBoard;
  },

  /**
   * label: string or null
   * stone: number symbol or null
   * size: string
   */
  getLabelDef: function(label, stone, size) {
    var toStr = glift.flattener.symbolStr;
    if (/^\d+$/.test(label) && stone) {
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
  }
};
