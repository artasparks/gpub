goog.provide('gpub.SpecOptions');
goog.provide('gpub.api.ProblemAnswers');


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
  /** Only generate problems answers. This is useful for when users want the
   * answers in a separate book */
  ONLY_ANSWERS: 'ONLY_ANSWERS',
};


/**
 * Options for spec creation
 * 
 * @param {!gpub.SpecOptions=} opt_options
 *
 * @constructor @final @struct
 */
gpub.SpecOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * Optionally, the user can pass in defaults to apply to the SGFs. These are
   * the defaults applied to Phase 1: Basic spec generation.
   * @const {!gpub.spec.PositionType}
   */
  this.defaultPositionType = o.defaultPositionType ||
      gpub.spec.PositionType.GAME_COMMENTARY;

  /**
   * How should the problem answers be generated?
   * @const {!gpub.api.ProblemAnswers}
   */
  this.problemAnswerType = o.problemAnswerType || gpub.api.ProblemAnswers.AT_END;

  /**
   * How many problems should be grouped together? This is only usefulo for the
   * AFTER_PROBLEM type. 0 groups all the problems together and results in the
   * same generation as the AT_END type.
   * @const {!number}
   */
  this.numProblemsInGroup = o.numProblemsInGroup !== undefined ?
      o.numProblemsInGroup : 2;

  /**
   * Some problems have dozens of answers specified in their
   * respective Positions. To limit this answer explosion, the user can specify the
   * maximum number of answers that will be rendered. 0 indicates there is no
   * limit.
   *
   * @const {!number}
   */
  this.maxAnswersPerProblem  = o.maxAnswersPerProblem !== undefined ?
      o.maxAnswersPerProblem : 2;
};
