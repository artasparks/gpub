goog.provide('gpub.spec.IdGen');
goog.provide('gpub.spec.Processor');
goog.provide('gpub.spec.TypeProcessor');

/**
 * Simple id generator. As currently designed, this only works for one game
 * alias.
 *
 * @constructor @struct @final
 * @package
 */
gpub.spec.IdGen = function(prefix) {
  var idx = 0;

  /** @return {string} */
  this.next = function() {
    var nextId = prefix + '-' + idx;
    idx++;
    return nextId;
  }
};

/**
 * The process takes a basic spec and transforms it into example-diagram
 * specifications.
 *
 * @param {!gpub.spec.Spec} spec
 * @constructor @struct @final
 */
gpub.spec.Processor = function(spec) {
  /** @private @const {!gpub.spec.Spec} */
  this.originalSpec_ = spec;

  /**
   * Mapping from alias to movetree.
   * @const {!Object<string, !glift.rules.MoveTree>}
   * @private
   */
  this.mtCache_ = {};

  /**
   * Map from alias to ID Gen instance. Each alias gets its own id generator so that IDs
   * are sequential for a particular raw SGF.
   *
   * @const {!Object<string, !gpub.spec.IdGen>}
   */
  this.idGenMap_ = {};

  /**
   * Mapping from sgf alias to SGF string.
   * @const {!Object<string, string>}
   * @private
   */
  this.sgfMapping_ = spec.sgfMapping;

  /**
   * A top-level grouping, and ensuring the grouping is complete copy.
   * @const {!gpub.spec.Grouping}
   * @private
   */
  this.rootGrouping_ = new gpub.spec.Grouping(spec.rootGrouping);
};

gpub.spec.Processor.prototype = {
  /**
   * Process the spec!
   *
   * @return {!gpub.spec.Spec}
   */
  process: function() {
    this.processGroup(this.rootGrouping_);
    return new gpub.spec.Spec({
      rootGrouping: this.rootGrouping_,
      sgfMapping: this.sgfMapping_,
      specOptions: this.originalSpec_.specOptions,
      diagramOptions: this.originalSpec_.diagramOptions,
      bookOptions: this.originalSpec_.bookOptions,
    });
  },

  /**
   * Recursive group processor, which traverses the groups and processes all
   * the positions, generating positions along the way.
   *
   * @param {!gpub.spec.Grouping} g
   */
  processGroup: function(g) {
    this.processPositions_(g);
    for (var i = 0; i < g.groupings.length; i++) {
      this.processGroup(g.groupings[i]);
    }
  },

  /**
   * Process the Positions by, if necessary, generating new positions. This
   * creates generated objects for each of the original positions.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @private
   */
  // TODO(kashomon): Currently this requires ids to be defined and unique.
  processPositions_: function(grouping) {
    var pos = grouping.positions;
    var uniqueMap = {};
    for (var i = 0; i < pos.length; i++) {
      var p = pos[i];
      var id = p.id;
      if (uniqueMap[id]) {
        throw new Error('IDs are required to be unique, but the following ID was duplicated: ' + id);
      }
      uniqueMap[id] = true;
      if (!id) {
        throw new Error('Each position must have an ID. Id was: ' + id);
      }
      var pType = this.getPositionType_(grouping, p);
      var gen = this.generatePositions_(pType, p);
      if (gen) {
        grouping.generated[id] = gen;
      }
    }
  },

  /**
   * Process a grouping of positions. Where the magic happens.
   *
   * @param {!gpub.spec.PositionType} posType The position type for this
   *    set of positions, which indicates how the position should be processed.
   *    This needs to be passed in since it can be specified by the parent
   *    grouping (is this good behavior?).
   * @param {!gpub.spec.Position} pos The position that needs processing.
   * @return {?gpub.spec.Generated} Returns a generated position wrapper or
   *    null if no positions were generated.
   *
   * @private
   */
  generatePositions_: function(posType, pos) {
    var mt = this.getMovetree_(pos);
    // Create a new ID gen instance for creating IDs.
    var idGen = this.getIdGen_(pos);
    switch(posType) {
      case 'GAME_COMMENTARY':
        return gpub.spec.processGameCommentary(mt, pos, idGen);
        break;
      case 'PROBLEM':
        return gpub.spec.processProblems(
            mt, pos, idGen, this.originalSpec_.specOptions);
        break;

      case 'EXAMPLE':
        return null;
        break;

      // case 'POSITION_VARIATIONS':
        // Fall through, for now.
      default: throw new Error('Unknown position type:' + JSON.stringify(posType));
    }
  },

  /**
   * Gets a movetree for an position
   *
   * @param {!gpub.spec.Position} position
   * @return {!glift.rules.MoveTree}
   * @private
   */
  getMovetree_: function(position) {
    var alias = position.alias;
    if (!alias) {
      throw new Error('No SGF alias defined for position object: '
          + JSON.stringify(position));
    }
    var sgfStr = this.sgfMapping_[alias];
    if (!sgfStr) {
      throw new Error('No SGF defined in the SGF Mapping for alias: ' + alias);
    }
    if (!this.mtCache_[alias]) {
      this.mtCache_[alias] = glift.rules.movetree.getFromSgf(sgfStr);
    }
    return this.mtCache_[alias];
  },

  /**
   * Gets a Position Type for a position/grouping/options.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @param {!gpub.spec.Position} position
   * @return {!gpub.spec.PositionType}
   * @private
   */
  getPositionType_: function(grouping, position) {
    var positionType = null;
    if (position.positionType) {
      positionType = position.positionType;
    } else if (grouping.positionType) {
      positionType = grouping.positionType;
    } else if (this.originalSpec_.specOptions.defaultPositionType) {
      positionType = this.originalSpec_.specOptions.defaultPositionType;
    }
    if (!positionType) {
      throw new Error('No position type specified for position:'
          + JSON.stringify(position));
    }
    return positionType;
  },

  /**
   * Gets the id generator for a position object
   * @param {!gpub.spec.Position} pos
   * @return {!gpub.spec.IdGen}
   */
  getIdGen_: function(pos) {
   var alias = pos.alias;
    if (!alias) {
      throw new Error('No alias defined for Position object: ' + JSON.stringify(pos));
    }
    if (!this.idGenMap_[alias]) {
      this.idGenMap_[alias] = new gpub.spec.IdGen(alias);
    }
    return this.idGenMap_[alias];
  }
};

