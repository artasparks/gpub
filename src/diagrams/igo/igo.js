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
    var letters = 'abcdefghjklmnopqrstuvwxyz';
    var symbolStr = glift.flattener.symbolStr;
    var wInts = [];
    var bInts = [];

    var size = flattened.board.maxBoardSize();
    var toPt = glift.util.pointFromString;
    var toIgoCoord  = function(pt) {
      var x = letters.charAt(pt.x());
      var y = size - pty.y();
      return x+y;
    }

    var seenPts = {};
    var stoneMap = flattened.stoneMap();

    var procMarks = {
      BLACK: {
        XMARK: [],
        SQUARE: [],
        TRIANGLE: [],
        CIRCLE: []
      },
      WHITE: {
        XMARK: [],
        SQUARE: [],
        TRIANGLE: [],
        CIRCLE: []
      }
    };

    var markToGlyph = {
      XMARK: '\\igocross',
      SQUARE: '\\igosquare',
      TRIANGLE: '\\igotriangle',
      CIRCLE: '\\igocircle'
    };

    for (var ptstr in flattened.markMap()) {
      var mark = flattened.markMap()[ptstr];
      // Note: Igo does *not* support marks (except for text) on empty
      // intersections, so we must makes user that there are intersections on 
      if (stoneMap[ptstr] &&
          stoneMap[ptstr].color &&
          mark != glift.flattened.symbols.TEXTLABEL) {
        var stone = stoneMap[ptstr];
        procMarks[stone.color][symbolStr(mark)] = toIgoCoord(toPt(ptstr));
        seenPts[ptstr] = true;
      } else if (mark != glift.flattened.symbols.TEXTLABEL) {
        // Handle separately
      }
    }

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

    var out = [
      '\\cleargoban',
    ]

    return out.join('\n');
  },
  /**
   * Render go stones that exist in a block of text.
   */
  renderInline: function(text, options) {
    // TODO(kashomon): Implement at some point. See gnos for an example.
    return text;
  }
};
