/**
 * ASCII in the Sensei's library format.  See: 
 * http://senseis.xmp.net/?HowDiagramsWork
 *
 * Example:
 * $$ A [joseki] variation
 * $$  ------------------
 * $$ | . . . . . . . . .
 * $$ | . . . . . . . . .
 * $$ | . . 7 3 X d . . .
 * $$ | . . O 1 O 6 . . .
 * $$ | . . 4 2 5 c . . .
 * $$ | . . 8 X a . . . .
 * $$ | . . . b . . . . .
 * $$ | . . . . . . . . .
 * $$ | . . . . . . . . .
 */
gpub.diagrams.senseisAscii = {
  create: function(flattened, opts) {
    var toStr = glift.flattener.symbolStr;
    var newBoard = flattened.board().transform(function(isection, x, y) {

    });
  }
};
