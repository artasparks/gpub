(function() {
  module('gpub.api.optionsTest');
  var defaultOptions = new gpub.Options();

  test('Process options: default', function() {
    var o = new gpub.Options();
    ok(o, 'make sure it works');
    ok(o.bookOptions.metadata.id, 'make sure it has an id');
  });

  test('Process options: default', function() {
    var o = new gpub.Options({
      bookOptions: {
        metadata: {
          title: 'Zed',
          id: 'foo',
        }
      }
    });
    deepEqual(o.bookOptions.metadata.title, 'Zed');
  });
})();
