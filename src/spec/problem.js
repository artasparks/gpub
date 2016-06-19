goog.provide('gpub.spec.Problem');

/**
 * Generates a problem set spec. Implements gpub.spec.processor.
 *
 * @implements {gpub.spec.TypeProcessor}
 *
 * @constructor @struct @final
 */
gpub.spec.Problem = function () {};


gpub.spec.Problem.prototype = {
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
