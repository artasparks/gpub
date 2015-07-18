/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();

    // Diagram Options
    var diagOpt = {
      // Intersection size in pt.
      // TODO(kashomon): Pass this in rather than hardcoding.
      size: opts.gnosFontSize
    };

    var pages = new gpub.book.latex.Paging(
      opts.pageSize, diagOpt.size);

    view.init = [
      gpub.diagrams.getInit(opts.diagramType, 'LATEX'),
      pages.pagePreamble()
    ].join('\n');

    this.forEachSgf(spec, function(idx, mt, flattened, ctx) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType, diagOpt);
      pages.addDiagram(opts.diagramType, diagram, ctx, flattened);
    }.bind(this));

    view.content = pages.flushAll();

    // Convert all frontmatter to markdown
    for (var key in view.frontmatter) {
      if (view.frontmatter[key]) {
        view.frontmatter[key] =
            gpub.book.latex.renderMarkdown(view.frontmatter[key]);
      }
    }

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return gpub.book.latex.options();
  }
};
