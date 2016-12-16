(function() {
  module('gpub.diagrams.smartgo.smartgoTest');

  test('That point conversion works', function() {
    var toCoord = gpub.diagrams.smartgo.toSmartGoCoord;
    deepEqual(toCoord(new glift.Point(0,0), 19), 'A19')
    deepEqual(toCoord(new glift.Point(0,18), 19), 'A1')
    deepEqual(toCoord(new glift.Point(18,0), 19), 'T19')
    deepEqual(toCoord(new glift.Point(18,18), 19), 'T1')
  });
})();
