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


  // Rotation options
  //
  // Some notes: It may seem like rotation should be at the diagram-level, and
  // it's certainly possible to put it there with some work. However, rotations
  // affect the entire movetree permanently (it's not just a rendering-change)
  // and so should be performed early in the GPub-generation process. The spec
  // is the earliest point at which this makes sense.
  //
  // They will also break if multiple types of positions (e.g., game
  // commentary, problems) are combined into one SGF.
  //
  // It's generally recommended that the SGFs be rotated with a script and then
  // saved that way. However, this might not always make sense.

  /**
   * AutoRotateCropPrefs controls whether auto-rotation is performed for a
   * cropping. As an example: if the crop-corner specified is TOP_LEFT and the
   * crop used is TOP_RIGHT, the sgf will be rotated 90 degrees to the left.
   *
   * If not specifed, no autorotation takes place. This is generally
   * intended for problems to ensure that problems consistently in a corner or
   * on a side.
   *
   * @const {!glift.orientation.AutoRotateCropPrefs|undefined}
   */
  this.autoRotateCropPrefs = o.autoRotateCropPrefs || undefined;

  /**
   * Specifies what positionType should have autorotation applied.
   * @const {!Object<!gpub.spec.PositionType, boolean>}
   */
  this.autoRotateCropTypes = o.autoRotateCropTypes || {
    'PROBLEM': true,
    'POSITION_VARIATIONS': true,
  };
};

});
