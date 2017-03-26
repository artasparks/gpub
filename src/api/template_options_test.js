(function() {
  module('gpub.api.templateOptionsTest');

  test('That spec options construction work.', function() {
    var opt = new gpub.api.TemplateOptions({
    });
    deepEqual(opt.metadata.title, 'My Go Book!');
  });
})();
