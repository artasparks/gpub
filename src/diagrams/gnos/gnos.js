gpub.diagrams.gnos = {
  /** Available sizes. In pt*/
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

  create: function(flattened, size) {
    return gpub.diagrams.gnos.gnosStringArray(flattened, size).join('\n');
  },

  gnosStringArray: function(flattened, size) {
    var size = size || gpub.diagrams.gnos.sizes.12;
    var header = [
        '{',
        '\\gnosfontsize{' + size + '}',
        '{\\gnos\n'].join('\n');
    var footer = '}}';
  }

  /** Returns a flattener-symbol-board. */
  gnosBoard: function(flattened, size) {
    var toStr = glift.flattener.symbolStr;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base());
    });
  }
};
