goog.provide('gpub.diagrams.svg.Options');

/**
 * Options for SVG diagram generation
 *
 * @param {!gpub.diagrams.svg.Options=} opt_options
 *
 * @constructor @struct @final
 */
gpub.diagrams.svg.Options = function(opt_options) {
  var o = opt_options || {};

  /**
   * Height of the SVG. Ignored if 0.
   * @type {number}
   */
  this.height = o.height || 0;

  /**
   * Width of the SVG. Ignored if 0.
   * @type {number}
   */
  this.width = o.width || 0;
};
