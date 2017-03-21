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
    var sgfs = options.sgfs;
    var cache = opt_cache || new gpub.util.MoveTreeCache(); // for testing convenience.
    var specOptions = options.specOptions;
    var defaultPositionType = specOptions.positionType;

    var spec = new gpub.spec.Spec({
      specOptions: options.specOptions,
      diagramOptions: options.diagramOptions,
      templateOptions: options.templateOptions,
    });

    var rootGrouping = spec.rootGrouping;
    rootGrouping.positionType = defaultPositionType;
    var optIds = options.ids;

    for (var i = 0; i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      if (!sgfStr) {
        throw new Error('No SGF String defined for index: ' + i);
      }
      var mt = glift.parse.fromString(sgfStr);

      var alias = 'sgf-' + (i+1);
      if (optIds) {
        alias = optIds[i];
      }

      cache.sgfMap[alias] = sgfStr;
      cache.mtCache[alias] = mt;

      // Ensure the sgf mapping contains the alias-to-sgf mapping.
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }

      // At this point, there is a 1x1 mapping between passed-in SGF string and
      // position. That need not be true generally, but it is true here.
      var position = new gpub.spec.Position({
        alias: alias,
        id: alias
      })

      rootGrouping.positions.push(position);
    }
    return spec;
  },

  /**
   * Process a spec by transforming the positions positions. All  SGFS are
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
