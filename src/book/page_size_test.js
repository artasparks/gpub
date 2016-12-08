(function() {
  module('glift.page.pageTest');
  var PageSize = gpub.book.PageSize;
  var Dims = gpub.book.pageDimensions;

  test('Page sizes', function() {
    deepEqual(Dims[PageSize.LETTER].heightIn, 11);
    deepEqual(Dims[PageSize.LETTER].widthIn, 8.5);

    deepEqual(Dims[PageSize.EIGHT_TEN].heightIn, 10);
    deepEqual(Dims[PageSize.EIGHT_TEN].widthIn, 8);
  });

  test('Page Sizes have Page Dims', function() {
    for (var ps in PageSize) {
      ok(Dims[ps], 'Dimensions were not defined for item: ' + ps);
    }
  });
})();
