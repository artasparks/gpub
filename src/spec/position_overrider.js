goog.provide('gpub.spec.PositionOverrider');

/**
 * @param {!Array<!gpub.opts.PositionOverrides>} overrides
 * @constructor @struct @final
 */
gpub.spec.PositionOverrider = function(overrides) {
  this.overrides = overrides || [];

  /**
   * @const {!Object<string, !gpub.opts.PositionOverrides>}
   */
  this.lookup = {};
  for (var i = 0; i < this.overrides.length; i++) {
    var o = this.overrides[i];
    var key = this.getKey({
      gameId: o.gameId,
      moveNumber: o.moveNumber,
      initialPosition: o.initialPosition,
      nextMovesPath: o.nextMovesPath,
    });
    if (o.showPreviousMoves && o.showPreviousMoves <= 0) {
      throw new Error('PositionOverrides param showPreviousMoves must be >= 0. '
          + 'Was:' + o.showPreviousMoves);
    }
    // Sanity check: make sure it's a number. This as actually surprisingly
    // expensive so we should be careful only to do this if we're sure there's
    // a problem.
    if (typeof o.showPreviousMoves !== 'number') {
      o.showPreviousMoves = parseInt(o.showPreviousMoves, 10);
      if (isNaN(o.showPreviousMoves)) {
        throw new Error('overrides.showPreviousMoves was parsed to NaN for'
            + ' override: ' + JSON.stringify(o));
      }
    }
    this.lookup[key] = o;
  }
};

/**
 * @typedef{{
 *  gameId: string,
 *  moveNumber: (number|undefined),
 *  initialPosition: (string|undefined),
 *  nextMovesPath: (string|undefined),
 * }}
 */
gpub.spec.PositionKeyOpts;

gpub.spec.PositionOverrider.prototype = {
  /**
   * @param {!gpub.spec.PositionKeyOpts} opts
   * @return {string} the key for doing lookup
   */
  getKey: function(opts) {
    var gameId = opts.gameId
    if (!gameId) {
      throw new Error('Game ID must be defined for each overrides; was'
          + gameId);
    }
    var moveNumber = opts.moveNumber;
    var initialPosition = opts.initialPosition;
    var nextMovesPath = opts.nextMovesPath;
    if (moveNumber === undefined &&
        (initialPosition === undefined || nextMovesPath === undefined)) {
      throw new Error('One of moveNumber or initialPosition + nextMovesPath must ' +
          'be defined. The were, respectively, '
          + moveNumber + ',' + initialPosition + ',' + nextMovesPath);
    }
    var key = gameId;
    if (moveNumber !== undefined) {
      key += '#' + moveNumber
    } else {
      key += '#' + initialPosition + '#' + nextMovesPath;
    }
    return key;
  },

  /**
   * Get overrides for a key-opts. If both moveNumber and
   * initialPosition+nextMovesPath is specified, try both and return the first
   * thing that pops up, preferring moveNumber
   *
   * @param {!gpub.spec.PositionKeyOpts} opts
   * @return {?gpub.opts.PositionOverrides} the position overrides or null
   */
  getOverride: function(opts) {
    if (opts.moveNumber !== undefined) {
      // first try with move number
      var key = this.getKey({
        gameId: opts.gameId,
        moveNumber: opts.moveNumber,
      })
      var override = this.lookup[key];
      if (override) { return override; }
    }
    if (opts.initialPosition && opts.nextMovesPath) {
      var key = this.getKey({
        gameId: opts.gameId,
        initialPosition: opts.initialPosition,
        nextMovesPath: opts.nextMovesPath,
      })
      var override = this.lookup[key];
      if (override) { return override; }
    }
    return null;
  },

  /**
   * @param {!gpub.spec.PositionKeyOpts} opts
   * @param {!glift.rules.Treepath} initPos
   * @param {!glift.rules.Treepath} nextMoves
   *
   * @return {{
   *  initialPosition: (?glift.rules.Treepath),
   *  nextMovesPath: (?glift.rules.Treepath),
   * }}
   */
  applyOverridesIfNecessary: function(opts, initPos, nextMoves) {
    var out = {
      initialPosition: null,
      nextMovesPath: null,
    }
    var o = this.getOverride(opts);
    if (!o) {
      return out;
    }

    // We found something! Let's apply the overrides.
    var ip = initPos.slice();
    var nm = nextMoves.slice();
    if (o.showPreviousMoves && nm.length > o.showPreviousMoves) {
      while (nm.length > o.showPreviousMoves) {
        var v = nm.pop();
        ip.push(v);
      }
      out.initialPosition = ip;
      out.nextMovesPath = nm;
    }
    return out;
  }
}

