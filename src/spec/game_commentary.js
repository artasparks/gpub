goog.provide('gpub.spec.GameCommentary');

/**
 * @param {!glift.rules.MoveTree} mt The movetree for the position.
 * @param {!gpub.spec.Position} position The position used for spec generation.
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.opts.SpecOptions} opt
 * @return {!gpub.spec.Processed} processed positions.
 * @package
 */
gpub.spec.processGameCommentary = function(mt, position, idGen, opt) {
  // TODO(kashomon): This should be refactored to be much simpler (more like the
  // problem-code).
  var varPathBuffer = [];

  var node = mt.node();
  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;
  var alias = position.alias;

  var gen = new gpub.spec.Generated({
    id: position.id
  });

  var processed = /** @type {!gpub.spec.Processed} */ ({
    movetree: null,
    generated: gen,
  });

  if (opt.autoRotateGames) {
    // Note: this work because it's a side-affecting operation.
    console.log('Log mah thing');
    mt = glift.orientation.autoRotateGame(mt);
    processed.movetree = mt;
  }

  var mainlineLbl = 'MAINLINE';
  var variationLbl = 'VARIATION';

  gen.labels[mainlineLbl] = [];
  gen.labels[variationLbl] = [];
  gen.labels[gpub.spec.PositionType.GAME_COMMENTARY] = [];

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
      var ip = ipString(pathSpec.treepath);
      var frag = fragString(pathSpec.nextMoves);
      var pos = new gpub.spec.Position({
          id: idGen.next(alias, ip, frag),
          alias: alias,
          initialPosition: ip,
          nextMovesPath: frag,
          labels: [mainlineLbl, gpub.spec.PositionType.GAME_COMMENTARY]
      })
      gen.positions.push(pos);
      gen.labels[mainlineLbl].push(pos.id);
      gen.labels[gpub.spec.PositionType.GAME_COMMENTARY].push(pos.id);

      varPathBuffer = varPathBuffer.concat(
          gpub.spec.variationPaths(mt));
      for (var i = 0; i < varPathBuffer.length; i++) {
        var path = varPathBuffer[i];
        var mtz = mt.getTreeFromRoot(path);
        var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
        var ipz = ipString(varPathSpec.treepath);
        var fragz = fragString(varPathSpec.nextMoves);
        var varPos = new gpub.spec.Position({
            id: idGen.next(alias, ipz, fragz),
            alias: alias,
            initialPosition: ipz,
            nextMovesPath: fragz,
            labels: [variationLbl, gpub.spec.PositionType.GAME_COMMENTARY],
        });
        gen.positions.push(varPos);
        gen.labels[variationLbl].push(varPos.id);
        gen.labels[gpub.spec.PositionType.GAME_COMMENTARY].push(varPos.id);
      }
      varPathBuffer = [];
    }
    // Travel down along the mainline. Advance both the node and the movetree
    // itself. It's worth noting that getChild() returns null if there are no
    // children, thus terminating flow.
    node = node.getChild(0);
    mt.moveDown();
  }

  if (processed.movetree) {
    processed.movetree = processed.movetree.getTreeFromRoot();
  }

  return processed;
};

/**
 * Get the next-move treepaths for a particular root node.
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
