(function() {
  module('glift.page.pageTest');
  var page = gpub.book.page;

  test('conversions: inToPt', function() {
    deepEqual(page.ptToIn(36), 0.5);
    deepEqual(page.inToPt(0.5), 36);
  });

  test('roundtrips', function() {
    deepEqual(page.ptToIn(page.inToPt(32)), 32);
    deepEqual(page.ptToMm(page.mmToPt(10)), 10);
    deepEqual(page.mmToIn(page.inToMm(10)), 10);
  });
})();
