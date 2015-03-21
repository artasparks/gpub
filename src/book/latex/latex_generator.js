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
    this.forEachSgf(spec, function(idx, mt, flattened) {
      var diagramStr = gpub.diagrams.create(flattened, opts.diagramType);
      content.push(diagramStr);
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
         * init: Any additional setup that needs to be done in the header.
         */
        init: '',

        title: 'My Book',
        subtitle: 'Subtitle',
        publisher: 'Publisher',
        authors: [
          {name: 'You!' }
        ],

        /** Defs for definiing the diagrams. */
        diagramWrapperDef: [
          '% Mainline Diagrams. reset at parts',
          '\\newcounter{GoFigure}[part]',
          '\\newcommand{\\gofigure}{%',
          ' \\stepcounter{GoFigure}',
          ' \\centerline{\\textit{Figure.\\thinspace\\arabic{GoFigure}}}',
          '}',
          '% Variation Diagrams. reset at parts.',
          '\\newcounter{GoDiagram}[part]',
          '\\newcommand{\\godiagram}{%',
          ' \\stepcounter{GoDiagram}',
          ' \\centerline{\\textit{Diagram.\\thinspace\\arabic{GoDiagram}}}',
          '}',
          '\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
          ''].join('\n')
      }
    };
  }
};
