(function() {
  module('glift.page.epubOptionsTest');

  test('That options can be constructed', function() {
    var o = new gpub.book.epub.EpubOptions({
      id: 'zip',
    })
    ok(o);
    ok(/\d\d\d\d-\d\d-\d\d/.test(o.date), 'Date must be of the form YYYY-MM-DD');
  });
})();
