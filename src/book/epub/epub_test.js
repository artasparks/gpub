(function() {
  module('gpub.book.epub.epubOptionsTest');
  var epub = gpub.book.epub;

  var bkFile = {
    contents: 'This is the foo-file contents!',
    path: 'foo-file.html',
    mimetype: 'application/xhtml+xml',
    id: 'foo-file',
  };

  test('create mimetype file', function() {
    var f = epub.mimetypeFile();
    var reg = /epub\+zip/

    ok(f.path);
    ok(f.contents);
    ok(reg.test(f.contents))
  });

  test('create container file', function() {
    var f = epub.containerFile();
    var reg = /OEBPS\/content\.opf/;

    ok(f.path);
    ok(f.contents);
    ok(reg.test(f.contents));
  });

  test('create basic opf file', function() {
    var opt = new epub.EpubOptions({
      id: 'zed',
      title: 'Zog Buuk!',
    });
    var files = [bkFile];
    var spineIds = ['foo-file'];

    var f = epub.opfContent(opt, files, spineIds);

    var reg = /unique-identifier/;
    ok(f.path);
    ok(f.contents);
    ok(/unique-identifier/.test(f.contents), 'metadata:unique id');
    ok(/Zog Buuk!/.test(f.contents), 'metadata:Title');
    ok(/foo-file/.test(f.contents), 'manifest:foo-file');
    ok(/itemref.*foo-file/.test(f.contents), 'spine:foo-file');
  });
})();
