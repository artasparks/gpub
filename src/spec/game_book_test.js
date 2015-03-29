(function() {
  module('gpub.spec.gameBook');

  var process = gpub.spec.gameBook.processOneSgf;
  var alias = 'zed';

  test('Process 0th and 1st variation', function() {
    var sgf = '(;GM[1]C[A Game!];B[aa]C[Here\'s a move])';
    var mt = glift.parse.fromString(sgf);

    var out = process(mt, alias, {
      boardRegion: 'ALL'
    });
    deepEqual(out.length, 2);
    deepEqual(out[0].initialPosition, '');
    deepEqual(out[0].nextMovesPath, '');

    deepEqual(out[1].initialPosition, '');
    deepEqual(out[1].nextMovesPath, '0');
  });
})();
