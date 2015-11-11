/**
 * The GPub Ascii format. Note the similarity to SGF specification.
 *
 * Note that the board is indexed from 1,1, from the upper left.
 *
 * .........
 * ......^..
 * ...%.....
 * .....%...
 * ..@.+....
 * ......X..
 * ....OOX..
 * ....OX...
 * .........
 *
 * (3,5):Triangle
 * (4,3),(6,4):A
 * (7,1):Square
 * C: A balanced 9x9 game!
 *
 * Legend
 * . :: Board
 * + :: Starpoint (optional).
 * O :: White Stone
 * X :: Black Stone
 * @ :: White Stone + label or mark
 * % :: Black Stone + label or mark
 * ^ :: Empty Intersection + label or mark
 */
gpub.diagrams.gpubAscii = {
  create: function(flattened, opts) {
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gpubAscii.symbolMap;

    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base());
      if (i.textLabel() &&
          i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        var label = i.textLabel();
      } else if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      } // default case: symbol is the base.

      var out = symbolMap[symbol];
      if (!out) {
        console.log('Could not find symbol str for : ' + symbol);
      }
    });

    var out = [];
    for (var i = 0, arr = newBoard.boardArray(); i < arr.length; i++) {
    }
    return out;
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for ascii rendering.
    return text;
  }
};
