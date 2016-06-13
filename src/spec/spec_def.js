goog.provide('gpub.spec.Grouping');
goog.provide('gpub.spec.Sgf');
goog.provide('gpub.spec.SgfTypedef');
goog.provide('gpub.spec.SgfType');
goog.provide('gpub.spec.Spec');

goog.scope(function() {

/**
 * A book spec represents a serialized Book specification or Spec. Re-running
 * Gpub on the same spec should generate the same output.
 *
 * The Book Spec is descendent from the Glift Spec, but has orthogonal concerns
 * and so is separate.
 *
 * @param {!gpub.spec.Spec=} opt_spec
 *
 * @constructor @struct @final
 */
gpub.spec.Spec = function(opt_spec) {
  var o = opt_spec || {};

  /**
   * Top-level SGF grouping.
   *
   * @const {!gpub.spec.Grouping}
   */
  this.grouping = new gpub.spec.Grouping(o.grouping);

  /**
   * Mapping from SGF Alias to SGF string. It's not required that this be a
   * bijection, but it doesn't really make sense to duplicate SGFs in the
   * mapping.
   *
   * @const {!Object<string, string>}
   */
  this.sgfMapping = o.sgfMapping || {};
};

/**
 * Deserialize a spec from JSON
 * @param {string} str
 */
gpub.spec.Spec.deserializeJson = function(str) {
  var obj = /** @type {!gpub.spec.Spec} */ (JSON.parse(str));
  return new gpub.spec.Spec(obj);
};

gpub.spec.Spec.prototype = {
  /**
   * Transform a this spec into a JSON represontation.
   * @return {string}
   */
  serializeJson: function() {
    return JSON.stringify(this);
  }
};

/**
 * A grouping of SGFs each grouping can have sub-groupings, and so on. The
 * structure is required to be tree-shaped -- no cycles can occur.
 *
 * @param {!gpub.spec.Grouping=} opt_group
 *
 * @constructor @final @struct
 */
gpub.spec.Grouping = function(opt_group) {
  var o = opt_group || {};

  /**
   * It can be useful to provide group titles. These may eventually correspond
   * to chapter titles, but it's not required
   * @type {string|undefined}
   */
  this.title = o.title || undefined;

  /**
   * Description of this section.
   * @type {string|undefined}
   */
  this.description = o.description || undefined;

  /**
   * It can make sense to specify the SGF Type for a specific grouping. Unless
   * re-specified by children groupings, the type should apply to the
   * descendents. It's possible to have a heterogenous collection af SGFs in a
   * grouping, so by default this is not set.
   *
   * @type {gpub.spec.SgfType|undefined}
   */
  this.sgfType = o.sgfType || undefined;

  /**
   * Optionally specify a board region to apply to the children.
   * @type {glift.enums.boardRegions}
   */
  this.boardRegion = o.boardRegion || undefined;

  /**
   * SGF Objects associated directly with this grouping.
   * @type {!Array<!gpub.spec.Sgf>}
   */
  this.sgfs = o.sgfs || [];

  /**
   * Groupings that are children of his grouping.
   * @type {!Array<!gpub.spec.Grouping>}
   */
  this.subGroupings = o.subGroupings || [];
};


/**
 * @typedef {{
 *  alias: (string|undefined),
 *  id: (string|undefined),
 *  initialPosition: (string|undefined),
 *  nextMovesPath: (string|undefined),
 *  boardRegion: (glift.enums.boardRegions|undefined),
 *  sgfType: (gpub.spec.SgfType|undefined)
 * }}
 */
gpub.spec.SgfTypedef;

/**
 * A single SGF definition. This is overloaded and used for both individual SGFs
 * and for SGF defaults.
 *
 * @param {(!gpub.spec.Sgf|!gpub.spec.SgfTypedef)=} opt_sgf
 *
 * @constructor @struct @final
 */
gpub.spec.Sgf = function(opt_sgf) {
  var o = opt_sgf || {};

  /**
   * Alias of the SGF in the SGF mapping. Must be specified.
   * @const {string|undefined}
   */
  this.alias = o.alias || undefined;

  /**
   * ID of this particular sgf + position.
   * @const {string|undefined}
   */
  this.id = o.id || undefined;

  /**
   * An initial position, specified as a stringified Glift treepath.
   * @const {string|undefined}
   */
  this.initialPosition = o.initialPosition || undefined;

  /**
   * Optional next moves path showing a sequence of moves, specified as a Glift
   * treepath fragment.
   * @const {string|undefined}
   */
  this.nextMovesPath = o.nextMovesPath || undefined;

  /**
   * Optional board region specifying cropping.
   * @const {glift.enums.boardRegions|undefined}
   */
  this.boardRegion = o.boardRegion || undefined;

  /**
   * Optional sgf type
   * @const {gpub.spec.SgfType|undefined}
   */
  this.sgfType = o.sgfType || undefined;
};

gpub.spec.Sgf.prototype = {
  /**
   * Validate the spec and throw an error if the spec is 
   * @return {!gpub.spec.Sgf} this
   */
  validate:  function() {
    if (this.alias == undefined) {
      throw new Error('No SGF Alias');
    }
    if (this.initialPosition == undefined) {
      throw new Error('No Initial Position');
    }

    if (this.sgfType !== gpub.spec.SgfType.EXAMPLE &&
        this.nextMovesPath != undefined) {
      throw new Error('Next moves path is only valid for EXAMPLE types');
    }
    return this;
  }
};

/**
 * The type or interpretation of the SGF.
 *
 * @enum {string}
 */
gpub.spec.SgfType = {
  /**
   * A flat diagram without any special meaning. All other types can be
   * converted into one or more EXAMPLE types. EXAMPLE types are ultimately the
   * types rendered by Gpub.
   */
  EXAMPLE: 'EXAMPLE',

  /** A mainline path plus variations. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /**
   * A problem SGF. In problems, there isn't usually a concept of a mainline
   * vairation. Each variation indicates either a correct or incorrect solution.
   */
  PROBLEM: 'PROBLEM',

  /**
   * A set of variations for a position. This type is rare and is a combination
   * of GAME_COMMENTARY and PROBLEM. This type is usually used for Joseki
   * diagrams where there's no concept of mainline variation nor of right or
   * wrong -- there's simple a base position and variations on that position.
   */
  POSITION_VARIATIONS: 'POSITION_VARIATIONS',
};

});
