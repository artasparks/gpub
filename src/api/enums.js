/**
 * The format for gpub output.
 *
 * @enum {string}
 */
gpub.OutputFormat = {
  /** Construct a book in ASCII format. */
  ASCII: 'ASCII',

  /** Constructs a EPub book. */
  EPUB: 'EPUB',

  /** Constructs a full HTML page. This is often useful for testing. */
  HTMLPAGE: 'HTMLPAGE',

  /** Construct a book with a LaTeX format. */
  LATEX: 'LATEX'

  /** Construct a book in Smart Go format. */
  // SMART_GO: 'SMART_GO'

  // Future Work:
  // - ONLY_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};


/**
 * Enum-like type enumerating the supported page sizes. The sizes here are meant
 * to represent sizes that professional printers will realistically print at.
 *
 * TODO(kashomon): IIt's possible that the height/width should be specified as
 * two separat params, but this helps prevents errors.
 *
 * @enum {string}
 */
gpub.PageSize = {
  A4: 'A4',
  /** 8.5 x 11 */
  LETTER: 'LETTER',
  /** 6 x 9 */
  OCTAVO: 'OCTAVO',
  /** 5 x 7 */
  NOTECARD: 'NOTECARD',
  /** 8 x 10 */
  EIGHT_TEN: 'EIGHT_TEN',
  /** 5.5 x 8.5 */
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE',
};
