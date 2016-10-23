goog.provide('gpub.diagrams.gnos.Renderer');

/**
 * The diagrams-specific renderer for gnos. Implicitly, this implements the
 * gpub.diagrams.DiagramRenderer record-type interface.
 *
 * @constructor @final @struct
 */
gpub.diagrams.gnos.Renderer = function() {}

gpub.diagrams.gnos.Renderer.prototype = {
  /**
   * The create method!
   *
   * We expect flattened and options to be defined.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return gpub.diagrams.gnos.create(flat, opt);
  },

  /**
   * Return initialization strings for a specific output formats.
   * @return {!Object<gpub.OutputFormat, string>}
   */
  // TODO(kashomon): It's not clear to me how this should generalize, even
  // though it is necessary for latex. It's possible that instructions for use
  // should be given, rather than some programatic interface like this.
  init: function() {
    var out = {};
    out[gpub.OutputFormat.LATEX] = '\\usepackage{gnos}';
    return out;
  },

  /**
   * Render-inline the
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return gpub.diagrams.gnos.renderInline(text, opt);
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['GNOS'] = function() {
  return new gpub.diagrams.gnos.Renderer();
};
