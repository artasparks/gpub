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
   * @param {string} alias
   * @param {glift.enums.boardRegions} boardRegion
   * @return {!gpub.spec.Grouping}
   */
  process: function(mt, alias, boardRegion) {
    return new gpub.spec.Grouping();
  }
};
