////////////////////////
// Methods in the API //
////////////////////////


/**
 * Create a 'book' output from SGFs.
 *
  options: A book options array. See gpub.defaultOptions for the format.
 *
 * Returns: The completed book or document.
 */
gpub.create = function(options) {
  // Validate input and create the options array.
  gpub._validateInputs(options);

  // Process the options and fill in any missing values or defaults.
  options = gpub.processOptions(options);

  var sgfs = options.sgfs;

  // TODO(kashomon): This is a little weird, but we delete the SGFs out of the
  // object so and choose to explicitly the SGFs around for clarity.
  delete options.sgfs;

  // Ensure debugging mode reflects the options mode. Also ensure that debug is
  // boolean.
  gpub.global.debug = !!options.debug;

  // Create the glift specification.
  var spec = gpub.spec.create(sgfs, options);

  // Create the finished book (or whatever that means).
  var book = gpub.book.create(spec, options);

  // TODO(kashomon): return { contents: ..., diagrams: ... }
  return book;
};


/////////////
// Private //
/////////////

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 */
gpub._validateInputs = function(options) {
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

