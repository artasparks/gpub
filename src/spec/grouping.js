goog.provide('gpub.spec.Grouping');

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
  if (o.positions) {
    for (var i = 0; i < o.positions.length; i++) {
      this.positions.push(new gpub.spec.Position(o.positions[i]));
    }
  }

  /**
   * Groupings that are children of his grouping.
   * @type {!Array<!gpub.spec.Grouping>}
   */
  this.groupings = [];
  if (o.groupings) {
    for (var i = 0; i < o.groupings.length; i++) {
      this.groupings.push(new gpub.spec.Grouping(o.groupings[i]));
    }
  }
};

