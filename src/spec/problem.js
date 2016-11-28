
/**
 * Process a problem position, creating a generated return object.
 * @param {!glift.rules.MoveTree} mt
 * @param {!gpub.spec.Position} position
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.api.SpecOptions} opt
 * @return {!gpub.spec.Generated} return the generated position.
 * @package
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

  var initPos = mt.treepathToHere();

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
    console.log('PrevPos:::' + JSON.stringify(prevPos));
    console.log('SincePrevPos:::' + JSON.stringify(sincePrevPos));
    var newCor = glift.rules.problems.positionCorrectness(movetree, conditions);
    // Record positions when
    // - There are comments
    // - We're at the end of a branch.
    // - We're at the root
    if (movetree.properties().getOneValue(glift.rules.prop.C) ||
        movetree.node().numChildren() === 0 ||
        (prevPos.length === initPos.length && sincePrevPos.length === 0)) {
      var label = newCor;
      if (prevPos.length === 0 && sincePrevPos.length === 0) {
        label = 'PROBLEM_ROOT';
      }
      if (!gen.labels[label]) {
        gen.labels[label] = [];
      }
      var ip = ipString(prevPos);
      var frag = fragString(sincePrevPos);
      console.log(ip + '__' + frag);
      var pos = new gpub.spec.Position({
        id: idGen.next(alias, ip, frag),
        alias: alias,
        initialPosition: ip,
        nextMovesPath: frag,
        labels: [label],
      });
      gen.labels[label].push(pos.id);
      outPositions.push(pos);
      prevPos = sincePrevPos;
      sincePrevPos = [];
    }
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      var nmt = movetree.newTreeRef();
      var pp = sincePrevPos.slice();
      console.log('PP:::' + JSON.stringify(pp));
      console.log('PrevPos:::' + JSON.stringify(prevPos));
      pp.push(i);
      nmt.moveDown(i);
      // Note: there's no indicator when to break here. In other words, we
      // assume that the whole subtree is part of the problem, which might not
      // be true, but either we make this assumption or we introduce arbitrary
      // constraints.
      pathRecurse(nmt, prevPos, pp, newCor);
    }
  };

  pathRecurse(mt, initPos, [], glift.enums.problemResults.INDETERMINATE);
  gen.positions = outPositions;
  return gen;
};
