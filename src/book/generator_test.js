(function() {
  module('glift.book.generatorTest');

  test('Test all outputFormat for generators', function() {
    for (var key in gpub.outputFormat) {
      var p = gpub.book._getGenerator({
        outputFormat: key
      });
      ok(p);
      for (var method in gpub.book.generator) {
        ok(p[method], 'no method: ' + method + ' for processor ' + key);
      }
    }
  });
})();
