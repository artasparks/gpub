(function(){
  module('gpub.book.ascii.template');

  test('Testing ascii templating', function() {
    var view = {
      title: 'Zed',
      authors: ['Zod Frog', 'Mod Frog'],
      content: 'nada'
    }
    var template = gpub.book.generator(gpub.outputFormat.ASCII, {}).template();
    ok(template, 'template should be defined');

    var parsed = gpub.Mustache.parse(template)

    var out = gpub.Mustache.render(template, view)
    ok(out, 'render should be successful');

    ok(/Title: Zed/.test(out), 'title');
    ok(/Authors: Zod Frog, Mod Frog, /.test(out), 'authors');
  });
})();
