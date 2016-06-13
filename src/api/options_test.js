(function() {
  module('gpub.api.optionsTest');
  var defaultOptions = new gpub.Options();

  test('Process options: default', function() {
    var o = gpub.processOptions();
    deepEqual(o, defaultOptions);
  });

  test('Process options: default', function() {
    var o = gpub.processOptions({
      bookOptions: {
        title: 'Zed'
      }
    });
    deepEqual(o.bookOptions.title, 'Zed');
    deepEqual(o.bookOptions.publisher,
        defaultOptions.bookOptions.publisher);
  });

  test('Process options: gnosFontSize', function() {
    var o = gpub.processOptions({
    });
    deepEqual(o.goIntersectionSize, '12pt');

    o = gpub.processOptions({
      goIntersectionSize: '14'
    });
    deepEqual(o.goIntersectionSize, '14');
  });
})();
