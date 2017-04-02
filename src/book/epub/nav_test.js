(function() {
  module('gpub.book.epub.navTest');

  test('Generating a nav', function() {
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
    var nav = gpub.book.epub.nav(bkfiles);
    ok(nav);
    ok(/bar.*Foo!/.test(nav.contents), 'title specified');
    ok(/blag.html.*blag/.test(nav.contents), 'title not specified');
  });

})();

