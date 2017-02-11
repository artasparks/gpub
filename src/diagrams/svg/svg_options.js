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
   * Height of the SVG. Ignored if undefined. Units should be provided. ('10em')
   * @type {string|undefined}
   */
  this.height = o.height || undefined;

  /**
   * Width of the SVG. Ignored if undefined. Units should be provided. ('10em')
   * @type {string|undefined}
   */
  this.width = o.width || undefined;
};
