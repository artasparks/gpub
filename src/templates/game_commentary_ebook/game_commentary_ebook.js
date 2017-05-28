goog.provide('gpub.templates.GameCommentaryEbook');

/**
 * @constructor @struct @final
 */
gpub.templates.GameCommentaryEbook = function() {
};

gpub.templates.GameCommentaryEbook.prototype = {
  /**
   * Defaulted options.
   * @return {!gpub.OptionsDef}
   */
  defaults: function() {
    return {
      specOptions: {
        positionType: gpub.spec.PositionType.GAME_COMMENTARY,
      },
      diagramOptions: {
        diagramType: gpub.diagrams.Type.SVG,
      }
    }
  },

  /**
   * Creates the book!
   * @param {!gpub.OptionsDef} opts
   * @return {!gpub.templates.BookOutput} The finished book files.
   */
  create: function(opts) {
    var options = gpub.Options.applyDefaults(opts, this.defaults());
    var api = gpub.init(options)
      .createSpec()
      .processSpec()
      .renderDiagrams();
    return {
      spec: api.spec(),
      files: gpub.templates.ProblemEbook.templater(api.bookMaker()),
    }
  },
}

gpub.templates.register(
    gpub.templates.Style.GAME_COMMENTARY_EBOOK,
    new gpub.templates.GameCommentaryEbook());
