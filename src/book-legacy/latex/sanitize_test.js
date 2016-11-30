(function() {
  module('gpub.book.latex.sanitizeTest');

  test('Test sanitize LaTeX', function() {
    deepEqual(gpub.book.latex.sanitize('foo bar #${}%&'),
        'foo bar #\\$\\{\\}\\%\\&');
  });

  test('backslash', function() {
    deepEqual(gpub.book.latex.sanitize('\\'), '\\textbackslash');
  });
})();
