(function() {
  module('gpub.diagrams.igo.igoTest');
  var pt = glift.util.point;
  var IGO = gpub.diagrams.Type.IGO;

  test('toIgoCoord', function() {
    var toIgoCoord = gpub.diagrams.igo.toIgoCoord;
    deepEqual(toIgoCoord(pt(0,0), 19), 'a19');
    deepEqual(toIgoCoord(pt(8,0), 19), 'j19');
    deepEqual(toIgoCoord(pt(7,0), 19), 'h19', 'no i test');
    deepEqual(toIgoCoord(pt(8,18), 19), 'j1');
    deepEqual(toIgoCoord(pt(18,18), 19), 't1');
  });

  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[bb:z];' +
      'B[ca];' +
      'W[cb];' +
      'B[cc]TR[ad])';

  test('Create!', function() {
    var mt = glift.parse.fromString(basicSgf)
    var flattened = glift.flattener.flatten(mt, {
      boardRegion: 'TOP_LEFT',
      nextMovesPath: [0,0,0],
    });
    var d = gpub.diagrams.igo.create(flattened, {});
    deepEqual(d,
        '\\cleargoban\n' +
        '\\gobansize{19}\n' +
        '\\igofontsize{10}\n' +
        '\\white{a19}\n' +
        '\\black{a18}\n' +
        '\\black[1]{c19,c18,c17}\n' +
        '\\black[\\igotriangle]{a16}\n' +
        '\\showgoban');
  });
})();
