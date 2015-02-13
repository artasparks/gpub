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
  /** The template string to use for generating a 'book'. */
  bookTemplate: '...',
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
  return options;
};
