gpub.book.latex = {
  /**
   * Generate a LaTeX book!
   *
   * We assume that the options have already been generated.
   */
  generate: function(options, diagramType, templateString) {
    var mgr = glift.createNoDraw(options);
    var template = gpub.templates.parse(templateString);

    // Assume Gooe for now.
    // template.setExtraPackages(
  }
};
