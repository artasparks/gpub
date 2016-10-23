goog.provide('gpub.Api');

goog.scope(function() {

/**
 * @param {!Object} ret Return value
 */
var checkFnRet = function(ret, msg) {
  if (!ret|| typeof ret!== 'object') {
    throw new Error('Error: Your callback must return ' + msg);
  }
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
  /** @private {?gpub.diagrams.Rendered} */
  this.diagrams_ = null;
  /** @private {!gpub.util.MoveTreeCache|undefined} */
  this.cache_ = undefined;
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
  /** @return {!gpub.Options} The options object. */
  options: function() { return this.opt_; },

  /** @return {?gpub.spec.Spec} The spec, if it exists. */
  spec: function() { return this.spec_; },

  /** @return {?gpub.diagrams.Rendered} The rendered diagrams, if they exists. */
  diagrams: function() { return this.diagrams_; },

  /** @return {string} Return the serialized JSON spec or empty string. */
  jsonSpec: function() { return this.spec_ ? this.spec_.serializeJson() : '' },

  /**
   * Create an initial GPub specification.
   * @param {!(function(!gpub.spec.Spec):!gpub.spec.Spec)=} opt_fn
   *    Optional user-specified processing function.
   * @return {!gpub.Api} this
   */
  createSpec: function(opt_fn) {
    this.cache_ = new gpub.util.MoveTreeCache();
    this.spec_ = sendback(gpub.spec.create(this.options(), this.cache_),
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
    var phase = 'processing the spec';
    this.spec_ = sendback(
        gpub.spec.process(this.mustGetSpec_(phase), this.getCacheOrInit_(phase)),
        'a processed gpub.spec.Spec object',
        opt_fn);
    return this;
  },

  /**
   * Render all the diagrams! Render all the diagrams and store them in a
   * possibly giant rendered JS Object. If you have many diagrams that you're
   * going to write to disk anyway, consider using `renderDiagramsStream`.
   *
   * @param {!(function(!gpub.diagrams.Rendered):!gpub.diagrams.Rendered)=} opt_fn
   *    Optional user-specified processing function for when diagram generation
   *    is finished.
   * @return {!gpub.Api} this
   */
  renderDiagrams: function(opt_fn) {
    var phase = 'diagram rendering';
    this.diagrams_ = sendback(
        gpub.diagrams.render(
            this.mustGetSpec_(phase),
            this.getCacheOrInit_(phase)),
        'a processed gpub.diagrams.Rendered object',
        opt_fn);
    return this;
  },

  /**
   * Stream the rendered diagrams to the user-provided function. The intention
   *    is that the user will store these diagrams to disk or do some other
   *    processing.
   * @param {!function(gpub.diagrams.Diagram)} fn Void-returning processing
   *    function.
   * @return {!gpub.Api} this
   */
  renderDiagramsStream: function(fn) {
    var phase = 'streaming diagram rendering';
    gpub.diagrams.renderStream(
        this.mustGetSpec_(phase),
        this.getCacheOrInit_(phase),
        fn);
    return this;
  },

  /////////////////////////////////
  //////// Private helpers ////////
  /////////////////////////////////

  /**
   *  Get an existing cache or create a new one from the spec. Throws an error
   *  if the spec is not defined.
   *  @param {string} phase During which this occurred (for error messaging)..
   *  @return {!gpub.util.MoveTreeCache} The cache
   *  @private
   */
  getCacheOrInit_: function(phase) {
    var spec = this.mustGetSpec_(phase);
    if (!this.cache_) {
      // If the user passes in the spec instead of starting from the beginning,
      // it's possible that the user has skipped diagram creation.
      this.cache_ = new gpub.util.MoveTreeCache(spec.sgfMapping);
    }
    return this.cache_;
  },

  /**
   * Get the spec or throw an error.
   * @param {string} phase
   * @return {!gpub.spec.Spec} The spec, which must be defined
   */
  mustGetSpec_: function(phase) {
    var spec = this.spec();
    if (!spec) {
      throw new Error('Spec must be defined before ' + phase + '.');
    }
    return spec;
  },
};

});  // goog.scope;
