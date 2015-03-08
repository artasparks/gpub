(function() {
  module('gpub.book.latex.sanitize');

  test('Test sanitize LaTeX', function() {
    deepEqual(gpub.book.latex.sanitize('foo bar #${}'),
        'foo bar \\#\\$\\{\\}');
  });
})();
