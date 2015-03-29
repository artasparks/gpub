(function() {
  module('gpub.book.latex.renderer');
  var render = gpub.book.latex.renderMarkdown;

  var pend = gpub.book.latex.markdown.paragraph('');

  test('Testing header (preamble) + body', function() {
    deepEqual(render('#foo\nbar'), {
      preamble: '\\book{foo}',
      text: 'bar' + pend
    });
  });

  test('No sanitize', function() {
    deepEqual(render('\'bar\''), {
      preamble: '',
      text: '\'bar\'' + pend
    });
  });

  test('Header: top', function() {
    deepEqual(render('# bar'), {
      preamble: '\\book{bar}',
      text: ''
    });
  });

  test('Italics', function() {
    deepEqual(render('*bar*'), {
      preamble: '',
      text: '\\textit{bar}' + pend
    });
  });

  test('Strong', function() {
    deepEqual(render('__bar__'), {
      preamble: '',
      text: '\\textbf{bar}' + pend
    });
  });

  test('Realistic', function() {
    deepEqual(1, 1, '1 should equal 1');
    deepEqual(render([
        '# Fujisawa and Go',
        '',
        'This was the second game in a ten game match between Fujisawa Hosai 9p'
    ].join('\n')), {
      preamble: '\\book{Fujisawa and Go}',
      text: 'This was the second game in a ten game match between ' +
          'Fujisawa Hosai 9p' + pend
    });
  });
})();
