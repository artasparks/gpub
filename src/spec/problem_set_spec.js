/**
 * Generates a problem set spec.
 */
gpub.spec.problemSetSpec = function(mt, alias, options) {
  region = options.region || glift.enums.boardRegions.ALL;
  return {
    alias: alias,
    widgetType: 'STANDARD_PROBLEM',
    boardRegion: region
  }
};
