/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(flattened, options) {
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for PDF rendering.
    return text;
  }
};
