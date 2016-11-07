goog.provide('gpub.diagrams.svg.Renderer');

/**
 * The diagrams-specific renderer for svg.
 * @constructor @final @struct
 */
gpub.diagrams.svg.Renderer = function() {};

gpub.diagrams.svg.Renderer.prototype = {
  /**
   * Create an SVG diagarm from a flattened object.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return gpub.diagrams.svg.create(flat, opt);
  },

  /**
   * This isn't really possible with SVG, but it might be possible to rely on a
   * font for inline-rendering. Note that inline-rendering is overloaded here
   * because for SVG, this means raw inclusion in HTML, and here I mean
   * processing text like 'Black 6' into stone-images within the text.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return gpub.diagrams.svg.renderInline(text, opt);
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['SVG'] = function() {
  return new gpub.diagrams.svg.Renderer();
};
