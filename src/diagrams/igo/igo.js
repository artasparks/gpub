/**
 *
 * Creates igo-diagrams. Note: This is only for creating books using latex.
 */
gpub.diagrams.igo = {
  /** Font sizes supported by igo. */
  fontSize: {
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    15: 15,
    20: 20
  },

  /** Converts a normal Glift point into an Igo coordinate. */
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
   * Also note: For Igo, Go boards are indexed from the bottom as coordinates of
   * the form <letter><number>:
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
  create: function(flattened, options) {
    var size = options.size;
    var symbolStr = glift.flattener.symbolStr;
    var wInts = [];
    var bInts = [];

    var size = flattened.board.maxBoardSize();

    for (var ptstr in flattened.stoneMap()) {
      if (proc[ptstr]) {
        // We already processed this stone during the mark-phase
        continue;
      }
      var stone = flattened.stoneMap()[ptstr];
      if (stone.color === glift.enums.states.WHITE) {
        wInts.push(toIgoCoord(toPt(ptstr)));
      } else if (stone.color === glift.enums.states.BLACK) {
        bInts.push(toIgoCoord(toPt(ptstr)));
      } else {
        // Somehow, there's no color for the move. Which is strange.
      }
    }

    // Glyphs are used in the context: \white|black[glyph]{intersection-pairs}
    var markToGlyph = {
      XMARK: '\\igocross',
      SQUARE: '\\igosquare',
      TRIANGLE: '\\igotriangle',
      CIRCLE: '\\igocircle'
    };

    var out = [
      '\\cleargoban',
    ]

    return out.join('\n');
  },

  /**
   * Process the marks into something more useful for Igo.
   * Takes the following maps:
   * - markMap : map from ptString to mark type
   * - stoneMap : map from ptString to stone obj
   * - labelMap : map from ptString to label string
   */
  _processMarks: function(markMap, stoneMap, labelMap) {
    var seenPts = {};

    // With stoneMarks, we attempt find sequences of stones, which allows for
    // more compact diagram descriptions
    var stoneTextLabels = [];

    // Has the format
    // {Color:Mark:[]} -- array of ptstr, or text label objects of the form
    //    {ptstr: '1,2', label: 'textlabel'}
    // where color os one of BLACK, WHITE or EMPTY and marks are the output of
    // glift.flattener.symbolStr(flattener symbol)
    var procMarks = {
      BLACK: {
        XMARK: [], SQUARE: [], TRIANGLE: [], CIRCLE: [],
      },
      WHITE: {
        XMARK: [], SQUARE: [], TRIANGLE: [], CIRCLE: [], TEXTLABEL: []
      },
      EMPTY: {
        TEXTLABEL: []
      }
    };
    var number = /^\d+$/;

    for (var ptstr in markMap) {
      var mark = markMap[ptstr];
      if (stoneMap[ptstr] && stoneMap[ptstr].color) {
        // Note: Igo does not support marks (except for number-labels) on
        // empty intersections.
        if (mark !== glift.flattened.symbols.TEXTLABEL) {
          var stone = stoneMap[ptstr];
          procMarks[stone.color][symbolStr(mark)] = toIgoCoord(toPt(ptstr));
          seenPts[ptstr] = true;
        } else if (mark === glift.flattened.symbols.TEXTLABEL &&
            flattened.labelMap()[ptstr] &&
            number.test(flattened.labelMap()[ptstr])) {
          // Only number-labels are support on stones.
          // TODO(kashomon): Since Igo supports special constructions for
          // consecutive stones, this constructions hould be supported here
          stoneTextLabels.push({
            ptstr: ptstr,
            color: color,
            label: flattened.labelMap()[ptstr]
          });
        }
      } else if (mark == glift.flattened.symbols.TEXTLABEL) {
        // Arbitrary *text* labels are supported for empty intersections.
        proc[EMPTY][TEXTLABEL] =  {
          ptstr: ptstr,
          label: flattened.labelMap()[ptstr]
        };
      }
      // There are several opportunities for marks to not get caught here. Igo
      // doesn't have support for:
      // - Empty intersections with marks
      // - Stones with labels other than numbers
    }
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
