/**
 * A gpub spec processor. Implements gpub.spec.processor.
 */
gpub.spec.gameBook = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.EXAMPLE;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
    var out = [];
    var varPathBuffer = [];
    var node = mt.node();
    while (node) {
      if (!mt.properties().getComment() && node.numChildren() > 0) {
        // Ignore positions don't have comments and aren't terminal.
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        var node = mt.node();
        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
      } else {
        // This node has a comment or is terminal.  Process this node and all
        // the variations.
        var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
        out.push(gpub.spec._createExample(
            alias,
            pathSpec.treepath,
            pathSpec.nextMoves,
            options.boardRegion));

        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
        for (var i = 0; i < varPathBuffer.length; i++) {
          var path = varPathBuffer[i];
          var mtz = mt.getTreeFromRoot(path);
          var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
          out.push(gpub.spec._createExample(
              alias,
              varPathSpec.treepath,
              varPathSpec.nextMoves,
              options.boardRegion));
        }
        varPathBuffer = [];
      }
      node = node.getChild(0); // Travel down
      mt.moveDown();
    }
    return out;
  },

  /**
   * Get an initial treepath to the point where we want to create a next-moves
   * path.
   *
   * mt: The movetree
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
    for (var i = 1; i < mt.node().numChildren(); i++) {
      var mtz = mt.newTreeRef();
      mtz.moveDown(i);
      mtz.recurse(function(nmtz) {
        if (!nmtz.properties().getOneValue('C')) {
          return; // Must have a comment to return the variation.
        }
        out.push(nmtz.treepathToHere());
      });
    }
    return out;
  }
};
