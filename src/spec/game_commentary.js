goog.provide('gpub.spec.GameCommentary');

/**
 * @param {!glift.rules.MoveTree} mt The movetree for the position.
 * @param {!gpub.spec.Position} position The position used for spec generation.
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.spec.PositionOverrider} overrider
 * @param {!gpub.opts.SpecOptions} opt
 * @return {!gpub.spec.Processed} processed positions.
 * @package
 */
gpub.spec.processGameCommentary = function(mt, position, idGen, overrider, opt) {
  var outPositions = [];
  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;
  var gameId = position.gameId;
  mt = mt.newTreeRef();

  var maxDiagramDistance = opt.maxDiagramDistance;

  var gen = new gpub.spec.Generated({
    id: position.id
  });

  var processed = /** @type {!gpub.spec.Processed} */ ({
    // Pass back a movetree only if it's modified (i.e., rotation)
    movetree: null,
    generated: gen,
  });

  if (opt.autoRotateGames) {
    // Note: is a side-affecting operation.
    mt = glift.orientation.autoRotateGame(mt);
    processed.movetree = mt;
  }

  // Should be empty now.
  var initPos = mt.treepathToHere();
  var mainlineLbl = 'MAINLINE';
  var variationLbl = 'VARIATION';
  var pathRecurse = function(movetree, prevPos, sincePrevPos, sinceLastDiagram) {
    var onMainline = movetree.onMainline();
    // Process positions that are terminal or have a comment.
    if (movetree.properties().getComment() ||
        movetree.node().numChildren() === 0 ||
        sinceLastDiagram >= maxDiagramDistance) {
      // We're breaking. Mark the indicator as such.
      sinceLastDiagram = 0;

      var lbl = mainlineLbl;
      if (!onMainline) {
        lbl = variationLbl;
      }
      var ip = ipString(prevPos);
      var frag = fragString(sincePrevPos);

      // Apply overrides, if necessary
      var moveNum = onMainline ? prevPos.length + sincePrevPos.length : undefined;
      var outPath = overrider.applyOverridesIfNecessary({
        gameId: gameId,
        moveNumber: moveNum,
        initialPosition: ip,
        nextMovesPath: frag,
      }, prevPos, sincePrevPos);
      if (outPath.initialPosition) {
        ip = ipString(outPath.initialPosition);
      }
      if (outPath.nextMovesPath) {
        frag = fragString(outPath.nextMovesPath);
      }

      var pos = new gpub.spec.Position({
        id: idGen.next(gameId, ip, frag),
        gameId: gameId,
        initialPosition: ip,
        nextMovesPath: frag,
        labels: [lbl, gpub.spec.PositionType.GAME_COMMENTARY],
      });
      outPositions.push(pos);
      prevPos = prevPos.concat(sincePrevPos);
      sincePrevPos = [];
    }
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      var nmt = movetree.newTreeRef();
      var pp = prevPos.slice();
      var spp = sincePrevPos.slice();
      nmt.moveDown(i);

      // Here's an arbitrary decision that generally seems like an ok idea that
      // might need to be rethought later: if we transition from the mainline
      // to a variation, the variation should only track the prev-pos from the
      // mainline departure. Preniously, the logic was we would only explor
      // variations when there was a comment on the corresponding mainline
      // branch, which seems weird
      var newOnMainline = nmt.onMainline();
      if (onMainline && newOnMainline !== onMainline) {
        // We've transition from on-mainline to off-mainline. Start over.
        pp = pp.concat(spp);
        spp = [];
      }
      spp.push(i);

      // Users can specify to not use the next-moves path.
      if (!opt.useNextMovesPath) {
        pp = pp.concat(spp);
        spp = [];
      }

      // Note: there's no indicator when to break here. In other words, we
      // assume that the whole subtree is part of the problem, which might not
      // be true, but either we make this assumption or we introduce arbitrary
      // constraints.
      pathRecurse(nmt, pp, spp, sinceLastDiagram+1);
    }
  }

  pathRecurse(mt, initPos, [], 1);
  gen.positions = outPositions;
  return processed;
}
