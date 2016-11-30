goog.provide('gpub.diagrams.igo.Renderer');

/**
 * @constructor @final @struct
 */
gpub.diagrams.igo.Renderer = function() {}

gpub.diagrams.igo.Renderer.prototype = {
  /**
   * The create method for igo
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return gpub.diagrams.igo.create(flat, opt);
  },

  /**
   * Render-inline the
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return gpub.diagrams.igo.renderInline(text, opt);
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['IGO'] = function() {
  return new gpub.diagrams.igo.Renderer();
};
