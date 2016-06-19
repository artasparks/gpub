goog.provide('gpub.spec.PositionVariations');

/**
 * A gpub Position Varations processor. This produces an output very similar to
 * the game commentary.
 *
 * @implements {gpub.spec.TypeProcessor}
 *
 * @constructor @struct @final
 */
gpub.spec.PositionVariations = function() {};

gpub.spec.PositionVariations.prototype = {
  /**
   * @param {!glift.rules.MoveTree} mt
   * @param {!gpub.spec.Sgf} sgf
   * @param {!gpub.spec.IdGen} idGen
   * @return {!gpub.spec.GroupingOrSgf} a procesed grouping for the sgf.
   */
  process: function(mt, sgf, idGen) {
    return {};
  }
};
