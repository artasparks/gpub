goog.provide('gpub.api.SpecOptions');
goog.provide('gpub.api.ProblemAnswers');

goog.require('gpub.api');

/**
 * How should the problem answers be generated?
 * @enum {string}
 */
gpub.api.ProblemAnswers = {
  /** Don't generate problem answers */
  NO_ANSWERS: 'NO_ANSWERS',
  /** Generate the answers directly after the problem grouping. */
  AFTER_PROBLEM: 'AFTER_PROBLEM',
  /** Generate the anwers after all the problems. */
  AT_END: 'AT_END',
  /**
   * Only generate problems answers. This is useful for when users want the
   * answers in a separate book.
   */
  ONLY_ANSWERS: 'ONLY_ANSWERS',
};


/**
 * Options for spec creation
 * 
 * @param {!gpub.api.SpecOptions=} opt_options
 *
 * @constructor @final @struct
 */
gpub.api.SpecOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * Optionally, the user can pass in defaults to apply to the SGFs. These are
   * the defaults applied to Phase 1: Basic spec generation.
   * @const {!gpub.spec.PositionType}
   */
  this.defaultPositionType = o.defaultPositionType ||
      gpub.spec.PositionType.GAME_COMMENTARY;

  /** @type {!glift.rules.ProblemConditions} */
  var defaultProbCon = {};
  defaultProbCon[glift.rules.prop.GB] = [];
  defaultProbCon[glift.rules.prop.C] = ['Correct', 'is correct'];

  /**
   * Problem conditions indicate how to determine whether a particular
   * variation is considered 'correct' or 'incorrect'. In brief, this relies on
   * looking for simple matches in the underlying SGF.
   *
   * Some Examples:
   *    Correct if there is a GB property or the words 'Correct' or 'is correct' in
   *    the comment. This is the default.
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   *    Nothing is correct
   *    {}
   *
   *    Correct as long as there is a comment tag.
   *    { C: [] }
   *
   *    Correct as long as there is a black stone-move (a strange condition).
   *    { B: [] }
   * @const {!glift.rules.ProblemConditions}
   */
  this.problemConditions = o.problemConditions || defaultProbCon;
};
