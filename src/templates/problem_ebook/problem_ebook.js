goog.provide('gpub.templates.ProblemEbook');

/**
 * @param {!gpub.OptionsDef} opts
 * @constructor @struct @final
 */
gpub.templates.ProblemEbook = function(opts) {
  /** @type {!gpub.OptionsDef} */
  this.opts = opts;
};

gpub.templates.ProblemEbook.prototype = {
  /**
   * Defaulted options.
   * @return {!gpub.OptionsDef}
   */
  defaults: function() {
    return {
      specOptions: {
        positionType: gpub.spec.positionType.PROBLEM,
        autoRotateCropPrefs: {
          corner: glift.enums.boardRegions.BOTTOM_LEFT,
          preferFlips: true,
        }
      },
      diagramOptions: {
        diagramType: gpub.diagrams.diagramType.SVG,
        clearMarks: true,
      }
    }
  },

  /**
   * Creates the book!
   * @return {!Array<!gpub.book.File>} The finished book files.
   */
  create: function() {
    var options = gpub.Options.applyDefaults(this.opts, this.defaults());
    var bookMaker = gpub.init(options)
      .createSpec()
      .processSpec()
      .renderDiagrams()
      .bookMaker();
    return gpub.templates.ProblemEbook.templater(bookMaker);
  },
};
