/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var template = this.template();
    var view = this.view(spec);
    var opts = this.options();
    var content = [];
    this.forEachSgf(spec, function(idx, mt, flattened) {
      var diagramStr = gpub.diagrams.create(flattened, opts.diagramType);
      content.push(diagramStr);
    }.bind(this));

    view.content = content.join('\n');

    return gpub.Mustache.render(template, view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return {
      diagramType: gpub.diagrams.diagramType.GNOS,
      bookOptions: {
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
