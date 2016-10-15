(function() {
  module('gpub.api.optionsTest');
  var defaultOptions = new gpub.Options();

  test('Process options: default', function() {
    var o = new gpub.Options();
    deepEqual(o, defaultOptions);
  });

  test('Process options: default', function() {
    var o = new gpub.Options({
      bookOptions: {
        title: 'Zed'
      }
    });
    deepEqual(o.bookOptions.title, 'Zed');
    deepEqual(o.bookOptions.publisher,
        defaultOptions.bookOptions.publisher);
  });

  test('Process options: gnosFontSize', function() {
    var o = new gpub.Options();
    deepEqual(o.bookOptions.goIntersectionSize, '12pt');

    o = new gpub.Options({
      bookOptions: {
        goIntersectionSize: '14'
      }
    });
    deepEqual(o.bookOptions.goIntersectionSize, '14');
  });
})();
