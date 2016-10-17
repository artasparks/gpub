goog.provide('gpub.util.MoveTreeCache');

/**
 * Movetree cache
 * @param {(!Object<string, string>)=} opt_sgfMapping
 * @param {(!Object<string, glift.rules.MoveTree>)=} opt_mtCache
 * @constructor @struct @final
 */
gpub.util.MoveTreeCache = function(opt_sgfMapping, opt_mtCache) {
  /** @type {!Object<string, string>} */
  this.sgfMap = {};
  if (opt_sgfMapping) {
    for (var key in opt_sgfMapping) {
      this.sgfMap[key] = opt_sgfMapping[key];
    }
  }

  /**
   * @type {!Object<string, !glift.rules.MoveTree>} mapping from alias to
   *    movetree.
   */
  this.mtCache = opt_mtCache || {};

  /**
   * Get a movetree. If a movetree can't be found, throw an exception -- that
   * means an alias hasn't been provided.
   * @param {string} alias
   * @return {!glift.rules.MoveTree}
   */
  this.get = function(alias) {
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
  };
};

