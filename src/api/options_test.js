(function() {
  module('gpub.api.optionsTest');
  var defaultOptions = new gpub.Options();

  test('Process options: default', function() {
    var o = new gpub.Options();
    ok(o, 'make sure it works');
    ok(o.templateOptions.metadata.id, 'make sure it has an id');
  });

  test('Process options: default', function() {
    var o = new gpub.Options({
      templateOptions: {
        metadata: {
          title: 'Zed',
          id: 'foo',
        }
      }
    });
    deepEqual(o.templateOptions.metadata.title, 'Zed');
    deepEqual(o.templateOptions.metadata.id, 'foo');
  });
})();
