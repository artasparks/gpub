(function() {
  module('glift.page.pageTest');

  test('Page sizes', function() {
    var LETTER = gpub.book.page.type.LETTER;
    deepEqual(gpub.book.page.size[LETTER].heightIn, 11);
    deepEqual(gpub.book.page.size[LETTER].widthIn, 8.5);

    var ET = gpub.book.page.type.EIGHT_TEN;
    deepEqual(gpub.book.page.size[ET].heightIn, 10);
    deepEqual(gpub.book.page.size[ET].widthIn, 8);
  });
})();
