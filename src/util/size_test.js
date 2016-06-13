(function() {
  module('gpub.util.size');

  var size = gpub.util.size;
  test('conversions: inToPt', function() {
    deepEqual(size.ptToIn(36), 0.5);
    deepEqual(size.inToPt(0.5), 36);
  });

  test('roundtrips', function() {
    deepEqual(size.ptToIn(size.inToPt(32)), 32);
    deepEqual(size.ptToMm(size.mmToPt(10)), 10);
    deepEqual(size.mmToIn(size.inToMm(10)), 10);
  });

  test('Parse size', function() {
    var invals =    ['12', '12.12pt', '10mm', '1.2in'];
    var expected =  [ 12,   12.12,     28.3,  86.4];
    for (var i = 0; i < invals.length; i++) {
      var inv = invals[i];
      var outv = expected[i];
      var parsed = gpub.util.size.parseSizeToPt(inv);
      deepEqual(
          Math.round(parsed*10)/10,
          Math.round(outv*10)/10,
          'For idx:' + i +', expected ' + outv + ' to be ' + parsed);
    }
  });
})();
