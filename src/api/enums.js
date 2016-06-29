/**
 * The phases of GPub. GPub generation happens in four phases. Generation can
 * stop at any one of the four steps and output the results.
 *
 * 1. Options. In this step, we process tho options for validity. Stopping at
 *    this step produces a validate options spec with only the file
 * 2. Spec Generation. This a description of the book in JSON. This is
 *    equivalent to a Glift spec, with embedded SGFs.
 * 3. Diagram Generation. The diagrams are generated next.
 * 4. Book Generation. Lastly, the diagrams are combined together to form the
 *    book.
 *
 * For a variety of reasons, the book generation can be terminated at any one of
 * these 3 phases.
 *
 * @enum {string}
 */
gpub.OutputPhase = {
  OPTIONS: 'OPTIONS',
  SPEC: 'SPEC',
  DIAGRAMS: 'DIAGRAMS',
  BOOK: 'BOOK'
};


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
 * Types of diagram output.
 *
 * @enum {string}
 */
gpub.DiagramType = {
  /**
   * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
   */
  GOOE: 'GOOE',

  /**
   * Variant of Gooe series.
   */
  GNOS: 'GNOS',

  /////////////////////////////
  // Morass of planned types //
  /////////////////////////////

  /**
   * Another LaTeX font / LaTeX style package
   * >> Not Currently Supported
   */
  //IGO: 'IGO',

  /**
   * Native PDF generation
   * >> Not Currently Supported, but here for illustration.
   */
  //PDF: 'PDF',

  /**
   * Generate SVG Diagrams.
   */
  //SVG: 'SVG'
  //
  /**
   * Sensei's library ASCII variant.
   */
  //SENSEIS_ASCII: 'SENSEIS_ASCII',

  /**
   * GPUB's ASCII variant.
   */
  //GPUB_ASCII: 'GPUB_ASCII',
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
