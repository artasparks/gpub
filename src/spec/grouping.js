goog.provide('gpub.spec.Grouping');
goog.provide('gpub.spec.Generated');

/**
 * A grouping of Positions. Each grouping can have sub-groupings, and so on. The
 * structure is required to be tree-shaped -- no cycles can occur.
 *
 * Also note: Position objects are only allowed to occur on terminal nodes.
 *
 * @param {!gpub.spec.Grouping=} opt_group
 *
 * @constructor @final @struct
 */
gpub.spec.Grouping = function(opt_group) {
  var o = opt_group || {};

  /**
   * Description of this section.
   * @type {string|undefined}
   */
  this.description = o.description || undefined;

  /**
   * It can make sense to specify the Position Type for a specific grouping. Unless
   * re-specified by children groupings, the type should apply to the
   * descendents. It's possible to have a heterogenous collection af Positions in a
   * grouping, so by default this is not set.
   *
   * @type {gpub.spec.PositionType|undefined}
   */
  this.positionType = o.positionType || undefined;

  /**
   * Position Objects associated directly with this grouping.
   * @type {!Array<!gpub.spec.Position>}
   */
  this.positions = [];
  // TODO(Kashomon): Make a helper for these copy functions. It's getting to be
  // a little much and it's error-prone.
  if (o.positions) { // Deep copy
    for (var i = 0; i < o.positions.length; i++) {
      this.positions.push(new gpub.spec.Position(o.positions[i]));
    }
  }

  /**
   * Positions generated from a position in the position array. A map from the
   * ID of the original position to the generated positions.
   * @type {!Object<string, !gpub.spec.Generated>}
   */
  this.generated = {};
  if (o.generated) { // Deep copy
    for (var k in o.generated) {
      this.generated[k] = new gpub.spec.Generated(o.generated[k])
    }
  }

  /**
   * Groupings that are children of his grouping.
   * @type {!Array<!gpub.spec.Grouping>}
   */
  this.groupings = []; // Deep copy.
  if (o.groupings) {
    for (var i = 0; i < o.groupings.length; i++) {
      this.groupings.push(new gpub.spec.Grouping(o.groupings[i]));
    }
  }
};


/**
 * Generated positions.
 *
 * @param {!gpub.spec.Generated=} opt_gen
 *
 * @constructor @final @struct
 */
gpub.spec.Generated = function(opt_gen) {
  var o = opt_gen || {};

  if (!o.id) {
    throw new Error('id was not defined, but must be defined');
  }

  /**
   * ID of the Position that generated this generated obj.
   * @const {string}
   */
  this.id = o.id;

  /**
   * Generated positions.
   * @type {!Array<!gpub.spec.Position>}
   */
  this.positions = [];
  if (o.positions) { // Deep copy
    for (var i = 0; i < o.positions.length; i++) {
      this.positions.push(new gpub.spec.Position(o.positions[i]));
    }
  }

  /**
   * Map from arbitrary labels to indices in the positions array. This is
   * motivated by Problem positions which generate:
   * - A starting position.
   * - Correct variations.
   * - Incorrect variations.
   * This is not guaranteed to be populated by anything in particular, but may
   * be populated for convenience.
   * @type {!Object<string, !Array<number>>}
   */
  this.labelMap = {};
  if (o.labelMap) { // Deep copy
    for (var k in o.labelMap) {
      // if o.labelMap[k] is not an array, thats a programming error and should explode.
      this.labelMap[k] = o.labelMap[k].slice();
    }
  }
};
