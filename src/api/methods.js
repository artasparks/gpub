////////////////////////
// Methods in the API //
////////////////////////


/**
 * Create a book or other output from 
 *
 * SGFS: Array of SGFs.
 * options: An options array. See gpub.defaultOptions for the format.
 *
 * Returns: The completed book or document.
 */
gpub.create = function(sgfs, options) {
  // Validate input and create the options array.
  gpub._validateInputs(sgfs, options);

  // Process the options and fill in any missing values or defaults.
  options = gpub.processOptions(options);

  // Create the glift specification.
  var spec = gpub.spec.create(sgfs, options);

  // Create the finished book (or whatever that means).
  var book = gpub.book.generate

  return spec;
};

/**
 * 
 */
gpub.createDiagrams = function(sgfs, options) {

};

/////////////
// Private //
/////////////

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 */
gpub._validateInputs = function(sgfs, options) {
  if (!sgfs || !sgfs.length || glift.util.typeOf(sgfs) !== 'array') {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
};

