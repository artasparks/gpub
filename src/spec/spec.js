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
   * Process a spec by transforming (flattening) all non-example SGFs. If a set
   * of sgfs contains non-example SGFS, then all SGFS are grouped by type into
   * new Grouping objects and prepended to the sub-groupings list.
   *
   * @param {!gpub.spec.Spec} spec
   */
  process: function(spec) {
    var mapping = spec.sgfMapping;
    var groupingCopy = new gpub.spec.Grouping(spec.grouping);
    gpub.spec.processGrouping_(mapping, groupingCopy);
    return new gpub.spec.Spec({
      mapping: mapping,
      grouping: groupingCopy,
    })
  },

  /**
   * Processing the grouping object.
   * @param {!Object<string, string>} sgfMapping,
   * @param {!gpub.spec.Grouping} grouping
   * @private
   */
  processGrouping_: function(sgfMapping, grouping) {
    var containsAllExmples = true;
    for (var i = 0; i < grouping.sgfs.length; i++) {
      var sgf = grouping.sgfs[i];
      if (sgf.sgfType !== gpub.spec.SgfType.EXAMPLE) {
        containsAllExmples = false;
        break;
      }
    }
    if (containsAllExmples) {
      // We're done!
    } else {
      var groupingSgfs = grouping.sgfs;
      grouping.sgfs = []
      var currentType = null;
      var sameTypeSgfs = [];
      for (var i = 0; i < groupingSgfs.length; i++) {
        var sgf = groupingSgfs[i];
        var sgfType = null;
        if (sgf.sgfType) {
          sgfType = sgf.sgfType;
        } else if (grouping.sgfType) {
          sgfType = grouping.sgfType;
        }
        if (!sgfType) {
          throw new Error('No SGF type specified for SGF:' + JSON.stringify(sgf));
        }

        if (!currentType) {
          currentType = sgfType;
        }

        if (currentType === sgfType) {
          sameTypeSgfs.push(sgf);
        } else {
          gpub.spec.processSgfBuffer_(sgfMapping, grouping, sameTypeSgfs);
          sameTypeSgfs = [];
        }
      }
      if (sameTypeSgfs.length) {
        gpub.spec.processSgfBuffer_(sgfMapping, grouping, sameTypeSgfs);
        sameTypeSgfs = [];
      }
    }

    // Process the children.
    for (var i = 0; i < grouping.subGroupings.length; i++) {
      gpub.spec.processGrouping_(sgfMapping, grouping.subGroupings[i]);
    }
  },

  /**
   * Processes an array of sgfs all of the same type.
   * @param {!Object<string, string>} sgfMapping,
   * @param {!gpub.spec.Grouping} grouping
   * @param {!Array<!gpub.spec.Sgf>} sgfs
   * @private
   */
  processSgfBuffer_: function(sgfMapping, grouping, sgfs) {
    var newGrouping = new gpub.spec.Grouping();
    for (var i = 0; i < sgfs.length; i++) {
      var sgf = sgfs[i];
      // TODO(kashomon): Finish this.
    }
  }
};
