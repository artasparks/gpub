gpub.book.latexBookTest = function() {
  module('gpub.book.latexBookTest');

  test('Test no exceptions', function() {
    var sgf = testdata.sgfs.complexproblem;
    var options = {
      sgfCollection: [{
        sgfString: sgf
      }]
    };
    var out = gpub.book.latex.generate(options);
    ok(out, 'must be defined');
  });

  test('Test round trip', function() {
    var sgf = testdata.sgfs.complexproblem;
    var spec = gpub.spec.fromSgfs([sgf]);
    var latexBook = gpub.book.latex.generate(spec);
    ok(latexBook, 'must be defined');
  });
};
