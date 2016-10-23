goog.provide('gpub.api.SpecOptions');

goog.require('gpub.api');

/**
 * The user can pass in defaults to apply to the SGFs during spec
 * creation.
 *
 * @param {!gpub.api.SpecOptions=} opt_options
 *
 * @constructor @final @struct
 */
gpub.api.SpecOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * Set the default position type for all position generation during spec
   * processing.
   * @const {!gpub.spec.PositionType}
   */
  this.positionType = o.positionType ||
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
