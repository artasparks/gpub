/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var template = this.template();
    var view = this.view();

    var content = [];
    this.forEachSgf(function(idx, mt, flattened) {
      var diagram = gpub.diagrams.forPurpose(
          flattened, diagramType);
    });

    return template.setContent(content.join('\n')).compile();
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
          ''].join('\n');
      }
    };
  }
};
