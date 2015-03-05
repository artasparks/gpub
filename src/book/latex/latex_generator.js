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
      diagramType: gpub.diagrams.diagramType.GNOS
    };
  }
};
