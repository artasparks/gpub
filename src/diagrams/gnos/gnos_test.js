(function() {
  module('gpub.diagrams.gnos.gnosTest');
  var gnosBoard = gpub.diagrams.gnos.gnosBoard_;
  var symbolMap = gpub.diagrams.gnos.Symbol;
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[ab:z]LB[bc:2]' +
      '[ad:30]TR[dd])';
  var flattened = gpub.diagrams.flatten(
      basicSgf, [], [], 'TOP_LEFT');

  test('Gnos board generation', function() {
    var board = gnosBoard(flattened, 12);
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
        gpub.diagrams.gnos.markOverlap_(symbolMap.CENTER_STARPOINT, symbolMap.TRIANGLE));
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
        'Avoidable with White A. Followed by Black 101';
    var t = g.renderInline(text);

    ok(t.indexOf('{\\gnosOverlap{!}') > -1,
        'Exp: overlap !. Rendered Text:' + t);
    ok(t.indexOf('{\\gnosOverlap{@}') > -1,
        'Exp: overlap @. Rendered Text:' + t);

    ok(t.indexOf('3') > -1,
        'Exp: overlap 3 Rendered Text:' + t);
    ok(t.indexOf('{4}') > -1,
        'Exp: overlap {4} Rendered Text:' + t);
    ok(t.indexOf('{A}') > -1,
        'Exp: overlap {A} Rendered Text:' + t);

    ok(t.indexOf('{\\gnosbi\\char1}') > -1,
        'Exp: overlap gnosbi. Rendered Text:' + t);
  });

  test('Gnos render for lowercase', function() {
    var g = gpub.diagrams.gnos;
    var text = 'And then! Black (a)';
    var t = g.renderInline(text);
    ok(t.indexOf('{\\gnosOverlap{@}') > -1,
        'Exp: overlap !. Rendered Text:' + t);
    ok(t.indexOf('{a}') > -1, 'Should remove parens:' + t);
  });
})();
