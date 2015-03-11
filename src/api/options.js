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
  /** See glift.diagrams.diagramType. */
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
  bookOptions: {}
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
