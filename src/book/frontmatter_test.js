(function() {
  module('gpub.book.frontmatterTest');

  test('That formatting works: epub, intro', function() {
    var front = new gpub.opts.Frontmatter({
      introduction: '#Foo bar biff',
    });
    out = gpub.book.frontmatter.format('EPUB', front);
    deepEqual(out.introduction, '<h1 id="foo-bar-biff">Foo bar biff</h1>\n')
  });

  test('That formatting works: latex, prefae', function() {
    var front = new gpub.opts.Frontmatter({
      introduction: '#Foo bar biff',
    });
    out = gpub.book.frontmatter.format('LATEX', front);
    deepEqual(out.introduction, '\\part{Foo bar biff}\n')
  });

})();
