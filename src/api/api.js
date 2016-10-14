goog.provide('gpub.api');
goog.provide('gpub.create');

/**
 * Api Namespace. Some of the methods are attached at the top level for clarity.
 * @const
 */
gpub.api = {
  /**
   * Create a 'book' output from SGFs.
   *
   * @param {!gpub.Options} options
   * @return {string}
   */
  create: function(options) {
    // Validate input and create the options array.
    gpub.api.validateInputs(options);
    // Process the options and fill in any missing values or defaults.
    options = gpub.processOptions(options);
    // Phase 1: Create the basic book specification.
    var spec = gpub.spec.create(options);
    // Phase 2: Process the spec and generate the new positions
    var processed = gpub.spec.process(spec);
    // Phase 3: Create diagrams
    // gpub.diagrams...
    // Create the finished book (or whatever that means).
    // var book = gpub.book.create(spec, options);

    // TODO(kashomon): return { contents: ..., diagrams: ... }
    //return book;

    return 'foo';
  },
};

/** @export */
gpub.create = gpub.api.create;

////////////////////////
// Methods in the API //
////////////////////////



/////////////
// Private //
/////////////

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 *
 * @param {!gpub.Options} options
 * @package
 */
gpub.api.validateInputs = function(options) {
  if (!options) {
    throw new Error('No options defined');
  }
  var sgfs = options.sgfs;
  if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || !sgfs.length) {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
};

