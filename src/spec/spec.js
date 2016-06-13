goog.provide('gpub.spec')

/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * Gets the the processor based on the book purpose.
   *
   * @param {gpub.spec.SgfType} sgfType
   * @return {!gpub.spec.Processor}
   */
  processor: function(sgfType) {
    if (sgfType === gpub.spec.SgfType.GAME_COMMENTARY) {
      return new gpub.spec.GameCommentary();
    }
    if (sgfType === gpub.spec.SgfType.PROBLEM) {
      return new gpub.spec.Problem();
    }
    if (sgfType === gpub.spec.SgfType.EXAMPLE) {
      return new gpub.spec.Example();
    }
    if (sgfType === gpub.spec.SgfType.POSITION_VARIATIONS) {
      return new gpub.spec.PositionVariations();
    }

    throw new Error('Unsupported book purpose: ' + sgfType);
  },

  /**
   * Creates a basic high-level GPub Specification from the passed-in sgfs. This
   * first pass does a brain-dead transformation based on the SGF defaults. It
   * does not process the spec into a flattened EXAMPLE spec.
   *
   * @param {!gpub.Options} options
   * @return {!gpub.spec.Spec}
   */
  create: function(options) {
    var sgfs = options.sgfs;
    var defaultSgfType = options.defaultSgfType;
    var defaultBoardRegion = options.boardRegion;

    var spec = new gpub.spec.Spec();

    // TODO(kashomon): Modify the topLevelGrouping based on the book data, the
    // GC node, or headers within the SGF.
    var baseGrouping = spec.grouping;
    baseGrouping.sgfType = defaultSgfType;
    baseGrouping.boardRegion = defaultBoardRegion;

    for (var i = 0; i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      var mt = glift.parse.fromString(sgfStr);
      var alias = 'sgf:' + i;

      // If the Game Name is specified, we prepend that to the index for
      // readability.
      var GN = glift.rules.prop.GN;
      if (mt.properties().contains(GN)) {
        alias = mt.properties().getOneValue(GN) + ':' + i;
      }

      // Ensure the sgf mapping contains the alias-to-sgf mapping.
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }

      // At this point, there is a 1x1 mapping between passed-in SGF and sgf
      // object. Initial position, nextMovesPath, and boardRegion don't make
      // sense until the processing into EXAMPLE types.
      var sgf = new gpub.spec.Sgf({
        alias: alias,
        id: alias
      })

      baseGrouping.sgfs.push(sgf);
    }
    return spec;
  },

  /**
   * Process a spec by transforming (flattening) all non-example types.
   */
  process: function() {},

    // if (!options.bookPurpose) {
      // throw new Error('Book Purpose must be defined');
    // }
    // var processor = gpub.spec._getSpecProcessor(options.bookPurpose);

    // spec.sgfDefaults = glift.util.simpleClone(
        // glift.widgets.options.baseOptions.sgfDefaults);
    // processor.setHeaderInfo(spec);

    // for (var i = 0; sgfs && i < sgfs.length; i++) {
      // var sgfStr = sgfs[i];
      // var mt = glift.parse.fromString(sgfStr);
      // var alias = 'sgf:' + i;
      // if (mt.properties().contains('GN')) {
        // alias = mt.properties().getOneValue('GN') + ':' + i;
      // }
      // if (!spec.sgfMapping[alias]) {
        // spec.sgfMapping[alias] = sgfStr;
      // }
      // spec.sgfCollection = spec.sgfCollection.concat(
          // processor.processOneSgf(mt, alias, options));
    // }
    // spec.metadata.bookPurpose = options.bookPurpose;
    // return spec;
  // },
};
