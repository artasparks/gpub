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
   * @type {!Object<string, !glift.rules.MoveTree>} mapping from gameId to
   *    movetree.
   */
  this.mtCache = opt_mtCache || {};
};

gpub.util.MoveTreeCache.prototype = {
  /**
   * Get a movetree. If a movetree can't be found, throw an exception -- that
   * means a gameId hasn't been provided.
   * @param {string} gameId
   * @return {!glift.rules.MoveTree}
   */
  get: function(gameId) {
    var mt = this.mtCache[gameId];
    if (mt) {
      return mt.getTreeFromRoot();
    }
    if (this.sgfMap[gameId]) {
      var str = this.sgfMap[gameId];
      mt = glift.parse.fromString(str);
      this.mtCache[gameId] = mt;
    } else {
      throw new Error('No SGF found for game id in sgfMap: ' + gameId);
    }
    return mt.getTreeFromRoot();
  },

  /**
   * Replace a movetree / SGF.
   * @param {string} gameId
   * @param {!glift.rules.MoveTree} movetree
   */
  set: function(gameId, movetree) {
    if (!gameId) {
      throw new Error('Game ID must be defined.');
    }
    this.mtCache[gameId] = movetree
    this.sgfMap[gameId] = movetree.toSgf();
  },
};
