(function() {
  module('gpub.book.formatTest');

  var inText = '#Foo bar biff';
  var latexText = '\\part{Foo bar biff}';
  var htmlText = '<h1 id="foo-bar-biff">Foo bar biff</h1>\n';

  test('That getting formatter works from diagram-type: SVG', function() {
    var fmt = gpub.book.formatter.fromDiagramType('SVG');
    deepEqual(fmt(inText).text, htmlText);
  });

  test('That getting formatter works from diagram-type: gnos', function() {
    var fmt = gpub.book.formatter.fromDiagramType('GNOS');
    deepEqual(fmt(inText).preamble, latexText);
  });

  test('That getting formatter works from diagram-type: gooe', function() {
    var fmt = gpub.book.formatter.fromDiagramType('GOOE');
    deepEqual(fmt(inText).preamble, latexText);
  });

  test('That getting formatter works from diagram-type: igo', function() {
    var fmt = gpub.book.formatter.fromDiagramType('IGO');
    deepEqual(fmt(inText).preamble, latexText);
  });

  test('That getting formatter works from diagram-type: default', function() {
    var fmt = gpub.book.formatter.fromDiagramType('ZOG');
    deepEqual(fmt(inText).text, inText);
  });

  test('That text joining works', function() {
    var text = gpub.book.formatter.joinProcessed({text: 'zog', preamble: 'zig'});
    deepEqual(text, 'zig\nzog');

    text = gpub.book.formatter.joinProcessed({text: 'zog', preamble: ''});
    deepEqual(text, 'zog');
  });
})();
