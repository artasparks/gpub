goog.provide('gpub.spec.SpecVersion');
goog.provide('gpub.spec.Spec');
goog.provide('gpub.spec.SpecDef');

/**
 * @typedef {{
 *  version: (gpub.spec.SpecVersion|undefined),
 *  grouping: (!gpub.spec.Grouping|undefined),
 *  sgfMapping: (!Object<string, string>|undefined),
 *  specOptions: (!gpub.opts.SpecOptions|undefined),
 *  diagramOptions: (!gpub.opts.DiagramOptions|undefined),
 *  templateOptions: (!gpub.opts.TemplateOptions|undefined),
 * }}
 */
gpub.spec.SpecDef;

/**
 * The version of the spec. Necessary for storage-compatibility.
 * @enum {string}
 */
gpub.spec.SpecVersion = {
  V1: 'V1'
};

/**
 * A book spec represents a serialized Book specification or Spec. Re-running
 * Gpub on the same spec should generate the same output, modulo some details
 * like dates and debug information
 *
 * The Book Spec is descendent from the Glift Spec, but has orthogonal concerns
 * and so is separate.
 *
 * @param {(!gpub.spec.Spec|gpub.spec.SpecDef)=} opt_spec
 *
 * @constructor @struct @final
 */
gpub.spec.Spec = function(opt_spec) {
  var o = opt_spec || {};

  /**
   * The version of this spec. Required so that parsing of old specs can still
   * happen.
   *
   * @const {!gpub.spec.SpecVersion}
   */
  this.version = o.version || gpub.spec.SpecVersion.V1;

  /**
   * Top-level Position grouping.
   *
   * @const {!gpub.spec.Grouping}
   */
  this.rootGrouping = new gpub.spec.Grouping(o.rootGrouping);

  /**
   * Mapping from SGF Alias to SGF string. It's not required that this be a
   * bijection, but it doesn't really make sense to duplicate SGFs in the
   * mapping.
   *
   * @const {!Object<string, string>}
   */
  this.sgfMapping =  {};
  if (o.sgfMapping) {
    for (var key in o.sgfMapping) {
      this.sgfMapping[key] = o.sgfMapping[key];
    }
  }

  /**
   * Options specific to spec creation (Phases 1 and 2)
   * @const {!gpub.opts.SpecOptions}
   */
  this.specOptions = new gpub.opts.SpecOptions(o.specOptions);

  /**
   * Options specific to Diagrams (Phase 3)
   * @const {!gpub.opts.DiagramOptions}
   */
  this.diagramOptions = new gpub.opts.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.opts.TemplateOptions}
   */
  this.templateOptions = new gpub.opts.TemplateOptions(o.templateOptions);
};

/**
 * Deserialize a spec from JSON
 * @param {string} str
 */
gpub.spec.Spec.deserializeJson = function(str) {
  var obj = /** @type {!gpub.spec.Spec} */ (JSON.parse(str));
  return new gpub.spec.Spec(obj);
};

/**
 * Overwrite the top-level entries of the first param with properties/values of
 * the second.
 *
 * @param {!Object} oldobj
 * @param {!gpub.spec.SpecDef} newobj
 * @return {!gpub.spec.Spec} a new option sobject.
 */
gpub.spec.Spec.overwrite = function(oldobj, newobj) {
  var out = {};
  for (var key in oldobj) {
    out[key] = oldobj[key];
  }
  for (var key in newobj) {
    out[key] = newobj[key];
  }
  return new gpub.spec.Spec(/** @type {!gpub.spec.SpecDef} */ (out));
};

gpub.spec.Spec.prototype = {
  /**
   * Transform a this spec into a JSON represontation.
   * @return {string}
   */
  serializeJson: function() {
    return JSON.stringify(this);
  },

  /**
   * Serialize, but remove the any value that's equal to a default value
   * @return {string}
   */
  serializeRemovingDefaults: function() {
    return '';
  },
};
