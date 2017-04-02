(function() {
  module('gpub.book.epub.cssTest');

  test('That creating a CSS file works', function() {
    var file = gpub.book.epub.css({
      classes: {
        foo: {
          bar: 'biff bam',
          'font-style': 'blop',
        },
        floo: {
          zip: 'zap',
        },
      },
      tags: {
        body: {
          zog: 'zig',
        },
      },
      id: 'zop',
      path: 'zorp',
    });
    deepEqual(file.id, 'zop');
    deepEqual(file.path, 'zorp')
    deepEqual(file.contents,
      '.foo {\n' +
      '  bar: biff bam;\n' +
      '  font-style: blop;\n' +
      '}\n' +
      '.floo {\n' +
      '  zip: zap;\n' +
      '}\n' +
      'body {\n' +
      '  zog: zig;\n' +
      '}\n');
    deepEqual(file.mimetype, 'text/css');
  });

  test('css defaults', function() {
    var file = gpub.book.epub.css({classes: {
      zip: 'zap'
    }});
    deepEqual(file.path, 'OEBPS/css/epub.css');
    deepEqual(file.id, 'style-css');
  });
})();
