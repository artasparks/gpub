(function() {
  module('gpub.book.epub.epubOptionsTest');
  var epub = gpub.book.epub;

  test('create mimetype file', function() {
    var f = epub.mimetype();
    ok(f.path);
    ok(f.contents);
  });
})();
