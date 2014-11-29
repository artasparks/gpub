gpub.diagrams.gnos.gnosTest = function() {
  module('gpub.diagrams.gnos.gnosTest');
  var gnosBoard = gpub.diagrams.gnos.gnosBoard;
  var symbolMap = gpub.diagrams.gnos.symbolMap;
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[ab:z]LB[bc:2]' +
      '[ad:3])';
  var flattened = gpub.diagrams.flatten(
      basicSgf, [], [], 'TOP_LEFT');

  test('Gnos board generation', function() {
    var board = gnosBoard(flattened);
    ok(board, 'should be defined');
    deepEqual(board.boardArray().length, 11, 'height');
    deepEqual(board.boardArray()[0].length, 12, 'width');

    deepEqual(board.getInt(0,0), symbolMap.WSTONE);
    deepEqual(board.getInt(0,1),
        symbolMap.BSTONE_TEXTLABEL.replace('%s', 'z'));
    deepEqual(board.getInt(0,2), symbolMap.LEFT_EDGE);
    deepEqual(board.getInt(1,0), symbolMap.TOP_EDGE);
    deepEqual(board.getInt(1,1), symbolMap.CENTER);
    deepEqual(board.getInt(1,2),
        symbolMap.TEXTLABEL.replace('%s', 2));
    deepEqual(board.getInt(0,3),
        symbolMap.BSTONE_NUMLABEL_1_99.replace('%s', 3));
  });

  test('Gnos getLabelDef', function() {
    var getLabelDef = gpub.diagrams.gnos.getLabelDef;
    var o = getLabelDef('23', 20 /* bstone */, 12);
    deepEqual(o, 'BSTONE_NUMLABEL_1_99');
    deepEqual(getLabelDef('3', 20 /* bstone */, 12), 'BSTONE_NUMLABEL_1_99');
  });
};
