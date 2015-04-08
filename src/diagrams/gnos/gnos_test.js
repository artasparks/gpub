(function() {
  module('gpub.diagrams.gnos.gnosTest');
  var gnosBoard = gpub.diagrams.gnos.gnosBoard;
  var symbolMap = gpub.diagrams.gnos.symbolMap;
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[ab:z]LB[bc:2]' +
      '[ad:30]TR[dd])';
  var flattened = gpub.diagrams.flatten(
      basicSgf, [], [], 'TOP_LEFT');

  test('Gnos board generation', function() {
    var board = gnosBoard(flattened);
    ok(board, 'should be defined');
    deepEqual(board.boardArray().length, 11, 'height');
    deepEqual(board.boardArray()[0].length, 12, 'width');

    deepEqual(board.getInt(0,0), symbolMap.WSTONE);
    deepEqual(board.getInt(0,1),
        symbolMap.BSTONE_TEXTLABEL.replace('%s', '\\small{z}'));
    deepEqual(board.getInt(0,2), symbolMap.LEFT_EDGE);
    deepEqual(board.getInt(1,0), symbolMap.TOP_EDGE);
    deepEqual(board.getInt(1,1), symbolMap.CENTER);
    deepEqual(board.getInt(1,2),
        symbolMap.TEXTLABEL.replace('%s', '\\small{2}'));
    deepEqual(board.getInt(0,3),
        symbolMap.BSTONE_TEXTLABEL.replace('%s', '\\footnotesize{30}'));
    deepEqual(board.getInt(3,3),
        symbolMap.markOverlap(symbolMap.CENTER_STARPOINT, symbolMap.TRIANGLE));
  });

  test('Gnos getLabelDef', function() {
    var getLabelDef = gpub.diagrams.gnos.getLabelDef;
    var o = getLabelDef('23', 20 /* bstone */, 12);
    deepEqual(o, 'BSTONE_TEXTLABEL');
    deepEqual(getLabelDef('3', 20 /* bstone */, 12), 'BSTONE_TEXTLABEL');
    deepEqual(getLabelDef('3', 20 /* bstone */, 8), 'BSTONE_NUMLABEL_1_99');

    deepEqual(getLabelDef('300', 20 /* bstone */, 12), 'BSTONE_NUMLABEL_300_399');
    deepEqual(getLabelDef('300', 21 /* wstone */, 12), 'WSTONE_NUMLABEL_300_399');
  });

  test('Gnos render inline', function() {
    var g = gpub.diagrams.gnos;
    var text = 'And then! Black 3 followed by White 4! Destruction. ' +
        'Avoidable with White A';
    var expected = 'And then! ' +
        g._inlineBlack.replace('%s', '3') +
        ' followed by ' +
        g._inlineWhite.replace('%s', '4') +
        '! Destruction. ' +
        'Avoidable with ' +
        g._inlineWhite.replace('%s', 'A');
    var t = g.renderInline(text);
    deepEqual(g.renderInline(text), expected);
  });
})();
