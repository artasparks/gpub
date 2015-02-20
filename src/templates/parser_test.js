(function() {
  module('gpub.templates.parserTest');
  var parse = gpub.templates.parse;

  test('Test parse, simple', function() {
    var parsed = parse('foo');
    deepEqual(parsed._paramMap, {});
    deepEqual(parsed._sections, ['foo']);
  });

  test('Test parse, less simple', function() {
    var parsed = parse('abe {{foo}} cde');
    deepEqual(parsed._paramMap, {foo: 1});
    deepEqual(parsed._sections, ['abe ', null, ' cde']);
  });

  test('Realistic HTML', function() {
    var template =
      '<!DOCTYPE html>' +
      '<html>' +
        '<head>' +
        '<title> {{book_title}} </title>' +
        '<script type="text/javascript" src=".././glift.js"></script>' +
        '<body>' +
          '<div id="wrap" style="position:relative;">' +
            '<div id="glift_display1"></div>' +
          '</div>' +
          '<script type="text/javascript">' +
          '{{ book_definition }}' +
          '</script>' +
        '</body>' +
      '<html>';
    var parsed = parse(template);
    deepEqual(parsed._paramMap, {
      'book_title': 1,
      'book_definition': 3
    });
    deepEqual(parsed._sections[4].indexOf('</script>'), 0);
  });
})();
