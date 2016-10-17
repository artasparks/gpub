goog.provide('gpub.diagrams.Renderer');

/**
 * General diagram renderer.
 * @param {!gpub.spec.Spec} spec
 * @param {!gpub.api.DiagramOptions} opts
 * @param {!gpub.util.MoveTreeCache} cache
 * @constructor @struct @final
 */
gpub.diagrams.Renderer = function(spec, opts, cache) {
  /** @const {!gpub.spec.Spec} */
  this.spec_ = spec;

  /** @const {!gpub.api.DiagramOptions} */
  this.opts_ = opts;

  /** @const {!gpub.util.MoveTreeCache} */
  this.cache_ = cache;
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
      out = out.concat(this.renderOneGroup_(g));
    }
    return out;
  },

  /**
   * Render all the positions for a single group; We only render the generated
   * positions; if there are no generated positions, we try to render the
   * original position.
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
   * Render a single position.
   * @param {!gpub.spec.Position} pos
   * @return {!gpub.diagrams.Diagram} diag
   * @private
   */
  renderOnePosition_: function(pos) {
    var mt = this.cache_.get(pos.alias);
    var region = this.opts_.boardRegion;
    var init = glift.rules.treepath.parseInitialPath(pos.initialPosition);
    mt = mt.getTreeFromRoot(init);
    var flattened = glift.flattener.flatten(mt, {
      boardRegion: region,
      nextMovesTreepath: glift.rules.treepath.parseFragment(pos.nextMovesPath  || ''),
    });
    switch(this.opts_.diagramType) {
      case 'GNOS':
        break;
      case 'GOOE':
        break
      case 'IGO':
        break;
      default:
        throw new Error('Unexpected or unknown diagramType: ' + this.opts_.diagramType);
    }
    return new gpub.diagrams.Diagram();
  },
};
