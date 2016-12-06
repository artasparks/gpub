goog.provide('gpub.Api');

goog.scope(function() {

/**
 * A GPub API wrapper. This is a container that has methods for processing
 * specs, producing diagrams, and eventually, rendering books.
 *
 * It is shallowly immutable: Each API transformation returns a new API
 * reference. However, no care is taken to ensure deep immutability of the
 * underlying objects.
 *
 * Usage:
 *
 * gpub.init({options})
 *
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
   * @return {!gpub.Api} A new reference updated with a new cache and spec.
   * @export
   */
  createSpec: function(opt_spec) {
    var ref = this.newRef_();
    if (opt_spec) {
      // The spec option has been passed in. So instead of creating a spec from
      // scratch, parse the one that's passed in.
      if (typeof opt_spec === 'string') {
        // Assume it's JSON.
        var jsonspec = /** @type {string} */ (opt_spec);
        ref.spec_ = gpub.spec.Spec.deserializeJson(jsonspec);
      } else if (typeof opt_spec === 'object') {
        // Assume the types are correct and create a copy.
        var objspec = /** @type {!gpub.spec.Spec} */ (opt_spec);
        ref.spec_ = new gpub.spec.Spec(objspec);
      } else {
        throw new Error('Unknown type for spec options. ' +
            'Must be serialized JSON or a gpub.spce.Spec object.');
      }
    } else {
      // No spec option has been passed in; Process the incoming SGFS.
      var sgfs = ref.opt_.sgfs;
      if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || sgfs.length === 0) {
        throw new Error('SGF array must be defined and non-empty ' +
            'before spec creation');
      }
      ref.cache_ = new gpub.util.MoveTreeCache();
      ref.spec_ = gpub.spec.create(ref.opt_, ref.cache_);
    }
    return ref;
  },

  /**
   * Process a GPub specification, generating new positions if necessary.
   * @param {(!gpub.api.SpecOptions)=} opt_o Optional Spec options.
   * @return {!gpub.Api} A new reference with an updated spec.
   * @export
   */
  processSpec: function(opt_o) {
    var ref = this.newRef_();
    var phase = 'processing the spec';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        specOptions: new gpub.api.SpecOptions(opt_o)
      });
    }
    ref.spec_ = gpub.spec.process(spec, cache);
    return ref;
  },

  /**
   * Render all the diagrams! Render all the diagrams and store them in a
   * possibly giant rendered JS Object. If you have many diagrams that you're
   * going to write to disk anyway, consider using `renderDiagramsStream`.
   *
   * @param {(!gpub.api.DiagramOptions)=} opt_o Optional diagram options.
   * @return {!gpub.Api} A new reference with rendered diagrams.
   * @export
   */
  renderDiagrams: function(opt_o) {
    var ref = this.newRef_();
    var phase = 'diagram rendering';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      ref.spec_ = spec;
    }
    ref.diagrams_ = gpub.diagrams.render(spec, cache);
    return ref;
  },

  /**
   * Stream the rendered diagrams to the user-provided function. The intention
   * is that the user will store these diagrams to disk or do some other
   * processing. The rendered diagrams object is still produced, because it
   * still contains useful metadata, but it will not contain the rendered
   * bytes.
   *
   * @param {!gpub.diagrams.DiagramCallback} fn Void-returning processing
   * function.
   * @param {!gpub.api.DiagramOptions=} opt_o Optional options
   * @return {!gpub.Api} A new reference with rendered diagram metadata
   * @export
   */
  renderDiagramsStream: function(fn, opt_o) {
    var ref = this.newRef_();
    var phase = 'streaming diagram rendering';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      ref.spec_ = spec;
    }
    ref.diagrams_ = gpub.diagrams.renderStream(spec, cache, fn)
    return ref;
  },

  /**
   * Returns the book maker helper. Both the spec and the rendered diagrams
   * must have been created before the book generator is created.
   * @return
   */
  bookMaker: function() {
    var phase = 'creating the book maker helper';
    var spec = this.mustGetSpec_(phase);
    var diagrams = this.mustGetRendererd_(phase);
    return new gpub.book.BookMaker(spec, diagrams);
  },

  /////////////////////////////////
  //////// Private helpers ////////
  /////////////////////////////////
  /**
   * Create a new instance of the API so that we don't reuse references. This
   * allows us to return new references upon successive .transformations.
   * @return {!gpub.Api}
   * @private
   */
  newRef_: function() {
    var ref = new gpub.Api(this.opt_);
    ref.spec_ = this.spec_;
    ref.diagrams_ = this.diagrams_;
    ref.cache_ = this.cache_;
    return ref
  },

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

  /**
   * Get the rendered diagram wrapper or throw an error.
   * @param {string} phase
   * @return {!gpub.diagrams.Rendered} The rendered diagram wrapper, which must
   *    be defined
   * @private
   */
  mustGetRendererd_: function(phase) {
    var dia = this.diagrams();
    if (!dia) {
      throw new Error('Rendered must be defined before ' + phase + '.');
    }
    return dia;
  },
};

});  // goog.scope;
