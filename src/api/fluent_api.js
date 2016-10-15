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
 *      .createSpec()
 *      .processSpec()
 *      .createDiagrams()
 *      .createBook()
 *
 * Equivalent to:
 *    gpub.create({...})
 *
 * @param {!gpub.Options} options to process
 * @return {!gpub.Api}
 */
gpub.init = function(options) {
  gpub.api.validateInputs(options);
  return new gpub.Api(new gpub.Options(options));
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
};

/**
 * Process the return options from a processing phase.
 * @param {T} p
 * @param {string} msg
 * @param {!(function(T):T)=} opt_fn
 * @return {T} Processed p.
 * @template T
 */
var sendback = function(p, msg, opt_fn) {
  if (opt_fn) {
    var newp = opt_fn(p);
    if (!newp) {
      // object was not returned. Ignore.
      return p
    } else {
      checkFnRet(newp, 'a gpub.spec.Spec object');
    }
    p = newp;
  }
  return p;
};

gpub.Api.prototype = {
  /**
   * Create an initial GPub specification.
   * @param {!(function(!gpub.spec.Spec):!gpub.spec.Spec)=} opt_fn
   *    Optional user-specified processing function.
   * @return {!gpub.Api} this
   */
  createSpec: function(opt_fn) {
    this.spec_ = sendback(
        gpub.spec.create(this.options()),
        'a gpub.spec.Spec object',
        opt_fn);
    return this;
  },

  /**
   * Process a GPub specification, generating new positions if necessary.
   * @param {!(function(!gpub.spec.Spec):!gpub.spec.Spec)=} opt_fn
   *    Optional user-specified processing function.
   * @return {!gpub.Api} this
   */
  processSpec: function(opt_fn) {
    var spec = this.spec();
    if (!spec) {
      throw new Error('Spec must be defined before processing.');
    }
    this.spec_ = sendback(
        gpub.spec.process(spec),
        'a processed gpub.spec.Spec object',
        opt_fn);
    return this;
  },

  /** @return {!gpub.Options} The options object. */
  options: function() {
    return this.opt_;
  },

  /** @return {?gpub.spec.Spec} The spec, if it exists. */
  spec: function() {
    return this.spec_;
  },

  /**
   * @return {string} Return the serialized JSON or empty string if no spec can
   * can be found.
   */
  jsonSpec: function() {
    var spec = this.spec_;
    if (spec) {
      return spec.serializeJson();
    } else {
      return '';
    }
  }
};

});  // goog.scope;
