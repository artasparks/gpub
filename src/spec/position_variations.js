goog.provide('gpub.spec.PositionVariations');

/**
 * A gpub Position Varations processor. This produces an output very similar to
 * the game commentary.
 *
 * @implements {gpub.spec.Processor}
 *
 * @constructor @struct @final
 */
gpub.spec.PositionVariations = function() {};

gpub.spec.PositionVariations.prototype = {
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
