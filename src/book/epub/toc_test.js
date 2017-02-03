(function() {
  module('gpub.book.epub.tocTest');

  test('Generating a table of contents', function() {
    var bkfiles = [
      {
        id: '1d',
        contents: 'foo',
        path: 'OEBPS/bar.html',
        title: 'Foo!',
      },
      {
        id: '2d',
        contents: 'blag!',
        path: 'OEBPS/blag.html',
      },
    ];
    var toc = gpub.book.epub.toc(bkfiles);
    ok(toc);
    ok(/bar.*Foo!/.test(toc.contents), 'title specified');
    ok(/blag.html.*blag/.test(toc.contents), 'title not specified');
  });

})();

