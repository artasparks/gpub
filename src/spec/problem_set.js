/**
 * Generates a problem set spec.
 */
gpub.spec.problemSet = {
  /**
   * Process one movetree.
   */
  one: function(mt, alias, options) {
    region = options.region || glift.enums.boardRegions.AUTO;
    return {
      alias: alias,
      widgetType: 'STANDARD_PROBLEM',
      boardRegion: region
    }
  }
};
