goog.provide('gpub.diagrams.Renderer');

/**
 * General diagram renderer.
 * @param {!gpub.spec.Spec} spec
 * @param {!gpub.api.DiagramOptions} opts.
 * @constructor @struct @final
 */
gpub.diagrams.Renderer = function(spec, opts) {
  /** @const {!gpub.spec.Spec} */
  this.spec_ = spec;

  /** @const {!gpub.api.DiagramOptions} */
  this.opts_ = opts;
};

gpub.diagrams.Renderer.prototype = {
  /**
   * Render all the positions in all the groups.
   * @return {!Array<!gpub.diagrams.Diagram>}
   */
  render: function() {
    return this.renderGroups_(this.spec_.rootGrouping);
  },

  /**
   * @param {!gpub.spec.Grouping} g
   * @return {!Array<!gpub.diagrams.Diagram>} Rendered diagrams.
   * @private
   */
  renderGroups_: function(g) {
    var out = this.renderOneGroup_(g);
    for (var i = 0; i < g.groupings.length; i++) {
      var o = this.renderOneGroup_(g);
      out = out.concat(o);
    }
    return out;
  },

  /**
   * Render all the positions for a single group.
   * @param {!gpub.spec.Grouping} g
   * @return {!Array<!gpub.diagrams.Diagram>} Rendered diagrams.
   * @private
   */
  renderOneGroup_: function(g) {
    var out = [];
    for (var i = 0; i < g.positions.length; i++) {
      var pos = g.positions[i];
      if (g.generated[pos.id]) {
        var gen = g.generated[pos.id];
        for (var j = 0; j < gen.positions.length; j++) {
          out.push(this.renderOnePosition_(gen.positions[i]));
        }
      } else {
        out.push(this.renderOnePosition_(pos));
      }
    }
    return out;
  },

  /**
   * Render a single position
   * @param {!gpub.spec.Position} pos
   * @return {!gpub.diagrams.Diagram} pos
   * @private
   */
  renderOnePosition_: function(pos) {
    return new gpub.diagrams.Diagram();
  },
};
