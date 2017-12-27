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
        mt, pos, idGen, new gpub.opts.SpecOptions()).generated;
    ok(generated, 'Should be defined');
    deepEqual(generated.id, id);
    deepEqual(generated.positionType, gpub.spec.PositionType.EXAMPLE);
    deepEqual(generated.positions.length, 8);

    var genLabels = generated.positionLabels();

    var root = new gpub.spec.Position({
      id: id + '-' + 0,
      alias: id,
      initialPosition: '0',
      labels: ['PROBLEM_ROOT', 'PROBLEM'],
    });
    deepEqual(genLabels['PROBLEM_ROOT'].length, 1, 'num problem root lbl');
    deepEqual(genLabels['PROBLEM'].length, 8, 'num problem lbl');
    deepEqual(genLabels['PROBLEM_ROOT'][0], root.id, 'problem root id');
    deepEqual(generated.positions[0], root, 'problem root pos');

    var indet = new gpub.spec.Position({
      id: id + '-' + 3,
      alias: id,
      initialPosition: '0.1',
      nextMovesPath: '0',
      labels: ['INDETERMINATE', 'PROBLEM'],
    });
    deepEqual(genLabels['INDETERMINATE'].length, 1, 'num indeterminate');
    deepEqual(genLabels['INDETERMINATE'][0], indet.id, 'indeterminate id');
    deepEqual(generated.positions[3], indet, 'indet obj');

    var incor = new gpub.spec.Position({
      id: id + '-' + 1,
      alias: id,
      initialPosition: '0',
      nextMovesPath: '0:2',
      labels: ['INCORRECT', 'PROBLEM'],
    });
    deepEqual(genLabels['INCORRECT'].length, 3, 'num incorrect');
    deepEqual(genLabels['INCORRECT'][0], incor.id, 'incorrect id');
    deepEqual(generated.positions[1], incor, 'incor obj');

    var cor = new gpub.spec.Position({
      id: id + '-' + 2,
      alias: id,
      initialPosition: '0',
      nextMovesPath: '1',
      labels: ['CORRECT', 'PROBLEM'],
    });
    deepEqual(genLabels['CORRECT'].length, 3);
    deepEqual(genLabels['CORRECT'][0], cor.id, 'correct id');
    deepEqual(generated.positions[2], cor, 'cor obj');
  });
})();
