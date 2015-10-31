(function() {
  module('gpub.diagrams.igo.igoTest');
  var pt = glift.util.point;

  test('toIgoCoord', function() {
    var toIgoCoord = gpub.diagrams.igo.toIgoCoord;
    deepEqual(toIgoCoord(pt(0,0), 19), 'a19');
    deepEqual(toIgoCoord(pt(8,0), 19), 'j19');
    deepEqual(toIgoCoord(pt(7,0), 19), 'h19', 'no i test');
    deepEqual(toIgoCoord(pt(8,18), 19), 'j1');
    deepEqual(toIgoCoord(pt(18,18), 19), 't1');
  });

  test('Process marks', function() {
    deepEqual(1, 1, '1 should equal 1');
  });
})();
