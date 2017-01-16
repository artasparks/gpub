(function() {
  module('gpub.book.epub.epubOptionsTest');

  test('That options can be constructed', function() {
    var o = new gpub.book.epub.EpubOptions({
      id: 'zip',
      title: 'Zap',
    })
    ok(o);
    ok(/\d\d\d\d-\d\d-\d\d/.test(o.generationDate),
        'Date must be of the form YYYY-MM-DD');
  });
})();
