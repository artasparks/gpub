/**
 * Generate SVG go diagrams.
 */
gpub.diagrams.svg = {
  create: function(flattened, options) {
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for SVG rendering.
    return text;
  }
};
