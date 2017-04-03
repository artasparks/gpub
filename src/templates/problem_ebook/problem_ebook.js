goog.provide('gpub.templates.ProblemEbook');

/**
 * @constructor @struct @final
 */
gpub.templates.ProblemEbook = function() {
};

gpub.templates.ProblemEbook.prototype = {
  /**
   * Defaulted options.
   * @return {!gpub.OptionsDef}
   */
  defaults: function() {
    return {
      specOptions: {
        positionType: gpub.spec.PositionType.PROBLEM,
        autoRotateCropPrefs: {
          corner: glift.enums.boardRegions.BOTTOM_LEFT,
          preferFlips: true,
        }
      },
      diagramOptions: {
        diagramType: gpub.diagrams.Type.SVG,
        clearMarks: true,
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
};

gpub.templates.register(
    gpub.templates.Style.PROBLEM_EBOOK,
    gpub.templates.ProblemEbook);
