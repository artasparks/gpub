goog.provide('gpub.Options');
goog.provide('gpub.OptionsDef');
goog.provide('gpub.opts');


/**
 * Namespace for the options
 * @namespace
 */
gpub.opts = {};


/**
 * Typedef for options.
 *
 * @typedef {{
 *  games: (!Object<string>|undefined),
 *  grouping: (!gpub.opts.RawGrouping|!Array<string>|undefined),
 *  specOptions: (!gpub.opts.SpecOptionsDef|undefined),
 *  diagramOptions: (!gpub.opts.DiagramOptionsDef|undefined),
 *  templateOptions: (!gpub.opts.TemplateOptionsDef|undefined),
 *  debug: (boolean|undefined),
 * }}
 */
gpub.OptionsDef;


/**
 * Default options for GPub API. Recall that GPub has 4 tasks:
 * - Create a spec (a serialized book prototype).
 * - Flatten the spec into an example spec.
 * - Create diagrams
 * - Assemble the diagrams into a book.
 *
 * These are the set of options for all 4 phases.
 * @param {(!gpub.Options|!gpub.OptionsDef)=} opt_options
 * @constructor @struct @final
 */
gpub.Options = function(opt_options) {
  var o = opt_options || {};

  /**
   * A object, containing a bijection between ID and game-data. No default is
   * specified here: Must be explicitly passed in every time.
   *
   * Note: It's currently assumed that these games are specified as SGFs
   * (although it's possible this might be configurable later).
   *
   * @const {!Object<string, string>}
   */
  this.games = o.games || {};

  /**
   * An grouping must always be provided. This says how to group the SGFs in
   * the book.
   *
   * - In the simplest case, users can specify an array on IDs. This is
   *   suitable for simple books such as simple commentary and simple problem
   *   books.
   * - More complex books can be specified via a nested grouping structure.
   *
   * @const {!gpub.opts.RawGrouping|!Array<string>|undefined}
   */
  this.grouping = o.grouping || undefined;

  /**
   * The type of template to use. Only used when creating full templated books.
   *
   * @const {gpub.templates.Style}
   */
  this.template = o.template ||
      gpub.templates.Style.RELENTLESS_COMMENTARY_LATEX;

  /**
   * Options specific to spec creation.
   * @const {!gpub.opts.SpecOptions}
   */
  this.specOptions = new gpub.opts.SpecOptions(o.specOptions);

  /**
   * Options specific to diagrams.
   * @const {!gpub.opts.DiagramOptions}
   */
  this.diagramOptions = new gpub.opts.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.opts.TemplateOptions}
   */
  this.templateOptions = new gpub.opts.TemplateOptions(o.templateOptions);

  /**
   * Whether or not debug information should be displayed.
   * @const {boolean}
   */
  this.debug = !!o.debug || false;
};


/**
 * Apply default options to the top-level options object.
 * @param {!gpub.OptionsDef} opts
 * @param {!gpub.OptionsDef} defaults
 * @return {!gpub.OptionsDef}
 */
gpub.Options.applyDefaults = function(opts, defaults) {
  var sopts = opts.specOptions || {};
  var sdef = defaults.specOptions || {};
  opts.specOptions = gpub.opts.SpecOptions.applyDefaults(sopts, sdef);

  var dopts = opts.diagramOptions || {};
  var ddef = defaults.diagramOptions || {};
  opts.diagramOptions = gpub.opts.DiagramOptions.applyDefaults(dopts, ddef);

  var topts = opts.templateOptions || {};
  var tdef = defaults.templateOptions || {};
  opts.templateOptions = gpub.opts.TemplateOptions.applyDefaults(topts, tdef);
  return opts;
};

