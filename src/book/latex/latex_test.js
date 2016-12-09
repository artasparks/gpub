(function() {
  module('gpub.book.latex.sanitizeTest');

  var helper = new gpub.book.latex.LatexHelper();

  test('Test sanitize LaTeX', function() {
    deepEqual(helper.sanitize('foo bar #${}%&'),
        'foo bar #\\$\\{\\}\\%\\&');
  });

  test('backslash', function() {
    deepEqual(helper.sanitize('\\'), '\\textbackslash');
  });

  test('markdown', function() {
    var pend = gpub.book.latex.MarkdownBase.prototype.paragraph('');
    var markd = helper.renderMarkdown(
      '# Fujisawa and Go\n' +
      '\n' +
      'Stuffs')
    deepEqual(markd.preamble, '\\part{Fujisawa and Go}');
    deepEqual(markd.text, 'Stuffs\n\n');
  });

  test('pdfx header', function() {
    var header = helper.pdfx1aHeader({
      title: 'foo',
      colorProfileFile: 'bar',
      pageSize: 'LETTER'
    });
    ok(header)
    ok(/foo/.test(header));
    ok(/bar/.test(header));
  });
})();
