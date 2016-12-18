(function() {
  module('gpub.diagrams.smartgo.smartgoRendererTest');

  var r = new gpub.diagrams.smartgo.Renderer();

  test('That point conversion works', function() {
    deepEqual(r.toSGCoord(new glift.Point(0,0), 19), 'A19');
    deepEqual(r.toSGCoord(new glift.Point(0,18), 19), 'A1');
    deepEqual(r.toSGCoord(new glift.Point(18,0), 19), 'T19');
    deepEqual(r.toSGCoord(new glift.Point(18,18), 19), 'T1');
  });
})();
