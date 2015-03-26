(function() {
  module('gpub.book.latex.renderer');
  var render  = gpub.book.latex.renderMarkdown;

  test('Testing header', function() {
    deepEqual(render('#foo'), '\\book{foo}');
  });
})();
