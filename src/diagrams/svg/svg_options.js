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

  /**
   * Style (css) rules for the SVG diagrams.
   * Map from class object of properties to values.
   *
   * Example:
   *  {
   *    '.bs': {
   *      'fill': black
   *    }
   *  }
   *
   * @type {!Object<string, !Object<string, string>>}
   */
  this.style = o.style || {};
  for (var clazz in gpub.diagrams.svg.styleDefaults) {
    var def = gpub.diagrams.svg.styleDefaults[clazz];
    if (!this.style[clazz]) {
      this.style[clazz] = def;
    } else {
      for (var key in def) {
        if (!this.style[clazz][key]) {
          this.style[clazz][key] = def[key];
        }
      }
    }
  };
};
