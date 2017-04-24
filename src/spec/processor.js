goog.provide('gpub.spec.Processor');
goog.provide('gpub.spec.TypeProcessor');
goog.provide('gpub.spec.Processed');

/**
 * Params:
 *  movetree: The processed movetree from the type-processor. If non-null,
 *      implies that the movetree result needs to be stored.
 *  generated: The generated positions.
 *
 * @typedef {{
 *  movetree: ?glift.rules.MoveTree,
 *  generated: !gpub.spec.Generated
 * }}
 */
gpub.spec.Processed;

/**
 * Generic type-processor
 * @param {!glift.rules.MoveTree} mt The movetree for the position.
 * @param {!gpub.spec.Position} position The position used for spec generation.
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.opts.SpecOptions} opt
 * @return {!gpub.spec.Processed} processed positions.
 *
 * @interface
 */
gpub.spec.TypeProcessor = function(mt, position, idGen, opt) {};

/**
 * The process takes a basic spec and transforms it into example-diagram
 * specifications.
 *
 * @param {!gpub.spec.Spec} spec
 * @param {!gpub.util.MoveTreeCache} cache
 * @constructor @struct @final
 */
gpub.spec.Processor = function(spec, cache) {
  /** @private @const {!gpub.spec.Spec} */
  this.originalSpec_ = spec;

  /**
   * Id Generator instance
   * @private @const {!gpub.spec.IdGen}
   */
  this.idGen_ = new gpub.spec.IdGen(spec.specOptions.idGenType);

  /**
   * Mapping from alias to movetree.
   * @const {!gpub.util.MoveTreeCache}
   * @private
   */
  this.mtCache_ = cache;
  if (!this.mtCache_) {
    throw new Error('cache must be defined. was: ' + this.mtCache_);
  }

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
      templateOptions: this.originalSpec_.templateOptions,
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
    mt = this.possiblyRotate_(
        mt, pos.alias, posType, this.originalSpec_.specOptions);

    // Create a new ID gen instance for creating IDs.
    var idGen = this.getIdGen_();
    switch(posType) {
      case 'GAME_COMMENTARY':
        // TODO(kashomon): If this updates the movetree (via rotation) then the
        // movetree needs to be updated in the cache and a new SGF needs to
        // be retrieved.
        var proc = gpub.spec.processGameCommentary(
            mt, pos, idGen, this.originalSpec_.specOptions);
        this.storeNewMovetree_(pos, proc.movetree);
        return proc.generated;
        break;

      case 'PROBLEM':
        var proc = gpub.spec.processProblems(
            mt, pos, idGen, this.originalSpec_.specOptions);
        this.storeNewMovetree_(pos, proc.movetree);
        return proc.generated;
        break;

      case 'POSITION_VARIATIONS':
        throw new Error('Not supported');

      case 'EXAMPLE':
        return null;
        break;

      // case 'POSITION_VARIATIONS':
        // Fall through, for now.
      default: throw new Error('Unknown position type:' + JSON.stringify(posType));
    }
  },

  /**
   * Stores a new movetree from processing.
   * @param {!gpub.spec.Position} position
   * @param {?glift.rules.MoveTree} mt
   */
  storeNewMovetree_: function(position, mt) {
    var alias = position.alias;
    if (!mt) {
      // Could be null if no change is required
      return;
    }
    if (!alias) {
      // This shouldn't happen since we've already done a getMovetree_();
      throw new Error('alias must be defined in order to store a new movetree.');
    }
    this.mtCache_.set(alias, mt);
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
    return this.mtCache_.get(alias);
  },

  /**
   * Gets a movetree for an position
   *
   * @param {!glift.rules.MoveTree} movetree
   * @param {string} alias
   * @param {!gpub.spec.PositionType} posType
   * @param {!gpub.opts.SpecOptions} opts
   * @return {!glift.rules.MoveTree}
   * @private
   */
  possiblyRotate_: function(movetree, alias, posType, opts) {
    if (opts.autoRotateCropTypes[posType] && opts.autoRotateCropPrefs) {
      var nmt = glift.orientation.autoRotateCrop(
          movetree, opts.autoRotateCropPrefs)
      this.mtCache_.set(alias, nmt);
      return nmt.getTreeFromRoot();
    }
    return movetree;
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
    } else if (this.originalSpec_.specOptions.positionType) {
      positionType = this.originalSpec_.specOptions.positionType;
    }
    if (!positionType) {
      throw new Error('No position type specified for position:'
          + JSON.stringify(position));
    }
    return positionType;
  },

  /**
   * Gets the id generator for a position object
   * @return {!gpub.spec.IdGen}
   */
  getIdGen_: function() {
    return this.idGen_;
  }
};
