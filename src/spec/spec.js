goog.provide('gpub.spec')

/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * Takes a list of SGFs and produces a Gpub spec. This first pass does a
   * brain-dead transformation based on the position defaults.
   *
   * Importantly, this creates a serializeable book object that can be store for
   * later processing.
   *
   * @param {!gpub.Options} options
   * @param {!gpub.util.MoveTreeCache=} opt_cache
   * @return {!gpub.spec.Spec} Finished spec.
   */
  create: function(options, opt_cache) {
    var cache = opt_cache || new gpub.util.MoveTreeCache(); // for testing convenience.
    var specOptions = options.specOptions;
    var defaultPositionType = specOptions.positionType;

    var rootGrouping = new gpub.spec.Grouping(
      /** @type {!gpub.spec.GroupingDef} */ ({
        positionType: defaultPositionType
      }));

    var specDef = /** @type {!gpub.spec.SpecDef} */ ({
      gameMapping: {},
      specOptions: options.specOptions,
      diagramOptions: options.diagramOptions,
      templateOptions: options.templateOptions,
      rootGrouping: rootGrouping,
    });

    var games = options.games;
    for (var gameId in games) {
      var rawGameStr = games[gameId];
      if (!rawGameStr) {
        throw new Error('No game (SGF) string string defined for key: ' +
            gameId);
      }
      var mt = glift.parse.fromString(rawGameStr);
      cache.gameMap[gameId] = rawGameStr;
      cache.mtCache[gameId] = mt;
      if (!specDef.gameMapping[gameId]) {
        specDef.gameMapping[gameId] = rawGameStr;
      }
    }

    var grouping = options.grouping;
    if (glift.util.typeOf(grouping) === 'array') {
      var grp = /** @type {!Array<string>} */ (grouping);
      for (var i = 0; i < grp.length; i++) {
        var gameId = grp[i];
        if (!options.games[gameId]) {
          throw new Error('No corresponding Game defined in options.games' +
              'for id ' + gameId);
        }

        // At this point, there is a 1x1 mapping between passed-in SGF string and
        // position. That need not be true generally, but it is true here.
        var position = new gpub.spec.Position({
          gameId: gameId,
          id: gameId,
        })
        rootGrouping.positions.push(position);
      }
    } else if (glift.util.typeOf(grouping) == 'object') {
      var grp = /** @type {!gpub.opts.RawGrouping} */ (grouping);
      var idGen = new gpub.spec.IdGen(gpub.spec.IdGenType.SEQUENTIAL);
      var gp = gpub.spec.preprocessGrouping(grp, idGen);
      if (!options.grouping.positionType) {
        gp.positionType = rootGrouping.positionType;
      }
      specDef.rootGrouping = gp;
    } else {
      throw new Error('options.grouping must be defined as either an array of' +
          'strings or a groupings object. Was: '+ JSON.stringify(grouping));
    }
    return new gpub.spec.Spec(specDef);
  },

  /**
   * Process a spec by transforming the positions positions. All games are
   * grouped by type into new Grouping objects, if the types are not uniform,
   * and prepended to the sub-groupings list.
   *
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @return {!gpub.spec.Spec} the transformed spec.
   */
  process: function(spec, cache) {
    return new gpub.spec.Processor(spec, cache).process();
  },
};
