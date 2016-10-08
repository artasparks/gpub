goog.provide('gpub.spec.GameCommentary');

/**
 * @param {!glift.rules.MoveTree} mt The movetree for the position.
 * @param {!gpub.spec.Position} position The position used for spec generation.
 * @param {!gpub.spec.IdGen} idGen
 * @return {!gpub.spec.Generated} processed positions.
 */
gpub.spec.processGameCommentary = function(mt, position, idGen) {
  var outPositions = [];
  var varPathBuffer = [];
  var node = mt.node();
  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;
  var alias = position.alias;

  var gen = new gpub.spec.Generated({
    id: position.id
  });

  while (node) {
    if (!mt.properties().getComment() && node.numChildren() > 0) {
      // Ignore positions don't have comments and aren't terminal.
      // We ignore the current position, but if there are variations, we note
      // them so we can process them after we record the next comment.
      node = mt.node();
      varPathBuffer = varPathBuffer.concat(gpub.spec.variationPaths(mt));
    } else {
      // This node has a comment or is terminal.  Process this node and all
      // the variations.
      var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
      outPositions.push(new gpub.spec.Position({
          id: idGen.next(),
          alias: alias,
          initialPosition: ipString(pathSpec.treepath),
          nextMovesPath: fragString(pathSpec.nextMoves),
      }));

      varPathBuffer = varPathBuffer.concat(
          gpub.spec.variationPaths(mt));
      for (var i = 0; i < varPathBuffer.length; i++) {
        var path = varPathBuffer[i];
        var mtz = mt.getTreeFromRoot(path);
        var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
        outPositions.push(new gpub.spec.Position({
            id: idGen.next(),
            alias: alias,
            initialPosition: ipString(varPathSpec.treepath),
            nextMovesPath: fragString(varPathSpec.nextMoves),
        }));
      }
      varPathBuffer = [];
    }
    node = node.getChild(0); // Travel down
    mt.moveDown();
  }

  gen.positions = outPositions;
  return gen;
};

/**
 * Get the next move treepaths for a particular root node.
 * path.
 *
 * @param {!glift.rules.MoveTree} mt
 * @return {!Array<!glift.rules.Treepath>}
 */
gpub.spec.variationPaths = function(mt) {
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
};
