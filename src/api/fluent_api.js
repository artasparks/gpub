goog.provide('gpub.init');
goog.provide('gpub.Api');

goog.scope(function() {

/**
 * @param {!Object} ret Return value
 */
var checkFnRet = function(ret, msg) {
  if (!ret|| typeof ret!== 'object') {
    throw new Error(
        'Error: Your callback must return ' + msg);
  }
};

/**
 * Intended usage:
 *    gpub.init({...})
 *        .createSpec()
 *        .processSpec(() => save)
 *        .createDiagrams()
 *        .createBook()
 *
 * equivalent to:
 *    gpub.create({...})
 *
 * @param {!gpub.Options} options to process
 * @return {!gpub.Api}
 */
gpub.init = function(options) {
  gpub.api.validateInputs(options);
  // Process the options and fill in any missing values or defaults.
  options = new gpub.Options(options);
  return new gpub.Api(options);
};

/**
 * SpecPhase: Create the basic book specification.
 * @param {!gpub.Options} options
 * @struct @constructor @final
 */
gpub.Api = function(options) {
  /** @private @const {!gpub.Options} */
  this.opt_ = options;
  /** @private {?gpub.spec.Spec} */
  this.spec_ = null;
}

gpub.Api.prototype = {
  /**
   * Create an initial Gpub specification. Allow user
   * @param {!(function(!gpub.spec.Spec):!gpub.spec.Spec)=} opt_fn
   *    Optional user-specified processing function.
   * @return {!gpub.Api} this
   */
  createSpec: function(opt_fn) {
    this.spec_ = gpub.spec.create(this.opt_);
    if (opt_fn) {
      var optspec = opt_fn(this.spec_);
      if (!optspec) {
        // Spec was not returned. ignore.
      } else {
        checkFnRet(optspec, 'a gpub.spec.Spec object');
        this.spec_ = optspec;
      }
    }
    return this;
  },

  asyncError_: function() {
    throw new Error('Async behavior not enabled. Enable with `options.async = true`.');
  }
};


});  // goog.scope;
