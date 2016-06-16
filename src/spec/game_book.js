goog.provide('gpub.spec.GameCommentary');

/**
 * A gpub spec processor. Implements gpub.spec.processor.
 *
 * @implements {gpub.spec.TypeProcessor}
 *
 * @constructor @struct @final
 */
gpub.spec.GameCommentary = function() {};

gpub.spec.GameCommentary.prototype = {
  /**
   * @param {!glift.rules.MoveTree} mt
   * @param {string} alias
   * @param {glift.enums.boardRegions} boardRegion
   * @return {!gpub.spec.Grouping}
   */
  process: function(mt, alias, boardRegion) {
    var out = [];
    var varPathBuffer = [];
    var node = mt.node();
    var ipString = glift.rules.treepath.toInitPathString;
    var fragString = glift.rules.treepath.toFragmentString;

    while (node) {
      if (!mt.properties().getComment() && node.numChildren() > 0) {
        // Ignore positions don't have comments and aren't terminal.
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        node = mt.node();
        varPathBuffer = varPathBuffer.concat(this.variationPaths(mt));
      } else {
        // This node has a comment or is terminal.  Process this node and all
        // the variations.
        var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
        out.push(new gpub.spec.Sgf({
            alias: alias,
            initialPosition: ipString(pathSpec.treepath),
            nextMovesPath: fragString(pathSpec.nextMoves),
            boardRegion: boardRegion
        }));

        varPathBuffer = varPathBuffer.concat(this.variationPaths(mt));
        for (var i = 0; i < varPathBuffer.length; i++) {
          var path = varPathBuffer[i];
          var mtz = mt.getTreeFromRoot(path);
          var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
          out.push(new gpub.spec.Sgf({
              alias: alias,
              initialPosition: ipString(varPathSpec.treepath),
              nextMovesPath: fragString(varPathSpec.nextMoves),
              boardRegion: boardRegion,
          }));
        }
        varPathBuffer = [];
      }
      node = node.getChild(0); // Travel down
      mt.moveDown();
    }

    // TODO(kashomon): Expand this.
    var grouping = new gpub.spec.Grouping(/** @type {!gpub.spec.Grouping} */ ({
      sgfs: out,
    }));

    return grouping;
  },

  /**
   * Get the next move treepaths for a particular root node.
   * path.
   *
   * @param {!glift.rules.MoveTree} mt
   * @return {!Array<!glift.rules.Treepath>}
   */
  variationPaths: function(mt) {
    mt = mt.newTreeRef();
    var out = [];
    var node = mt.node();
    if (!node.getParent()) {
      // There shouldn't variations an the root, so just return.
      return out;
    }

    mt.moveUp();

    // Look at all non-mainline variations
    for (var i = 1; i < mt.node().numChildren(); i++) {
      var mtz = mt.newTreeRef();
      mtz.moveDown(i);
      mtz.recurse(function(nmtz) {
        if (!nmtz.properties().getComment()) {
          return; // Must have a comment to return the variation.
        }
        out.push(nmtz.treepathToHere());
      });
    }
    return out;
  }
};
