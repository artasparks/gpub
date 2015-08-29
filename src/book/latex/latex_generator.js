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
      size: opts.gnosFontSize
    };

    var pages = new gpub.book.latex.Paging(
      opts.pageSize, diagOpt.size);

    view.init = [
      gpub.diagrams.getInit(opts.diagramType, 'LATEX'),
      pages.pagePreamble()
    ].join('\n');

    if (this.pdfx1a()) {
      view.pdfx1a = this.pdfx1a(view.title);
      view.pdfxHeader = gpub.book.latex.pdfx.header();
    }

    this.forEachSgf(spec, function(idx, mt, flattened, ctx, sgfId) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType, diagOpt);
      pages.addDiagram(opts.diagramType, diagram, ctx, flattened, sgfId);
    }.bind(this));

    view.content = pages.flushAll();

    this._processFrontmatter(view.frontmatter);

    return gpub.Mustache.render(this.template(), view);
  },

  /**
   * Processes the frontmatter. In otherwords, does escaping and, in
   * particular for the copyright object, constructs a couple new fields.
   */
  _processFrontmatter: function(frontmatter) {
    var escape = function(val) {
      return val.replace(/([${%}&#\\])/g, function(m, g1) { return '\\' + g1 });
    };

    // Convert all frontmatter from markdown to LaTeX.
    for (var key in frontmatter) {
      if (frontmatter[key]
          && key !== 'copyright'
          && key !== 'generateToc' ) {
        frontmatter[key] =
            gpub.book.latex.renderMarkdown(frontmatter[key]);
      } else if (key === 'copyright') {
        for (var ckey in frontmatter.copyright) {
          var val = frontmatter.copyright[ckey];
          if (ckey === 'addressLines') {
            var publisher = frontmatter.copyright.publisher ?
                [frontmatter.copyright.publisher] : [];
            var constructed = publisher.concat(val);
            frontmatter.copyright.constructedAddress = constructed
                .map(escape)
                .join('\n\\\\');
          } else if (ckey === 'printingRunNum' &&
              glift.util.typeOf(val) === 'number') {
            var out = [];
            var end = 10;
            if (end - val < 5) {
              end = val + 5;
            }
            for (var i = val; i <= end; i++) {
              out.push(i);
            }
            frontmatter.copyright.constructedPrintingRun = out.join(' ');
          } else if (glift.util.typeOf(val) === 'string') {
            frontmatter.copyright[ckey] = escape(val);
          }
        }
      }
    }
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return gpub.book.latex.options();
  }
};
