/**
 * ASCII book generator methods, for implementing gpub.book.Gen
 * interface.
 */
gpub.book.ascii.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();
    var content = [];

    this.forEachSgf(spec, function(mt, flattened) {
      var diagramStr = gpub.diagrams.create(flattened, opts.diagramType);
      content.push(diagramStr);
    }.bind(this));

    view.content = content.join('\n');

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.ascii._defaultTemplate;
  },

  defaultOptions: function(opts) {
    return {
      diagramType: gpub.diagrams.diagramType.SENSEIS_ASCII
    }
  }
};

