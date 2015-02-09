/**
 * Stub namespace.
 */
gpub.api = {};

/**
 * The type general type of the book.  Specifes roughly how 
 */
gpub.bookPurpose = {
  'GAME_COMMENTARY': 'GAME_COMMENTARY',

  'PROBLEM_SET': 'PROBLEM_SET'
};

/**
 * The format for the final book.
 */
gpub.bookFormat = {
  /** Construct a book with a LaTeX format. */
  LATEX: 'LATEX',

  /** Construct a book in an HTML format. */
  HTML: 'HTML'
};

/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  bookFormat: 'LATEX',
  bookPurpose: 'GAME_COMMENTARY'
};

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 */
gpub._validateInputs = function(sgfs, options) {
  if (!sgfs || !sgfs.length) {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
  if (!options) {
    options = {};
  }
  for (var key in gpub.defaultOptions) {
    var val = options[key];
    if (!val) {
      options[key] = gpub.defaultOptions[key];
    }
  }
  return options;
};

/**
 * The API for Gift
 *
 * SGFS: Array of SGFs.
 * options: An options array. See gpub.defaultOptions for the format.
 */
gpub.create = function(sgfs, options) {
  // Validate input and create the options array.
  options = gpub._validateInputs(sgfs, options);

  // Create the spec.
};
