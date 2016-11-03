goog.provide('gpub.spec.IdGen');
goog.provide('gpub.spec.IdGenType');

/**
 * @enum {string}
 */
gpub.spec.IdGenType = {
  /**
   * Keep a counter for the relevant SGF and append that to the alias.
   */
  SEQUENTIAL: 'SEQUENTIAL',

  /**
   * Convert the initial path and next moves into an ID. The ID is meant to be
   * safe for file names, so the path syntax is converted as follows:
   * 0:5->1-5
   * 1.0->1_0
   * 5+->5p
   */
  PATH: 'PATH',
};

/**
 * Simple id generator. As currently designed, this only works for one game
 * alias.
 *
 * @param {gpub.spec.IdGenType} idType
 *
 * @constructor @struct @final
 * @package
 */
gpub.spec.IdGen = function(idType) {
  /**
   * @private @const {gpub.spec.IdGenType}
   */
  this.idType_ = idType;

  /**
   * Set verifying uniqueness of IDs.
   * @private @const {!Object<string, boolean>}
   */
  this.idSet_ = {};

  /**
   * Map from alias to counter. Each alias gets its own ID counter so that IDs
   * are sequential for a particular raw SGF. This applies only to the
   * SEQUENTIAL IdGenType.
   *
   * @private @const {!Object<string, number>}
   */
  this.counterMap_ = {};
};

gpub.spec.IdGen.prototype = {
  /**
   * Gets a new Position ID for a generateda position.
   *
   * @param {string} alias
   * @param {string} initPath
   * @param {string} nextMovesPath
   * @return {string} A new ID, with a
   */
  next: function(alias, initPath, nextMovesPath) {
    var id = '';
    if (this.idType_ == gpub.spec.IdGenType.PATH) {
      id = this.getPathId_(alias, initPath, nextMovesPath);
    } else {
      // Default to sequental
      id = this.getSequentialId_(alias);
    }
    if (this.idSet_[id]) {
      throw new Error('Duplicate ID Detected: ' + id);
    }
    this.idSet_[id] = true;
    return id;
  },

  /**
   * Gets a path-ID with the following format:
   *
   * alias__initialpath__nextmoves
   *
   * Where the path string has been transformed as follows:
   * 0:5->1-5
   * 1.0->1_0
   * 5+->5p
   *
   * @param {string} alias
   * @param {string} initPath
   * @param {string} nextMovesPath
   */
  getPathId_: function(alias, initPath, nextMovesPath) {
    var repl = function(p) {
      return p.replace(/:/g, '-')
        .replace(/\./g, '_')
        .replace(/\+/g, 'p');
    };
    var id = alias + '__' + repl(initPath);
    if (nextMovesPath) {
      id += '__' + repl(nextMovesPath);
    }
    return id;
  },

  /**
   * Gets a sequential ID.
   * @param {string} alias
   * @return {string} new ID
   * @private
   */
  getSequentialId_: function(alias) {
    if (!this.counterMap_[alias]) {
      this.counterMap_[alias] = 0;
    }
    var counter = this.counterMap_[alias];
    this.counterMap_[alias]++;
    return alias + '-' + counter;
  },
};
