goog.provide('gpub.Api');

goog.scope(function() {

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

gpub.Api.prototype = {
  /**
   * @return {?gpub.spec.Spec} The spec, if it exists.
   * @export
   */
  spec: function() { return this.spec_; },

  /**
   * @return {?gpub.diagrams.Rendered} The rendered diagrams, if they exist.
   * @export
   */
  diagrams: function() { return this.diagrams_; },

  /**
   * @return {?gpub.diagrams.Rendered} Just the metadata for the diagrams.
   * @export
   */
  diagramMetadata: function() {
    // TODO(kashomon): Make a separate type.
    return this.diagrams_;
  },

  /**
   * @return {string} Return the serialized JSON spec or empty string. 
   * @export
   */
  jsonSpec: function() { return this.spec_ ? this.spec_.serializeJson() : '' },

  /**
   * Create an initial GPub specification. This can either be created from
   * scratch or from an existing spec (in either it's object or JSON form).
   *
   * @param {(!gpub.spec.Spec|string)=} opt_spec Optionally pass in a spec, in
   *    either a serialized JSON form, or in the object form.
   * @return {!gpub.Api} this
   * @export
   */
  createSpec: function(opt_spec) {
    if (opt_spec) {
      // The spec option has been passed in. So instead of creating a spec from
      // scratch, parse the one that's passed in.
      if (typeof opt_spec === 'string') {
        // Assume it's JSON.
        var jsonspec = /** @type {string} */ (opt_spec);
        this.spec_ = gpub.spec.Spec.deserializeJson(jsonspec);
      } else if (typeof opt_spec === 'object') {
        // Assume the types are correct and create a copy.
        var objspec = /** @type {!gpub.spec.Spec} */ (opt_spec);
        this.spec_ = new gpub.spec.Spec(objspec);
      } else {
        throw new Error('Unknown type for spec options. ' +
            'Must be serialized JSON or a gpub.spce.Spec object.');
      }
    } else {
      // No spec option has been passed in; Process the incoming SGFS.
      var sgfs = this.opt_.sgfs;
      if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || sgfs.length === 0) {
        throw new Error('SGF array must be defined and non-empty ' +
            'before spec creation');
      }
      this.cache_ = new gpub.util.MoveTreeCache();
      this.spec_ = gpub.spec.create(this.opt_, this.cache_);
    }
    return this;
  },

  /**
   * Process a GPub specification, generating new positions if necessary.
   * @param {(!gpub.api.SpecOptions)=} opt_o Optional Spec options.
   * @return {!gpub.Api} this
   * @export
   */
  processSpec: function(opt_o) {
    var phase = 'processing the spec';
    var spec = this.mustGetSpec_(phase);
    var cache = this.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        specOptions: new gpub.api.SpecOptions(opt_o)
      });
    }
    this.spec_ = gpub.spec.process(spec, cache);
    return this;
  },

  /**
   * Render all the diagrams! Render all the diagrams and store them in a
   * possibly giant rendered JS Object. If you have many diagrams that you're
   * going to write to disk anyway, consider using `renderDiagramsStream`.
   *
   * @param {(!gpub.api.DiagramOptions)=} opt_o Optional diagram options.
   * @return {!gpub.Api} this
   * @export
   */
  renderDiagrams: function(opt_o) {
    var phase = 'diagram rendering';
    var spec = this.mustGetSpec_(phase);
    var cache = this.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      this.spec_ = spec;
    }
    this.diagrams_ = gpub.diagrams.render(spec, cache);
    return this;
  },

  /**
   * Stream the rendered diagrams to the user-provided function. The intention
   * is that the user will store these diagrams to disk or do some other
   * processing. The rendered diagrams object is still produced, because it
   * still contains useful metadata, but it will not contain the rendered
   * bytes.
   *
   * @param {!function(gpub.diagrams.Diagram)} fn Void-returning processing
   *    function.
   * @param {!gpub.api.DiagramOptions=} opt_o Optional options
   * @return {!gpub.Api} this
   * @export
   */
  renderDiagramsStream: function(fn, opt_o) {
    var phase = 'streaming diagram rendering';
    var spec = this.mustGetSpec_(phase);
    var cache = this.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      this.spec_ = spec;
    }
    gpub.diagrams.renderStream(spec, cache, fn)
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
   * @private
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
