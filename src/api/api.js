/**
 * Stub namespace.
 */
gpub.api = {};

/**
 * The type general type of the book.  Specifes roughly how 
 */
gpub.bookPurpose = {
  /** Game with commentary. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /** Set of problems and, optionally, anwsers. */
  PROBLEM_SET: 'PROBLEM_SET'
};

/**
 * The format for gpub output.
 */
gpub.outputFormat = {
  /** Construct a book with a LaTeX format. */
  LATEX: 'LATEX',

  /** Constructs a full HTML page. This is often useful for testing. */
  HTML_PAGE: 'HTML_PAGE',

  /** Construct a book in ASCII format. */
  ASCII: 'ASCII'

  // Future Work:
  // - LATEX_DIAGRAMS
  // - PDF_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};

/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /** See gpub.bookFormat. */
  outputFormat: 'LATEX',
  /** See gpub.bookPurpose. */
  bookPurpose: 'GAME_COMMENTARY',
  /** See glift.enums.boardRegions. */
  boardRegion: 'AUTO',
};

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

/**
 * Process the incoming options and set any missing values.
 */
gpub.processOptions(options) {
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

  return spec;
};
