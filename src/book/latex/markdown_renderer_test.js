(function() {
  module('gpub.book.latex.renderer');
  var render  = gpub.book.latex.renderMarkdown;

  test('Testing header (preamble) + body', function() {
    deepEqual(render('#foo\nbar'), {
      preamble: '\\book{foo}',
      text: 'bar'
    });
  });
})();
