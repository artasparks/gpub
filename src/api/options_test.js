(function() {
  module('glift.api.optionsTest');

  test('Process options: default', function() {
    var o = gpub.processOptions();
    deepEqual(o, gpub.defaultOptions);
  });

  test('Process options: default', function() {
    var o = gpub.processOptions({
      bookOptions: {
        title: 'Zed'
      }
    });
    deepEqual(o.bookOptions.title, 'Zed');
    deepEqual(o.bookOptions.publisher,
        gpub.defaultOptions.bookOptions.publisher);
  });

  test('Process options: gnosFontSize', function() {
    var o = gpub.processOptions({
    });
    deepEqual(o.goIntersectionSize, '12');

    o = gpub.processOptions({
      goIntersectionSize: '14'
    });
    deepEqual(o.goIntersectionSize, '14');
  });
})();
