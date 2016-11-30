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
      size: gpub.util.size.parseSizeToPt(opts.goIntersectionSize)
    };

    var pages = new gpub.book.latex.Paging(
      opts.pageSize, diagOpt.size);

    view.init = [
      gpub.diagrams.getInit(opts.diagramType, 'LATEX'),
      pages.pagePreamble()
    ].join('\n');

    if (this.usePdfx1a()) {
      view.pdfx1a = this.usePdfx1a();
      view.pdfxHeader = gpub.book.latex.pdfx.header(
          view.title, opts.colorProfileFilePath, opts.pageSize);
    }

    this.forEachSgf(spec, function(idx, mt, flattened, ctx, sgfId) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType, diagOpt);
      pages.addDiagram(opts.diagramType, diagram, ctx, flattened, sgfId);
    }.bind(this));

    view.content = pages.flushAll();

    this._processBookSections(view.frontmatter);
    this._processBookSections(view.appendices);

    return gpub.Mustache.render(this.template(), view);
  },

  /**
   * Processes the frontmatter or appendices. In otherwords, does escaping and,
   * in particular for the copyright object, constructs a couple new fields.
   *
   * TODO(kashomon): Clean this up. The generateToc and copyright sections are,
   * in particular, ugly and non-standard.
   */
  _processBookSections: function(section) {
    var escape = function(val) {
      return val.replace(/([${%}&#\\])/g, function(m, g1) { return '\\' + g1 });
    };

    // Convert all frontmatter/appendices from markdown to LaTeX.
    for (var key in section) {
      if (section[key]
          && key !== 'copyright'
          && key !== 'generateToc' ) {
        section[key] =
            gpub.book.latex.renderMarkdown(section[key]);
      } else if (key === 'copyright') {
        for (var ckey in section.copyright) {
          var val = section.copyright[ckey];
          if (ckey === 'addressLines') {
            var publisher = section.copyright.publisher ?
                [section.copyright.publisher] : [];
            var constructed = publisher.concat(val);
            section.copyright.constructedAddress = constructed
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
            section.copyright.constructedPrintingRun = out.join(' ');
          } else if (glift.util.typeOf(val) === 'string') {
            section.copyright[ckey] = escape(val);
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
