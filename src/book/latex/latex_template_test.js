(function() {
  module('gpub.book.latex.templateTest');

  test('DefaultTemplate: defined', function() {
    var template = gpub.book.latex.generator.defaultTemplate();;
    ok(template);
  });

  test('DefaultTemplate: render', function() {
    var template = gpub.book.latex.generator.defaultTemplate();;
    var view = {
      extraPackages: 'extraPackages-Filled',
      diagramTypeDefs: 'extraPackages-Filled',
      diagramWrapperDef: 'diagramWrapperDef-Filled',
      authors: [
        {name: 'Name1-Filled'},
        {name: 'Name2-Filled'},
        {name: 'Name3-Filled'}
      ],
      title: 'zod',
      subtitle: 'zodo',
      publisher: 'pub',
      content: 'cooontent'
    };
    var out = gpub.Mustache.render(template, view);

    ok(view, 'must be defined');

    for (var key in view) {
      var val = view[key];
      if (glift.util.typeOf(val) === 'string') {
        ok(out.indexOf(val) > -1, 'string val did not render: ' + val);
      }
    }
  });
})();
