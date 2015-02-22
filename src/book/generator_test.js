(function() {
  module('glift.book.generatorTest');

  test('Test all outputFormat for generators', function() {
    for (var key in gpub.outputFormat) {
      var p = gpub.book.generator(key, {});
      ok(p, 'generator not defined for key: ' + key);
    }
  });

  test('Test all generator methods', function() {
    var interface = gpub.book.Generator;

    for (var key in gpub.outputFormat) {
      var pkg = gpub.book[key.toLowerCase()];
      var gen = pkg.generator;
      ok(gen, 'generator not defined for key: ' + key);

      for (var method in interface) {
        ok(gen[method], 'Method: ' + method + 
            ' not defined for Output Format: ' + key);
      }
    }
  });
})();
