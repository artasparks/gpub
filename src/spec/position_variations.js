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
   * @return {!gpub.spec.Grouping}
   */
  process: function(mt, sgf, idGen) {
    return new gpub.spec.Grouping();
  }
};
