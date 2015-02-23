/**
 * ASCII book generator methods, for implementing gpub.book.Gen
 * interface.
 */
gpub.book.ascii.generator = {
  generate: function(spec) {
    var view = this.options().bookOptions;
    var content = [];
    this.forEachSgf(spec, function(mt, flattened) {

    });
  },

  defaultTemplate: function() {
    return gpub.book.ascii._defaultTemplate;
  },

  defaultOptions: function(opts) {
    return {
      diagramType: gpub.diagrams.diagramType.ASCII
    }
  }
};

