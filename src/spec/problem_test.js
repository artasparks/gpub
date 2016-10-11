(function() {
  module('gpub.spec.problem');

  test('That problem generation works', function() {
    var easySgf = testdata.sgfs.easy;
    var mt = glift.rules.movetree.getFromSgf(easySgf);
    var id = 'easy-id';
    var idGen = new gpub.spec.IdGen(id);
    var pos = new gpub.spec.Position({
      id: id,
      alias: id,
    });
    var generated = gpub.spec.processProblems(
        mt, pos, idGen, new gpub.api.SpecOptions());
    ok(generated, 'Should be defined');
    deepEqual(generated.id, id);
    deepEqual(generated.positionType, gpub.spec.PositionType.EXAMPLE);
    deepEqual(generated.positions.length, 8);

    var root = new gpub.spec.Position({
      id: id + '-' + 0,
      alias: id,
      initialPosition: '0',
    });
    deepEqual(generated.labels['PROBLEM_ROOT'].length, 1, 'num problem roots');
    deepEqual(generated.labels['PROBLEM_ROOT'][0], root.id, 'problem root id');
    deepEqual(generated.positions[0], root, 'problem root pos');

    var indet = new gpub.spec.Position({
      id: id + '-' + 3,
      alias: id,
      initialPosition: '0.1',
      nextMovesPath: '0'
    });
    deepEqual(generated.labels['INDETERMINATE'].length, 1, 'num indeterminate');
    deepEqual(generated.labels['INDETERMINATE'][0], indet.id, 'indeterminate id');
    deepEqual(generated.positions[3], indet, 'indet obj');

    var incor = new gpub.spec.Position({
      id: id + '-' + 1,
      alias: id,
      initialPosition: '0',
      nextMovesPath: '0:2'
    });
    deepEqual(generated.labels['INCORRECT'].length, 3, 'num incorrect');
    deepEqual(generated.labels['INCORRECT'][0], incor.id, 'incorrect id');
    deepEqual(generated.positions[1], incor, 'incor obj');

    var cor = new gpub.spec.Position({
      id: id + '-' + 2,
      alias: id,
      initialPosition: '0',
      nextMovesPath: '1'
    });
    deepEqual(generated.labels['CORRECT'].length, 3);
    deepEqual(generated.labels['CORRECT'][0], cor.id, 'correct id');
    deepEqual(generated.positions[2], cor, 'cor obj');
  });
})();
