(function() {
  module('gpub.book.epub.epubOptionsTest');
  var epub = gpub.book.epub;

  test('create mimetype file', function() {
    var f = epub.mimetype();
    var reg = /epub\+zip/

    ok(f.path);
    ok(f.contents);
    ok(reg.test(f.contents))
  });

  test('create container file', function() {
    var f = epub.container();
    var reg = /OEBPS\/content\.opf/;

    ok(f.path);
    ok(f.contents);
    ok(reg.test(f.contents));
  });

  test('create basic opf file', function() {
    var opt = new epub.EpubOptions({
      id: 'zed',
      title: 'Zog Buuk!',
    })
    var f = epub.opfContent(opt);
    var reg = /unique-identifier/;
    ok(f.path);
    ok(f.contents);
    ok(reg.test(f.contents));
  });
})();
