/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /**
   * The format of the 'book' output that is produced by GPub.
   * See gpub.bookFormat.
   */
  outputFormat: 'LATEX',

  /**
   * What is the purpose for the book? I.e., Commentary, Problem book,
   * Combination-book.
   * See gpub.bookPurpose.
   */
  bookPurpose: 'GAME_COMMENTARY',

  /**
   * See glift.enums.boardRegions.
   */
  // TODO(kashomon): Should this even be here?
  boardRegion: 'AUTO',

  /**
   * The type of diagrams produced by GPub.
   *
   * Ideally you would be able to use any diagramType in an outputFormat, but
   * that is not currently the case.  Moreover, some output formats (e.g.,
   * glift, smartgo) take charge of generating the diagrams.
   *
   * However, there are some types that are output format independent:
   *  - ASCII,
   *  - PDF,
   *  - EPS
   *
   * See glift.diagrams.diagramType.
   */
  diagramType: 'GNOS',


  /** Skip the first N diagrams. Allows users to generate parts of a book. */
  skipDiagrams: 0,

  /**
   * Maximum diagrams generated -- allows users to specify a section of the
   * book. 0 indicates that all subsequent diagrams are generated.
   */
  maxDiagrams: 0,


  /**
   * Override the default template.
   * A false-y template will result in using the default template.
   */
  template: null,

  /** Options specifically for book processors */

  // TODO(kashomon): Rename this to view so that we can have the book options be
  // separate.
  bookOptions: {},

  /**
   * Text supporting the bulk of the the work that comes before/after the mainmatter
   * of the book.
   *
   * Not all of these will be supported by all the book-generators. For those
   * that do support the relevant sections, the frontmatter and backmatter are
   * dumped into the book options.
   */
  frontmatter: {
    copyright: null, // AKA Colophon Page
    epigraph: null, // AKA Quote Page
    /** Generate the Table of Contents or just 'Contents'. */
    generateToc: true,
    forward: null, // Author or unrelated person
    preface: null, // Author
    acknowledgements: null,
    introduction: null
  },
  backmatter: {
    glossary: null
  }
};


/**
 * The type general type of the book.  Specifes roughly how we generate the
 * Glift spec.
 */
gpub.bookPurpose = {
  /** Game with commentary. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /** Set of problems and, optionally, anwsers. */
  PROBLEM_SET: 'PROBLEM_SET',

  /** A set of problems processed specifically for book consumption. */
  PROBLEM_BOOK: 'PROBLEM_BOOK'
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
  ASCII: 'ASCII'

  /** Construct a book in Smart Go format. */
  // SMART_GO: 'SMART_GO'

  // Future Work:
  // - ONLY_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};

/**
 * Process the incoming options and set any missing values.
 */
gpub.processOptions = function(options) {
  if (!options) {
    options = {};
  }
  for (var key in gpub.defaultOptions) {
    var val = options[key];
    if (!val) {
      options[key] = gpub.defaultOptions[key];
    }
  }
  if (options.skipDiagrams < 0) {
    throw new Error('skipDiagrams cannot be less than 0');
  }
  if (options.maxDiagrams < 0) {
    throw new Error('maxDiagrams cannot be less than 0');
  }
  return options;
};
