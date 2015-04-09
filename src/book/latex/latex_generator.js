/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();
    view.init = gpub.diagrams.getInit(opts.diagramType, 'LATEX');
    var content = [];

    this.forEachSgf(spec, function(idx, mt, flattened, ctx) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType);
      var contextualized = gpub.book.latex.context.typeset(
          opts.diagramType, diagram, ctx, flattened);
      content.push(contextualized);
    }.bind(this));

    view.content = content.join('\n');

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return {
      diagramType: gpub.diagrams.diagramType.GNOS,
      bookOptions: {
        /**
         * init: Any additional setup that needs to be done in the header. I.e.,
         * for diagram packages.
         */
        init: '',

        title: 'My Book',
        subtitle: 'Subtitle',
        publisher: 'Publisher',
        authors: [
          'You!'
        ]
      }
    }
  }
};
