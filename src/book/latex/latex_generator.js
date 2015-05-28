/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();

    view.init = gpub.diagrams.getInit(opts.diagramType, 'LATEX');

    var pages = new gpub.book.latex.Paging(
      opts.pageSize);

    this.forEachSgf(spec, function(idx, mt, flattened, ctx) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType);
      pages.addDiagram(opts.diagramType, diagram, ctx, flattened);
    }.bind(this));

    view.content = paging.flushAll();

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return gpub.book.latex.options();
  }
};
