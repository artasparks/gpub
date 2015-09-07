/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   */
  // sgfs: [],

  /**
   * The format of the 'book' output that is produced by GPub.
   * See gpub.outputFormat.
   */
  outputFormat: 'LATEX',

  /**
   * What is the purpose for the book? I.e., Commentary, Problem book,
   * Combination-book.
   * See gpub.bookPurpose.
   */
  bookPurpose: 'GAME_COMMENTARY',

  /**
   * Default board region for cropping purposes.
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
   * See gpub.diagrams.diagramType.
   */
  diagramType: 'GNOS',

  /**
   * The size of the page. Element of gpub.book.page.type.
   */
  pageSize: 'LETTER',

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

  /**
   * Whether or not to perform box-cropping on variations.
   */
  autoBoxCropOnVariation: false,

  /**
   * List of autocropping preferences. Each element in the array should be a
   * member of glift.enums.boardRegions.
   *
   * Note: this may change if we ever support minimal/close-cropping.
   */
  regionRestrictions: [],

  ////////////////////////////
  // DiagramSpecificOptions //
  ////////////////////////////

  /** Size of the gnos font */
  // TODO(kashomon): Make this diagram-agnostic.
  gnosFontSize: '12',

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (latex).
   */
  pdfx1a: false,

  /**
   * An option only for PDF/X-1a. For this spceification, you must specify a
   * color profile file (e.g., ISOcoated_v2_300_eci.icc).
   */
  colorProfileFilePath: null,

  //////////////////
  // Book Options //
  //////////////////

  /** Options specifically for book processors */
  bookOptions: {
    /**
     * init: Any additional setup that needs to be done in the header. I.e.,
     * for diagram packages.
     */
    init: '',

    title: 'My Book',
    subtitle: null,
    publisher: 'GPub',
    authors: [
      // 'Created by GPub'
    ],
    year: null,

    /**
     * Frontmatter is text supporting the bulk of the the work that comes
     * before/after the mainmatter of the book.
     *
     * Note: It's expected that the frontmatter (except for the copyright page)
     * will be specified as a markdown-string.
     *
     * Not all of these will be supported by all the book-generators. For those
     * that do support the relevant sections, the frontmatter and backmatter are
     * dumped into the book options.
     */
    frontmatter: {
      // copyright: null, // AKA Colophon Page
      // epigraph: null, // AKA Quote Page
      foreward: null, // Author or unrelated person
      preface: null, // Author
      acknowledgements: null,
      introduction: null,

      /** Generate the Table of Contents or just 'Contents'. */
      generateToc: true,

      /**
       * Generates the copyright page. Copyright should be an object with the
       * format listed below:
       *
       *  {
       *     "publisher": "Foo Publisher",
       *     "license": "All rights reserved.",
       *     "publishYear": 2015,
       *     "firstEditionYear": 2015,
       *     "isbn": "1-1-123-123456-1",
       *     "issn": "1-123-12345-1",
       *     "addressLines": [
       *        "PO #1111",
       *        "1111 Mainville Road Rd, Ste 120",
       *        "Fooville",
       *        "CA 90001",
       *        "www.fooblar.com"
       *     ],
       *     "showPermanenceOfPaper": true,
       *     "printingRunNum": 1
       *  }
       */
      copyright: null
    }
  },

  /**
   * Whether or not debug information should be displayed.
   */
  debug: false
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
  var newo = {};
  var options = options || {};

  var simpleTemplate = function(target, base, template) {
    for (var key in template) {
      if (key === 'sgfs') {
        // We don't want to be duplicating the SGFs, so we assume that the SGFs
        // have been extracted at this point.
        continue;
      }
      if (newo[key] !== undefined) {
        // We've already copied this key
        continue;
      }
      var val = base[key];
      // Note: we treat null and empty string as intentionally falsey values,
      // thus we only rely on default behavior in the case of
      if (val !== undefined) {
        target[key] = base[key];
      } else {
        target[key] = template[key];
      }
    }
    return target;
  };

  var bookOptions = options.bookOptions || {};
  var frontmatter = bookOptions.frontmatter || {};
  var t = gpub.defaultOptions;
  simpleTemplate(
      newo, options, t);
  simpleTemplate(
      newo.bookOptions, bookOptions, t.bookOptions);
  simpleTemplate(
      newo.bookOptions.frontmatter, frontmatter, t.bookOptions.frontmatter);

  if (newo.skipDiagrams < 0) {
    throw new Error('skipDiagrams cannot be less than 0');
  }
  if (newo.maxDiagrams < 0) {
    throw new Error('maxDiagrams cannot be less than 0');
  }

  gpub.validateOptions(newo);

  return newo;
};

/**
 * Validate the options and return the passed-in obj.
 */
gpub.validateOptions = function(newo) {
  var keys = [
    'outputFormat',
    'bookPurpose',
    'boardRegion',
    'diagramType',
    'pageSize'
  ];

  var parentObjs = [
    gpub.outputFormat,
    gpub.bookPurpose,
    glift.enums.boardRegions,
    gpub.diagrams.diagramType,
    gpub.book.page.type
  ];

  if (keys.length !== parentObjs.length) {
    throw new Error('Programming error! Keys and parent objs not same length');
  }

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var value = newo[k];
    if (!parentObjs[i].hasOwnProperty(value)) {
      throw new Error('Value: ' + value + ' for property ' + k + ' unrecognized'); 
    }
  }

  return newo;
};
