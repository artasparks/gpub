
/**
 * @param {!glift.rules.MoveTree} mt
 * @param {!gpub.spec.Position} position
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.api.SpecOptions} opt
 * @return {!gpub.spec.Generated} return the generated position.
 */
gpub.spec.processProblems = function(mt, position, idGen, opt) {
  var gen = new gpub.spec.Generated({
    id: position.id
  });
  return gen;
};
