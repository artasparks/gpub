(function() {
  module('gpub.api.templateOptionsTest');

  test('That spec options construction work.', function() {
    var opt = new gpub.api.TemplateOptions({
      template: gpub.templates.Style.PROBLEM_EBOOK,
    });
    deepEqual(opt.template, gpub.templates.Style.PROBLEM_EBOOK);
    deepEqual(opt.metadata.title, 'My Go Book!');
  });
})();
