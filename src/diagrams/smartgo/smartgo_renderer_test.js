(function() {
  module('gpub.diagrams.smartgo.smartgoRendererTest');

  var r = new gpub.diagrams.smartgo.Renderer();
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[ab:z]LB[bc:2]' +
      '[ad:30]TR[dd])';
  var mt = glift.parse.fromString(basicSgf)

  test('That point conversion works', function() {
    deepEqual(r.toSGCoord(new glift.Point(0,0), 19), 'A19');
    deepEqual(r.toSGCoord(new glift.Point(0,18), 19), 'A1');
    deepEqual(r.toSGCoord(new glift.Point(18,0), 19), 'T19');
    deepEqual(r.toSGCoord(new glift.Point(18,18), 19), 'T1');
  });

  test('That basic generation works', function() {
    var flattened = glift.flattener.flatten(mt, {
      boardRegion: 'TOP_LEFT'
    });
    var diag = r.render(flattened, {})
    ok(diag);
    ok(/vw/.test(diag))
  });
})();

