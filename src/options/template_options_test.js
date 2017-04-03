(function() {
  module('gpub.opts.templateOptionsTest');

  test('That spec options construction work.', function() {
    var opt = new gpub.opts.TemplateOptions({
    });
    deepEqual(opt.metadata.title, 'My Go Book!');
  });
})();
