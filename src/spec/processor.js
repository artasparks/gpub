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
 * @param {!glift.rules.MoveTree} movetree Parsed movetree.
 * @param {!string} alias For the SGF string.
 * @param {!glift.enums.boardRegions} boardRegion
 *
 * @return {!gpub.spec.Grouping} a procesed grouping for the sgf.
 */
gpub.spec.TypeProcessor.prototype.process = function(movetree, alias, boardRegion) {};

/**
 * @param {!Object<string, string>} sgfMapping
 * @param {!gpub.spec.Grouping} topGrouping
 *
 * @constructor @struct @final
 */
gpub.spec.Processor = function(sgfMapping, topGrouping) {
  /**
   * Mapping from alias to movetree.
   * @const {!Object<string, glift.rules.Movetree}
   */
  this.mtMapping = {};

  /**
   * SGF Mapping from alias to SGF string.
   * @const {!Object<string, string>}
   */
  this.sgfMapping = sgfMapping;

  /**
   * A top-level grouping, and ensuring the grouping is complete copy.
   * @const {!gpub.spec.Grouping}
   */
  this.topGrouping = new gpub.spec.Grouping(topGrouping);

  /** @private {numbur} */
  this.diagramIndex_ = 1;
};

gpub.spec.Processor.prototype = {
  /**
   * @return {!gpub.spec.Spec}
   */
  process: function() {
    this.processGroup(topGrouping);
    return new gpub.spec.Spec({
      grouping: this.topGrouping,
      sgfMapping: sgfMapping,
    });
  },

  /**
   * Recursive group processor.
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
   * @param {!gpub.spec.Grouping}
   * @return {boolean}
   * @private
   */
  containsAllExamples_: function(grouping) {
    var containsAllExamples = true;
    for (var i = 0; i < this.topGrouping.length; i++) {
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
   * then processing them with the type-specific processors. Note that if the
   * Grouping contains only examples, the grouping is considered to be already
   * processed and this function returns without doing any work.
   *
   * @param {!gpub.spec.Grouping}
   */
  reprocessSgfs_: function(grouping) {
    if (!this.containsAllExamples_(grouping)) {
      return;
    }
    var sgfs = grouping.sgfs;
    grouping.sgfs = []; // Clear out the sgfs.
    var currentType = null;
    var sameTypeSgfs = [];

    for (var i = 0; i < sgfs.length; i++) {
      var sgf = sgfs[i];
      var sgfType = null;
      if (sgf.sgfType) {
        sgfType = sgf.sgfType;
      } else if (grouping.sgfType) {
        sgfType = grouping.sgfType;
      }
      if (!sgfType) {
        throw new Error('No SGF type specified for SGF:' + JSON.stringify(sgf));
      }

      if (!currentType) {
        currentType = sgfType;
      }

      if (currentType === sgfType) {
        sameTypeSgfs.push(sgf);
      } else {
        gpub.spec.processSgfBuffer_(sgfMapping, grouping, sameTypeSgfs);
        sameTypeSgfs = [];
      }
    }
    if (sameTypeSgfs.length
        && currentType !== gpub.spec.SgfType.EXAMPLE) {
      // The second condition should be unnecessary.
      gpub.spec.processSgfBuffer_(sgfMapping, grouping, sameTypeSgfs);
      sameTypeSgfs = [];
    }
  },

  getSgfType: function(grouping, sgf) {},
};
