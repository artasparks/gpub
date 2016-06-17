goog.provide('gpub.Options');

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
 * @param {!gpub.Options=} opt_options
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
   * Options specific to spec creation (Phases 1 and 2)
   * @const {!gpub.SpecOptions}
   */
  this.specOptions = new gpub.SpecOptions(o.specOptions);

  /**
   * Options specific to Diagrams (Phase 3)
   * @const {!gpub.DiagramOptions}
   */
  this.diagramOptions = new gpub.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.BookOptions}
   */
  this.bookOptions = new gpub.BookOptions(o.bookOptions);

  /**
   * Whether or not debug information should be displayed (initia
   *
   * @const {boolean}
   */
  this.debug = !!o.debug || false;
};


/**
 * Process the incoming options and set any missing values.
 *
 * @param {!gpub.Options} options
 * @return {!gpub.Options}
 */
gpub.processOptions = function(options) {
  return new gpub.Options(options);
};
