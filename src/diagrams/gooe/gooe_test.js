(function() {
  module('gpub.diagrams.gooe.gooeTest');
  var gooeBoard = gpub.diagrams.gooe.gooeBoard;
  var symbolMap = gpub.diagrams.gooe.symbolMap;
  var NORMAL = gpub.diagrams.sizes.NORMAL;
  var LARGE = gpub.diagrams.sizes.LARGE;
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])';
  var flattened = gpub.diagrams.flatten(
      basicSgf, [], [], 'TOP_LEFT');

  test('Gooe board generation', function() {
    var board = gooeBoard(flattened, NORMAL);

    deepEqual(board.boardArray().length, 11, 'height');
    deepEqual(board.boardArray()[0].length, 12, 'width');

    deepEqual(board.getInt(0,0), symbolMap.WSTONE);
    deepEqual(board.getInt(0,1),
        symbolMap.BSTONE_TEXTLABEL.replace('%s', 'z'));
    deepEqual(board.getInt(0,2), symbolMap.LEFT_EDGE);
    deepEqual(board.getInt(1,0), symbolMap.TOP_EDGE);
    deepEqual(board.getInt(1,1), symbolMap.CENTER);
  });

  test('Gooe board generation: Large', function() {
    var board = gooeBoard(flattened, LARGE);
    deepEqual(board.getInt(0,0), symbolMap.WSTONE);
    deepEqual(board.getInt(0,1),
        symbolMap.BSTONE_TEXTLABEL_LARGE.replace('%s', 'z'));
    deepEqual(board.getInt(0,2), symbolMap.LEFT_EDGE);
  });

  test('Gooe board generation: headers / footers', function() {
    var arr = gpub.diagrams.gooe.gooeStringArray(
        gpub.diagrams.flatten(basicSgf),
        NORMAL);
    deepEqual(arr.length, 19 + 2);

    deepEqual(arr[0], '{\\goo');
    deepEqual(arr[arr.length - 1], '}');

    arr = gpub.diagrams.gooe.gooeStringArray(flattened, LARGE);
    deepEqual(arr[0], '{\\bgoo');
    deepEqual(arr[arr.length - 1], '}');
  })
})();
