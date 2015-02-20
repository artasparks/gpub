(function() {
  module('gpub.templates.templatestTest');
  var parse = gpub.templates.parse;

  test('Test compile, simple', function() {
    var parsed = parse('foo');
    deepEqual(parsed.compile(), 'foo');
  });

  test('Test compile, vars', function() {
    var parsed = parse('foo {{ bar }} biff');
    parsed.setParam('bar', 'bram')
    deepEqual(parsed.compile(), 'foo bram biff');
  });
})();
