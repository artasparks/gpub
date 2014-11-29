gpub.book.latexBookTest = function() {
  module('gpub.book.latexBookTest');
  var sgf = testdata.sgfs.complexproblem;

  test('Test no exceptions', function() {
    var options = {
      sgfCollection: [{
        sgfString: sgf
      }]
    };
    var out = gpub.book.latex.generate(options);
    ok(out, 'must be defined');
  });

  test('Test round trip', function() {
    var spec = gpub.spec.fromSgfs([sgf]);
    var latexBook = gpub.book.latex.generate(spec);
    ok(latexBook, 'must be defined');
  });

  test('Test round trip: GNOS', function() {
    var spec = gpub.spec.fromSgfs([sgf]);
    var latexBook = gpub.book.latex.generate(
        spec, 
        null, /* template */
        gpub.diagrams.diagramType.GNOS,
        null /* options */
        );
    ok(latexBook, 'must be defined');
  });
};
