goog.provide('gpub.spec.Generated');
goog.provide('gpub.spec.GeneratedTypedef');

/**
 * @typedef {{
 *  id: (string|undefined),
 *  positions: (!Array<!gpub.spec.Position>|undefined),
 *  positionType: (gpub.spec.PositionType|undefined),
 *  labelMap: (!Object<string, !Array<string>>|undefined),
 * }}
 */
gpub.spec.GeneratedTypedef;

/**
 * Generated positions.
 *
 * @param {(!gpub.spec.Generated|gpub.spec.GeneratedTypedef)=} opt_gen
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
   * Default position type to apply to the generated positions. Generally this
   * will just be EXAMPLE
   * @const {gpub.spec.PositionType}
   */
  this.positionType = o.positionType || gpub.spec.PositionType.EXAMPLE;

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
};

gpub.spec.Generated.prototype = {
  /**
   * Create the labels map from all the generated positions.
   *
   * This is a map from arbitrary labels to position ID. This is motivated by Problem
   * positions which generate:
   * - A starting position.
   * - Correct variations.
   * - Incorrect variations.
   *
   * @return {!Object<string, !Array<string>>}
   */
  positionLabels: function() {
    var labels = {};
    for (var i = 0; i < this.positions.length; i++) {
      var p = this.positions[i];
      for (var j = 0; j < p.labels.length; j++) {
        var lab = p.labels[j];
        if (!labels[lab]) {
          labels[lab] = [];
        }
        labels[lab].push(p.id);
      }
    }
    return labels;
  }
};
