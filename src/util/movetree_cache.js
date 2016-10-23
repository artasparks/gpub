goog.provide('gpub.util.MoveTreeCache');

/**
 * Movetree cache
 * @param {(!Object<string, string>)=} opt_sgfMapping
 * @param {(!Object<string, glift.rules.MoveTree>)=} opt_mtCache
 * @constructor @struct @final
 */
gpub.util.MoveTreeCache = function(opt_sgfMapping, opt_mtCache) {
  /**
   * Reference to the SGF mapping, for convenience.
   *
   * We assume SGFs are immutable once passed in, as is the SGF Mapping. Thus
   * we don't copy the map here.
   * @type {!Object<string, string>}
   */
  this.sgfMap = opt_sgfMapping || {};

  /**
   * @type {!Object<string, !glift.rules.MoveTree>} mapping from alias to
   *    movetree.
   */
  this.mtCache = opt_mtCache || {};
};

gpub.util.MoveTreeCache.prototype = {
  /**
   * Get a movetree. If a movetree can't be found, throw an exception -- that
   * means an alias hasn't been provided.
   * @param {string} alias
   * @return {!glift.rules.MoveTree}
   */
  get: function(alias) {
    var mt = this.mtCache[alias];
    if (mt) {
      return mt;
    }
    if (this.sgfMap[alias]) {
      var str = this.sgfMap[alias];
      mt = glift.parse.fromString(str);
      this.mtCache[alias] = mt;
    } else {
      throw new Error('No SGF found for alias in sgfMap: ' + alias);
    }
    return mt.getTreeFromRoot();
  }
};
