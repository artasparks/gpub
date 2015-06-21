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

  test('Sizes', function() {
    var LETTER = gpub.book.page.type.LETTER;
    deepEqual(gpub.book.page.size[LETTER].heightIn, 11);
    deepEqual(gpub.book.page.size[LETTER].widthIn, 8.5);

    var ET = gpub.book.page.type.EIGHT_TEN;
    deepEqual(gpub.book.page.size[ET].heightIn, 10);
    deepEqual(gpub.book.page.size[ET].widthIn, 8);
  });
})();
