gpub.spec  = {
  /**
   * Types of specs to generate
   */
  specType: {
    /** Standard problem SGF Collection. */
    PROBLEM_SET: 'PROBLEM_SET',

    /**
     * Problems that have been converted into a book format. In other words,
     * we've flattened all the problems into EXAMPLEs.
     */
    PROBLEM_BOOK: 'PROBLEM_BOOK',

    /** Game that's been flattened into examples. */
    GAME_BOOK: 'GAME_BOOK'
  },

  /** The type of information the problem is intending to display */
  exampleType: {
    PROBLEM: 'PROBLEM',
    ANSWER: 'ANSWER',
    GAME_REVIEW: 'GAME_REVIEW'
  },

  /**
   * Creates a Glift collection from sgfs.
   *
   * sgfs: Array of SGFs.
   * stype: The spec type to generate
   * options: Has the following structure:
   *    {
   *      boardRegion: <boardRegion> -- The board region to display
   *      bufferSize: Usually 1. For problems, sometimes more.
   *    }
   *
   * returns: A full glift options specification.
   */
  fromSgfs: function(sgfs, specTypeIn, options) {
    var specType = gpub.spec.specType;
    var opts = options || {};
    var stype = specTypeIn || specType.GAME_BOOK;
    var spec = {
      // Since this is for a book definition, we don't need a divId. Clients
      // can add in a relevant ID later.
      divId: null,
      sgfCollection: [],
      // We must rely on SGF aliases to generate the collection to ensure the
      // collection is self contained.
      sgfMapping: {},
      sgfDefaults: {},
      metadata: {
        specType: stype
      }
    };

    var maxBufferSize = 1;

    var processingFn = null;
    switch(stype) {
      case 'GAME_BOOK':
        spec.sgfDefaults.widgetType = 'EXAMPLE';
        maxBufferSize = 1;
        processingFn = function(buf, optz) {
          return gpub.spec.gameBook.one(buf[0].movetree, buf[0].name, optz);
        };
        break;

      case 'PROBLEM_SET':
        spec.sgfDefaults.widgetType = 'STANDARD_PROBLEM';
        maxBufferSize = 1;
        processingFn = function(buf, optz) {
          return gpub.spec.problemSet.one(buf[0].movetree, buf[0].name, optz);
        };
        break;

      case 'PROBLEM_BOOK':
        spec.sgfDefaults.widgetType = 'EXAMPLE';
        processingFn = gpub.spec.problemBook.multi;
        var answerStyle = gpub.spec.problemBook.answerStyle;
        opts.answerStyle = opts.answerStyle || answerStyle.END_OF_SECTION;
        if (opts.answerStyle === answerStyle.END_OF_SECTION) {
          maxBufferSize = sgfs.length;
        } else if (opts.answerStyle === answerStyle.AFTER_PAGE) {
          maxBufferSize = opts.bufferSize || 4;
        } else {
          maxBufferSize = 1;
        }
        break;

      default:
        throw new Error('Unknown spec type: ' + stype);
    }

    var buffer = new gpub.util.Buffer(maxBufferSize);
    for (var i = 0; sgfs && i < sgfs.length; i++) {
      var sgf = sgfs[i];
      var mt = glift.parse.fromString(sgf);
      var sgfName = mt.properties().getOneValue('GN') || 'sgf:' + i;
      buffer.add({ movetree: mt, name: sgfName });
      if (buffer.atCapacity() || i === sgfs.length - 1) {
        spec.sgfCollection = spec.sgfCollection.concat(
            processingFn(buffer.flush(), opts));
      }
      spec.sgfMapping[sgfName] = sgf;
    }

    return spec;
  },

  /**
   * Convert a movetree and a couple of options to an entry in the SGF
   * collection.
   * alias: Required. The cache alias.
   * initPos: Required. The init position
   * nextMoves: Required. Next moves path
   * region: not required. Defaults to ALL, but must be part of
   *    glift.enums.boardRegions.
   * exampleType: What the diagram is intended for.
   *    From gpub.spec.examplePurpose;
   */
  createExample: function(
      alias, initPos, nextMoves, region, exampleType) {
    region = region || glift.enums.boardRegions.ALL;
    if (!glift.enums.boardRegions[region]) {
      throw new Error('Unknown board region: ' + region);
    }
    var exType = gpub.spec.exampleType;
    var ipString = glift.rules.treepath.toInitPathString;
    var fragString = glift.rules.treepath.toFragmentString;
    var base = {
      widgetType: 'EXAMPLE',
      alias: alias,
      initialPosition: ipString(initPos),
      nextMovesPath: fragString(nextMoves),
      boardRegion: region
    };
    if (exampleType && exType[exampleType]) {
      base.metadata = {
        exampleType: exampleType
      }
    }
    return base;
  }
};
