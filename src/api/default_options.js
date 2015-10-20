/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   */
  sgfs: null,

  /**
   * A Glift Spec (Phase 2.) can be passed in, bypasing spec creation.
   */
  spec: null,

  /**
   * Book generation happens in 3 phases: SPEC, DIAGRAMS, BOOK.
   * See gpub.outputPhase.
   */
  outputPhase: 'BOOK',

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

  /**
   * Size of the intersections in the diagrams. If no units are specified, the
   * number is assumed to be in pt.
   */
  goIntersectionSize: '12pt',

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
      foreword: null, // Author or unrelated person
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
    },

    appendices: {
      glossary: null
    }
  },

  /**
   * Whether or not debug information should be displayed.
   */
  debug: false
};


