goog.provide('gpub.diagrams.igo');

/**
 *
 * Creates igo-diagrams. Note: This is only for creating books using latex.
 */
gpub.diagrams.igo = {
  /**
   * Font sizes supported by igo.
   * @enum {number}
   */
  FontSize: {
    C5: 5,
    C6: 6,
    C7: 7,
    C8: 8,
    C9: 9,
    C10: 10,
    C11: 11,
    C12: 12,
    C15: 15,
    C20: 20
  },

  /**
   * Converts a normal Glift point into an Igo coordinate.
   *
   * Note: For Igo, Go boards are indexed from the bottom-left as
   * coordinates of the form <letter><number>:
   *  a12
   *  g5
   * - Numbers are 1 indexed
   * - i is not used for intersections
   *
   * So, the boards look like this:
   *   ...
   *   ^
   *   2
   *   ^
   *   1
   *     a->b->c->d->e->f->g->h->j->k->l...
   */
  toIgoCoord: function(pt, size) {
    if (!pt) { throw new Error('No point'); }
    if (!size) { throw new Error('No board size'); }
    if (pt.x() < 0 || pt.y() < 0 || pt.x() > size-1 || pt.y() > size-1) {
      throw new Error('Pt out of bounds: ' + pt.toString());
    }
    var letters = 'abcdefghjklmnopqrstuvwxyz';
    var x = letters.charAt(pt.x());
    var y = size - pt.y();
    return x+y;
  },

  /**
   * Create a diagram from a flattened representation.
   *
   * Unlike many other diagram-generators, Igo has lots of built-in logic in the
   * TEX style. Thus, we need only display the stones and marks.
   *
   */
  create: function(flattened, options) {
    var optSize = options.size || 10;
    var fontSize = gpub.diagrams.igo.FontSize['C' + optSize] ||
        gpub.diagrams.igo.FontSize.C10;

    var boardSize = flattened.board().maxBoardSize();
    var symbolStr = glift.flattener.symbolStr;

    var intersections = gpub.diagrams.igo.processIntersections(
        flattened.marks(), flattened.stoneMap(), flattened.labels());

    // Glyphs are used in the context: \white|black[glyph]{intersection-pairs}
    var markToGlyph = {
      XMARK: '\\igocross',
      SQUARE: '\\igosquare',
      TRIANGLE: '\\igotriangle',
      CIRCLE: '\\igocircle'
    };

    var out = [
        '\\cleargoban',
        '\\gobansize{' + boardSize + '}',
        '\\igofontsize{' + fontSize + '}'
    ];

    var toPt = glift.util.pointFromString;
    var toIgoCoord = gpub.diagrams.igo.toIgoCoord;
    var convertPtArr = function(convArr) {
      var out = [];
      for (var i = 0; i < convArr.length; i++) {
        out.push(toIgoCoord(toPt(convArr[i]), boardSize));
      }
      return out.join(',');
    }
    // First add the stones without labels;
    for (var color in intersections.blankStones) {
      var arr = intersections.blankStones[color];
      if (arr.length === 0) { continue; }
      var decl = '\\' + color.toLowerCase() + '{';
      out.push(decl + convertPtArr(arr) + '}');
    }
    // Next, add sequences.
    for (var i = 0; i < intersections.sequences.length; i++) {
      var seq = intersections.sequences[i];
      if (seq.length === 0) { continue; }
      var color = seq[0].color;
      var startNum = seq[0].label;
      var decl = '\\' + color.toLowerCase() + '[' + startNum + ']{';
      var row = [];
      for (var i = 0; i < seq.length; i++) {
        if (seq[i]) {
          row.push(toIgoCoord(toPt(seq[i].ptstr), boardSize));
        } else {
          // There's a sequence break here
          row.push('-');
        }
      }
      out.push(decl + row.join(',') + '}');
    }
    // Now, add stone-marks.
    for (var color in intersections.marks) {
      var marksForColor = intersections.marks[color];
      for (var markstr in marksForColor) {
        var marr = marksForColor[markstr];
        if (marr.length === 0) { continue; }
        var decl = '\\' + color.toLowerCase() + '[' +
            markToGlyph[markstr] + ']{';
        out.push(decl + convertPtArr(marr) + '}');
      }
    }
    // Lastly, add the empty-intersection labels
    for (var label in intersections.emptyTextLabels) {
      var larr = intersections.emptyTextLabels[label];
      if (larr.length === 0) { continue; }
      var decl = '\\gobansymbol{';
      var trailer =  '}{' + label + '}';
      out.push(decl + convertPtArr(larr) + trailer);
    }
    // TODO(kashomon): Add cropping here
    out.push('\\showgoban');

    return out.join('\n');
  },

  /**
   * Render go stones that exist in a block of text.
   */
  renderInline: function(text, options) {
    // TODO(kashomon): Implement at some point. See gnos for an example. IGO has
    // good support for inline stones, so it shouldn't be too much trouble.
    return text;
  }
};
