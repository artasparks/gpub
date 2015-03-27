/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * A default Glift specification.
   */
  _defaultSpec: {
    // Since this is for a book definition, we don't need a divId. Clients
    // can add in a relevant ID later.
    divId: null,
    // An array of sgf-objects.  This will be populated with entries, created by
    // the spec processors.
    sgfCollection: [],
    // We must rely on SGF aliases to generate the collection to ensure the
    // collection is self contained.
    sgfMapping: {},
    // SGF Defaults that apply to all SGFs. This is a good place to specify the
    // base widget type, e.g., STANDARD_PROBLEM or EXAMPLE.
    sgfDefaults: {},
    // Metadata for the entire spec. Metedata is unused by Glift, but it's
    // sometimes convenient for Gpub.
    metadata: {}
  },

  /**
   * Gets the the processor based on the book purpose.
   */
  _getSpecProcessor: function(bookPurpose) {
    switch(bookPurpose) {
      case 'GAME_COMMENTARY':
        return gpub.spec.gameBook;
      case 'PROBLEM_SET':
        return gpub.spec.problemSet;
      default:
        throw new Error('Unsupported book purpose: ' + bookPurpose);
        break;
    }
  },

  /**
   * Creates a glift spec from an array of sgf data. At this point, we assume
   * the validity of the options passed in. In other words, we expect that the
   * options have been processed by the API.
   */
  create: function(sgfs, options) {
    var spec = glift.util.simpleClone(gpub.spec._defaultSpec);
    var processor = gpub.spec._getSpecProcessor(options.bookPurpose);

    spec.sgfDefaults = glift.util.simpleClone(
        glift.widgets.options.baseOptions.sgfDefaults);
    processor.setHeaderInfo(spec);

    for (var i = 0; sgfs && i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      var mt = glift.parse.fromString(sgfStr);
      var alias = mt.properties().getOneValue('GN') || 'sgf:' + i;
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }
      spec.sgfCollection = spec.sgfCollection.concat(
          processor.processOneSgf(mt, alias, options));
    }
    spec.metadata.bookPurpose = options.bookPurpose;
    return spec;
  },

  /**
   * Convert a movetree and a couple of options to an entry in the SGF
   * collection. Note: this doesn't set the widgetType: it's expected that users
   * will probably already have widgetType = EXAMPLE. Users can, of course, set
   * the widgetType after this processor helper.
   *
   * alias: Required. The cache alias.
   * initPos: Required. The init position
   * nextMoves: Required. Next moves path
   * boardRegion: Required. The region of the board to display.
   */
  _createExample: function(
      alias, initPos, nextMoves, region) {
    if (!alias) { throw new Error('No SGF Alias'); }
    if (!initPos) { throw new Error('No Initial Position'); }
    if (!nextMoves) { throw new Error('No Next Moves'); }
    if (!glift.enums.boardRegions[region]) {
      throw new Error('Unknown board region: ' + region);
    }
    var exType = gpub.spec.exampleType;
    var ipString = glift.rules.treepath.toInitPathString;
    var fragString = glift.rules.treepath.toFragmentString;
    var base = {
      // widgetType: 'EXAMPLE',
      alias: alias,
      initialPosition: ipString(initPos),
      nextMovesPath: fragString(nextMoves),
      boardRegion: region,
      widgetType: 'EXAMPLE'
    };
    return base;
  }
};
