goog.provide('gpub.spec.Problem');

/**
 * Generates a problem set spec. Implements gpub.spec.processor.
 *
 * @implements {gpub.spec.Processor}
 *
 * @constructor @struct @final
 */
gpub.spec.Problem = function () {};


gpub.spec.Problem.prototype = {
  /**
   * @param {!glift.rules.MoveTree} mt
   * @param {string} alias
   * @param {glift.enums.boardRegions} boardRegion
   * @return {!gpub.spec.Grouping}
   */
  process: function(mt, alias, boardRegion) {
    return new gpub.spec.Grouping();
  }
};
