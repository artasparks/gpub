goog.provide('gpub.spec.Position');
goog.provide('gpub.spec.PositionTypedef');
goog.provide('gpub.spec.PositionType');

/**
 * The type or interpretation of the Position.
 *
 * @enum {string}
 */
gpub.spec.PositionType = {
  /**
   * A flat diagram without any special meaning. All other types can be
   * converted into one or more EXAMPLE types. EXAMPLE types are ultimately the
   * types rendered by Gpub.
   */
  EXAMPLE: 'EXAMPLE',

  /** A mainline path plus variations. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /**
   * A problem position. In problems, there isn't usually a concept of a mainline
   * vairation. Each variation indicates either a correct or incorrect solution.
   */
  PROBLEM: 'PROBLEM',

  /**
   * A set of variations for a position. This type is rare and is a combination
   * of GAME_COMMENTARY and PROBLEM. This type is usually used for Joseki
   * diagrams where there's no concept of mainline variation nor of right or
   * wrong -- there's simple a base position and variations on that position.
   *
   * **CURRENTLY UNSUPPORTED**
   */
  POSITION_VARIATIONS: 'POSITION_VARIATIONS',
};

/**
 * @typedef {{
 *  alias: (string|undefined),
 *  id: (string|undefined),
 *  initialPosition: (string|undefined),
 *  nextMovesPath: (string|undefined),
 *  positionType: (gpub.spec.PositionType|undefined)
 * }}
 */
gpub.spec.PositionTypedef;

/**
 * A single Position definition. This is overloaded and used for both individual Positions
 * and for Position defaults.
 *
 * @param {(!gpub.spec.Position|!gpub.spec.PositionTypedef)=} opt_position
 *
 * @constructor @struct @final
 */
gpub.spec.Position = function(opt_position) {
  var o = opt_position || {};

  if (!o.id) {
    throw new Error('Positions are required to have IDs. Was: ' + o.id);
  }

  /**
   * ID of this particular position. Required and must be unique
   * @const {string}
   */
  this.id = o.id;

  if (!o.alias) {
    throw new Error('SGF Alias must be defined')
  }

  /**
   * Alias of the SGF in the SGF mapping. Required and must be unique.
   * @const {string}
   */
  this.alias = o.alias;

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
   * Optional positiontype
   * @const {gpub.spec.PositionType|undefined}
   */
  this.positionType = o.positionType || undefined;

  /**
   * Optional array of labels. This is usually created during specProcessing,
   * if at all.
   * @const {!Array<string>|undefined}
   */
  this.labels = o.labels ? o.labels.slice() : undefined;
};

gpub.spec.Position.prototype = {
  /**
   * Validate the spec and throw an error.
   * @return {!gpub.spec.Position} this
   */
  validate:  function() {
    if (this.alias == undefined) {
      throw new Error('No SGF Alias');
    }
    if (this.initialPosition == undefined) {
      throw new Error('No Initial Position');
    }

    if (this.positionType !== gpub.spec.PositionType.EXAMPLE &&
        this.nextMovesPath != undefined) {
      throw new Error('Next moves path is only valid for EXAMPLE types');
    }
    return this;
  }
};
