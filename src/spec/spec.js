goog.provide('gpub.spec')

/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * Creates a basic high-level GPub Specification from the passed-in sgfs. This
   * first pass does a brain-dead transformation based on the position defaults. It
   * does not process the spec into a flattened EXAMPLE spec.
   *
   * Importantly, this creates a serializeable book object that can be store for
   * later processing.
   *
   * @param {!gpub.Options} options
   * @return {!gpub.spec.Spec}
   */
  create: function(options) {
    var sgfs = options.sgfs;
    var specOptions = options.specOptions;
    var defaultPositionType = specOptions.defaultPositionType;

    var spec = new gpub.spec.Spec({
      specOptions: options.specOptions,
      diagramOptions: options.diagramOptions,
      bookOptions: options.bookOptions
    });

    var baseGrouping = spec.rootGrouping;
    baseGrouping.positionType = defaultPositionType;

    for (var i = 0; i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      var mt = glift.parse.fromString(sgfStr);
      var alias = 'sgf:' + (i+1);

      // If the Game Name is specified, we prepend that to the index for
      // readability.
      var GN = glift.rules.prop.GN;
      if (mt.properties().contains(GN)) {
        alias = mt.properties().getOneValue(GN) + ':' + (i+1);
      }

      // Ensure the sgf mapping contains the alias-to-sgf mapping.
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }

      // At this point, there is a 1x1 mapping between passed-in SGF string and
      // position. Initial position, nextMovesPath, and id don't make sense
      // until the processing into EXAMPLE types.
      var position = new gpub.spec.Position({
        alias: alias,
        id: alias
      })

      baseGrouping.positions.push(position);
    }
    return spec;
  },

  /**
   * Process a spec by transforming the positions positions. All  SGFS are
   * grouped by type into new Grouping objects, if the types are not uniform,
   * and prepended to the sub-groupings list.
   *
   * @param {!gpub.spec.Spec} spec
   * @return {!gpub.spec.Spec} the transformed spec.
   */
  process: function(spec) {
    return new gpub.spec.Processor(spec).process();
  },
};
