
/**
 * @param {!glift.rules.MoveTree} mt
 * @param {!gpub.spec.Position} position
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.api.SpecOptions} opt
 * @return {!gpub.spec.Generated} return the generated position.
 */
gpub.spec.processProblems = function(mt, position, idGen, opt) {
  var outPositions = [];
  var conditions = opt.problemConditions;
  var alias = position.alias;
  mt = mt.newTreeRef();

  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;

  var gen = new gpub.spec.Generated({
    id: position.id
  });

  var labels = {};

  /**
   * @param {!glift.rules.MoveTree} movetree
   * @param {!glift.rules.Treepath} prevPos Path to the previous position
   *    recorded.
   * @param {!glift.rules.Treepath} sincePrevPos Path since the previous
   *    position recorded.
   * @param {!glift.enums.problemResults} correctness whether position is
   *    considered 'correct'.
   *
   * Note: The full path to the current position should be equal to
   * prevPos.concat(sincePrevPos).
   */
  var pathRecurse = function(movetree, prevPos, sincePrevPos, correctness) {
    var newCor = glift.rules.problems.positionCorrectness(movetree, conditions);
    // Record positions that have comments or
    if (movetree.properties().getOneValue(glift.rules.prop.C) ||
        newCor !== correctness ||
        (prevPos.length === 0 && sincePrevPos.length === 0)) {
      var pos = new gpub.spec.Position({
        id: idGen.next(),
        alias: alias,
        initialPosition: ipString(prevPos),
        nextMovesPath: fragString(sincePrevPos),
      });
      if (prevPos.length === 0 && sincePrevPos.length === 0 ) {
        var label = 'PROBLEM_ROOT';
      } else {
        var label = newCor;
      }
      if (!gen.labelMap[label]) {
        gen.labelMap[label] = [];
      }
      gen.labelMap[label].push(pos.id);
      outPositions.push(pos);
      prevPos = sincePrevPos;
    }
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      var nmt = movetree.newTreeRef();
      var pp = sincePrevPos.slice()
      pp.push(i);
      nmt.moveDown(i);
      // Note: there's no indicator when to break here. In other words, we
      // assume that the whole subtree is part of the problem, which might not
      // be true, but either we make this assumption or we introduce arbitrary
      // constraints.
      pathRecurse(nmt, prevPos, pp, newCor);
    }
  };

  pathRecurse(mt, mt.treepathToHere(), [], glift.enums.problemResults.INDETERMINATE);
  gen.positions = outPositions;
  return gen;
};
