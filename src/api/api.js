/**
 * Stub namespace. Not really used because all the API should exist at the top
 * level.
 */
gpub.api = {};

/**
 * The type general type of the book.  Specifes roughly how we generate the
 * Glift spec.
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
  HTMLPAGE: 'HTMLPAGE',

  /** Construct a book in ASCII format. */
  ASCII: 'ASCII',

  /** Construct a book in Smart Go format. */
  SMART_GO: 'SMART_GO'

  // Future Work:
  // - ONLY_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};
