gpub.diagrams.latex.latexTest = function() {
  module('gpub.diagrams.latexTest');

  test('Test sanitize LaTeX', function() {
    deepEqual(gpub.diagrams.latex.sanitize('foo bar #${}'),
        'foo bar \\#\\$\\{\\}');
  });
};
