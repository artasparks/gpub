goog.provide('gpub.spec.Example');

/**
 * A gpub Example. This is generally just a passthrough
 *
 * @implements {gpub.spec.TypeProcessor}
 *
 * @constructor @struct @final
 */
gpub.spec.Example = function() {};

gpub.spec.Example.prototype = {
  /**
   * @param {!glift.rules.MoveTree} mt
   * @param {!gpub.spec.Sgf} sgf
   * @param {!gpub.spec.IdGen} idGen
   * @return {!gpub.spec.GroupingOrSgf} a procesed grouping for the sgf.
   */
  process: function(mt, sgf, idGen) {
  }
};
