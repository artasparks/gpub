goog.provide('gpub.Options');
goog.provide('gpub.OptionsDef');


/**
 * Typedef for options.
 *
 * @typedef {{
 *  sgfs: (!Array<string>|undefined),
 *  ids: (!Array<string>|undefined),
 *  specOptions: (!gpub.api.SpecOptionsDef|undefined),
 *  diagramOptions: (!gpub.api.DiagramOptionsDef|undefined),
 *  templateOptions: (!gpub.api.TemplateOptionsDef|undefined),
 *  debug: (boolean|undefined),
 * }}
 */
gpub.OptionsDef;


/**
 * Default options for GPub API. Recall that GPub has 4 tasks:
 *
 * - Create a spec (a serialized book prototype).
 * - Flatten the spec into an example spec.
 * - Create diagrams
 * - Assemble the diagrams into a book.
 *
 * These are the set of options for all 4 phases.
 *
 * @param {(!gpub.Options|!gpub.OptionsDef)=} opt_options
 *
 * @constructor @struct @final
 */
gpub.Options = function(opt_options) {
  var o = opt_options || {};

  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   *
   * @const {!Array<string>}
   */
  this.sgfs = o.sgfs || [];

  /**
   * Optianal array of IDs corresponding to the SGFs. If supplied, should be
   * the same length as the sgfs. If not specified, artificial IDs will be
   * created.
   * @const {!Array<string>|undefined}
   */
  this.ids = o.ids || undefined;

  this.ensureUniqueIds();

  /**
   * The type of template to use. Only used when creating full templated books.
   *
   * @const {gpub.templates.Style}
   */
  this.template = o.template ||
      gpub.templates.Style.RELENTLESS_COMMENTARY_LATEX;

  /**
   * Options specific to spec creation.
   * @const {!gpub.api.SpecOptions}
   */
  this.specOptions = new gpub.api.SpecOptions(o.specOptions);

  /**
   * Options specific to diagrams.
   * @const {!gpub.api.DiagramOptions}
   */
  this.diagramOptions = new gpub.api.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.api.TemplateOptions}
   */
  this.templateOptions = new gpub.api.TemplateOptions(o.templateOptions);

  /**
   * Whether or not debug information should be displayed.
   * @const {boolean}
   */
  this.debug = !!o.debug || false;
};


/**
 * Apply default options to
 * @param {!gpub.OptionsDef} opts
 * @param {!gpub.OptionsDef} defaults
 * @return {!gpub.OptionsDef}
 */
gpub.Options.applyDefaults = function(opts, defaults) {
  var dopts = opts.diagramOptions || {};
  var ddef = opts.diagramOptions || {};
  opts.diagramOptions = gpub.api.DiagramOptions.applyDefaults(dopts, ddef);

  return opts;
};


/**
 * Ensure that the IDs are unique. Throws an error if the IDs are not unique.
 */
gpub.Options.prototype.ensureUniqueIds = function() {
  if (this.ids) {
    if (this.ids.length !== this.sgfs.length) {
      throw new Error('If IDs array is provided, ' +
          'it must be the same length as the SGFs array');
    } else {
      // Ensure uniqueness.
      var tmpMap = {};
      for (var i = 0; i < this.ids.length; i++) {
        var id = this.ids[i];
        if (tmpMap[this.ids[i]]) {
          throw new Error('IDs must be unique. Found duplicate: ' + id);
        }
        tmpMap[id] = true;
      }
    }
  }
};
