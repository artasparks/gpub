goog.provide('gpub.spec.GroupingOrSgf');
goog.provide('gpub.spec.IdGen');
goog.provide('gpub.spec.Processor');
goog.provide('gpub.spec.TypeProcessor');

/**
 * A processor takes as input a single SGF, implicitly with a specified type,
 * and outputs a series of EXAMPLE Sgf objects.
 *
 * @record
 */
gpub.spec.TypeProcessor = function() {};

/**
 * Represents the return value of the type processor. Only one of grouping or
 * SGF should be defined.
 * @typedef {{
 *  grouping: (!gpub.spec.Grouping|undefined),
 *  sgf: (!gpub.spec.Sgf),
 * }}
 */
gpub.spec.GroupingOrSgf;

/**
 * @param {!glift.rules.MoveTree} mt
 * @param {!gpub.spec.Sgf} sgf
 * @param {!gpub.spec.IdGen} idGen
 * @return {!gpub.spec.Grouping}
 *
 * @return {!gpub.spec.GroupingOrSgf} a procesed grouping for the sgf.
 */
gpub.spec.TypeProcessor.prototype.process =
    function(movetree, alias, boardRegion) {};


/**
 * Gets the the processor based on the book purpose.
 *
 * @param {gpub.spec.SgfType} sgfType
 * @return {!gpub.spec.TypeProcessor}
 */
gpub.spec.processor = function(sgfType) {
  if (sgfType === gpub.spec.SgfType.GAME_COMMENTARY) {
    return new gpub.spec.GameCommentary();
  }
  if (sgfType === gpub.spec.SgfType.PROBLEM) {
    return new gpub.spec.Problem();
  }
  if (sgfType === gpub.spec.SgfType.EXAMPLE) {
    return new gpub.spec.Example();
  }
  if (sgfType === gpub.spec.SgfType.POSITION_VARIATIONS) {
    return new gpub.spec.PositionVariations();
  }

  throw new Error('Unsupported book purpose: ' + sgfType);
};

/**
 * Simple id generator.
 * @constructor @struct @final
 * @package
 */
gpub.spec.IdGen = function() {
  var idx = 0;
  /** @return {number} */
  this.next = function() {
    idx++;
    return idx;
  };
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
   * SGF Mapping from alias to SGF string.
   * @const {!Object<string, string>}
   * @private
   */
  this.sgfMapping_ = spec.sgfMapping;

  /**
   * A top-level grouping, and ensuring the grouping is complete copy.
   * @const {!gpub.spec.Grouping}
   * @private
   */
  this.topGrouping_ = new gpub.spec.Grouping(spec.grouping);

  /** @private {!gpub.spec.IdGen} */
  this.idGen_ = new gpub.spec.IdGen();
};

gpub.spec.Processor.prototype = {
  /**
   * Process the spec! Returns an
   *
   * @return {!gpub.spec.Spec}
   */
  process: function() {
    this.processGroup(this.topGrouping_);
    return new gpub.spec.Spec({
      grouping: this.topGrouping_,
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
    this.reprocessSgfs_(grouping);
    for (var i = 0; i < grouping.subGroupings.length; i++) {
      this.processGroup(grouping.subGroupings[i]);
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
    for (var i = 0; i < grouping.sgfs.length; i++) {
      var sgf = grouping.sgfs[i];
      if (sgf.sgfType !== gpub.spec.SgfType.EXAMPLE) {
        containsAllExamples = false;
        break;
      }
    }
    return containsAllExamples;
  },

  /**
   * Reprocess the SGFs in a grouping by ordering them into similar types and
   * then processing them with the type-specific processors. If the Grouping
   * contains only examples, the grouping is considered to be already processed
   * and this function returns without doing any work.
   *
   * If the grouping has SGFs that need to be processed, we process all the
   * SGFs.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @private
   */
  reprocessSgfs_: function(grouping) {
    if (this.containsAllExamples_(grouping)) {
      // Ensure the IDs are accurate
      return;
    }
    var sgfs = grouping.sgfs;
    grouping.sgfs = [];
    var currentType = null;
    var sameTypeSgfs = [];

    for (var i = 0; i < sgfs.length; i++) {
      var sgf = sgfs[i];
      var sgfType = this.getSgfType_(grouping, sgf);
      if (!currentType) {
        currentType = sgfType;
      }
      if (currentType === sgfType) {
        sameTypeSgfs.push(sgf);
      } else {
        this.processSgfBuffer_(grouping, sameTypeSgfs);
        sameTypeSgfs = [];
      }
    }
    if (sameTypeSgfs.length) {
      this.processSgfBuffer_(grouping, sameTypeSgfs);
      sameTypeSgfs = [];
    }
  },

  /**
   * Process a grouping of SGFS. Where the magic happens.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @param {!Array<!gpub.spec.Sgf>} sgfs
   * @private
   */
  processSgfBuffer_: function(grouping, sgfs) {
    if (!sgfs.length) {
      return; // No SGFs. nothing to do.
    }
    var newGrouping = new gpub.spec.Grouping();
    var type = this.getSgfType_(grouping, sgfs[0]);
    var processor = gpub.spec.processor(sgfType);
    for (var i = 0; i < sgfs.length; i++) {
      var sgf = sgfs[i];
      var mt = this.getMovetree_(sgf);
    }
  },

  /**
   * Gets a movetree for an SGF
   *
   * @param {!gpub.spec.Sgf} sgf
   * @return {!glift.rules.MoveTree}
   * @private
   */
  getMovetree_: function(sgf) {
    var alias = sgf.alias;
    if (!alias) {
      throw new Error('No alias defined for SGF object: ' + JSON.stringify(sgf));
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
   * Get a SGF Type for a grouping/sgf pair.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @param {!gpub.spec.Sgf} sgf
   * @return {!gpub.spec.SgfType}
   * @private
   */
  getSgfType_: function(grouping, sgf) {
    var sgfType = null;
    if (sgf.sgfType) {
      sgfType = sgf.sgfType;
    } else if (grouping.sgfType) {
      sgfType = grouping.sgfType;
    }
    if (!sgfType) {
      throw new Error('No SGF type specified for SGF:' + JSON.stringify(sgf));
    }
    return sgfType;
  },
};
