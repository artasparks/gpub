gpub.spec.processorTest = function() {
  module('gpub.spec.processorTest');

  test('Processor Mapping', function() {
    var purposes = gpub.bookPurpose;
    for (var key in purposes) {
      var processor = gpub.spec._getSpecProcessor(key);
      if (!processor) {
        ok(processor, 'Processor not defined for type: ' + key);
      }
      for (var method in gpub.spec.processor) {
        ok(processor[method], 'Method: ' + method +
            ' not defined for processor: ' + key);
      }
    }
  });
};
