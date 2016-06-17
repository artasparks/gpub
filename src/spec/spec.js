goog.provide('gpub.spec')

/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
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
    var specOptions = options.specOptions;
    var defaultSgfType = specOptions.defaultSgfType;

    var spec = new gpub.spec.Spec({
      specOptions: options.specOptions,
      diagramOptions: options.diagramOptions,
      bookOptions: options.bookOptions
    });

    // TODO(kashomon): Modify the topLevelGrouping based on the book data, the
    // GC node, or headers within the SGF.
    var baseGrouping = spec.grouping;
    baseGrouping.sgfType = defaultSgfType;

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
   * @return {!gpub.spec.Spec} the transformed spec.
   */
  process: function(spec) {
    return new gpub.spec.Processor(spec).process();
  },
};
