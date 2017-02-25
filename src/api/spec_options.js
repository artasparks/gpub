goog.provide('gpub.api.SpecOptions');

goog.scope(function() {

/** @type {!glift.rules.ProblemConditions} */
var defaultProbCon = {};
defaultProbCon[glift.rules.prop.GB] = [];
defaultProbCon[glift.rules.prop.C] = ['Correct', 'is correct'];

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

  /**
   * How are IDs generated?
   * @const {!gpub.spec.IdGenType}
   */
  this.idGenType = o.idGenType || gpub.spec.IdGenType.PATH;

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

  /**
   * AutoRotateCropPrefs controls whether auto-rotation is performed for a
   * cropping. As an example: if the crop-corner specified is TOP_LEFT and the
   * crop used is TOP_RIGHT, the sgf will be rotated 90 degrees to the left.
   *
   * If not specifed, no autorotation takes place. This is generally
   * intended for problems to ensure that problems consistently in a corner or
   * on a side.
   *
   * Be careful with this option! This will break horribly if multiple types of
   * positions (e.g., game commentary, problems) are combined into one SGF.
   *
   * @const {!glift.orientation.AutoRotateCropPrefs|undefined}
   */
  this.autoRotateCropPrefs = o.autoRotateCropPrefs || undefined;

  /**
   * Specifies what positionType should have autorotation applied.
   * @const {!Array<!gpub.spec.PositionType>}
   */
  this.autoRotateTypes = o.autoRotateTypes || [
    gpub.spec.PositionType.PROBLEM,
    //gpub.spec.PositionType.POSITION_VARIATIONS,
  ];
};

});
