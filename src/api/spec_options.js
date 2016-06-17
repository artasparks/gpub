goog.provide('gpub.SpecOptions');

/**
 * Options for spec creation
 * 
 * @param {!gpub.SpecOptions=} opt_options
 *
 * @constructor @final @struct
 */
gpub.SpecOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * Optionally, the user can pass in defaults to apply to the SGFs. These are
   * the defaults applied to Phase 1: Basic spec generation.
   *
   * @const {!gpub.spec.SgfType}
   */
  this.defaultSgfType = o.defaultSgfType || gpub.spec.SgfType.GAME_COMMENTARY;
};
