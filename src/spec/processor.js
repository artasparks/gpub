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
    idx++;
    return prefix + '-' + idx;
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
   * Process the spec! Returns an
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
   * Recursive group processor. This assumes that the grouping passed in is a
   * member of the passed in GPub Spec.
   *
   * @param {!gpub.spec.Grouping} grouping
   */
  processGroup: function(grouping) {
    this.reprocessPositions_(grouping);
    for (var i = 0; i < grouping.groupings.length; i++) {
      this.processGroup(grouping.groupings[i]);
    }
  },

  /**
   * Reprocess the Positions in a grouping by ordering them into similar types and
   * then processing them with the type-specific processors. If the Grouping
   * contains only examples, the grouping is considered to be already processed
   * and this function returns without doing any work.
   *
   * If the grouping has Positions that need to be processed, we process all the
   * Positions. Another way to say this: If we create groupings, we must create
   * groupings for all the Positions. This ensures that the ordering remains
   * consistent.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @private
   */
  reprocessPositions_: function(grouping) {
    var positions = grouping.positions;

    /**
     * @type {!Array<!gpub.spec.Position>}
     */
    var sameTypePositions = [];

    /**
     * Groups of Positions. The Positions in the inner array are guaranteed to
     * be all of the same type.
     * @type {!Array<!Array<!gpub.spec.Position>>}
     */
    var positionGroups = []

    var currentType = null;
    for (var i = 0; i < positions.length; i++) {
      var position = positions[i];
      var positionType = this.getPositionType_(grouping, position);
      if (currentType == null) {
        currentType = positionType;
      }
      if (positionType === currentType) {
        sameTypePositions.push(position);
      } else {
        positionGroups.push(sameTypePositions);
        sameTypePositions = [];
      }
    }
    if (sameTypePositions.length) {
      positionGroups.push(sameTypePositions);
    }

    // Clear out the positions and replace
    grouping.positions = [];
    var containsAllEx = this.containsAllExamples_(grouping);

    if (positionGroups.length === 1
        && containsAllEx
        && positionGroups[0].length) {
      var posType = this.getPositionType_(grouping, positionGroups[0][0]);
      var ret = this.processPositionGroup_(posType, grouping, positionGroups[0]);
      // grouping.positions = ret;
    } else {
      for (var i = 0; i < positionGroups.length; i++) {
        if (positionGroups[i].length) {
          posType = this.getPositionType_(grouping, positionGroups[i][0]);
          var ret = this.processPositionGroup_(posType, grouping, positionGroups[i]);
        }
      }
    }
  },

  /**
   * Whether or not a grouping contains only examples.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @return {boolean}
   * @private
   */
  containsAllExamples_: function(grouping) {
    var containsAllExamples = true;
    for (var i = 0; i < grouping.positions.length; i++) {
      var position = grouping.positions[i];
      if (position.positionType !== gpub.spec.PositionType.EXAMPLE) {
        containsAllExamples = false;
        break;
      }
    }
    return containsAllExamples;
  },

  /**
   * Process a grouping of positions. Where the magic happens.
   *
   * @param {!gpub.spec.PositionType} posType The position type for this
   *    set of positions. Note: it's possible the position type is not specified
   *    directly on the position. Instead, it could be a default on the parent
   *    grouping. However, that detail is opaque to this method.
   * @param {!gpub.spec.Grouping} grouping The parent grouping.
   * @param {!Array<!gpub.spec.Position>} positions The positions that need
   *    processing.
   *
   * @return {!Array<!gpub.spec.Position>} Return either an array of generated
   *    positions.
   *
   * @private
   */
  processPositionGroup_: function(posType, grouping, positions) {
    if (!positions.length) {
      return []; // No positions. nothing to do.
    }
    positions.forEach(function(pos) {
      var mt = this.getMovetree_(pos);
      var idGen = this.getIdGen_(pos);
      switch(posType) {
        case 'GAME_COMMENTARY':
          var newGrouping =
              gpub.spec.processGameCommentary(mt, pos, idGen);
          break;
        case 'PROBLEM':
          var problemGrouping = gpub.spec.processProblems(
              mt, pos, idGen, this.originalSpec_.specOptions);
          break;

        case 'EXAMPLE':
          break;

        // case 'POSITION_VARIATIONS':
          // Fall through, for now.
        default: throw new Error('Unknown position type:' + JSON.stringify(posType));
      }
    }.bind(this));
    return [];
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

