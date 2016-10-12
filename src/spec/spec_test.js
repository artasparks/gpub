(function() {
  module('gpub.spec.specTest');

  test('create spec', function() {
    var sgf = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var o = gpub.processOptions({
      sgfs: [sgf]
    });
    var spec = gpub.spec.create(o);

    var alias = 'sgf-1';
    var mapping = {};
    mapping[alias] = sgf;
    deepEqual(spec.sgfMapping, mapping);

    var grouping = spec.rootGrouping;
    ok(grouping);
    deepEqual(grouping.groupings.length, 0);
    deepEqual(grouping.positionType, gpub.spec.PositionType.GAME_COMMENTARY);
    deepEqual(grouping.positions.length, 1);

    var pos = grouping.positions[0];
    deepEqual(pos.alias, alias);
    deepEqual(pos.id, alias);
    deepEqual(pos.initialPosition, undefined);
    deepEqual(pos.nextMovesPath, undefined);
    deepEqual(pos.boardRegion, undefined);
    deepEqual(pos.positionType, undefined);
  });

  test('create spec: two sgfs', function() {
    var sgf1 = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var sgf2 = '(;GM[1]GN[foo]AW[aa]AB[ba];B[bb];W[cc](;B[ab]'
        + 'C[Correct!])(;W[ac]C[Surprise!]))';
    var o = gpub.processOptions({
      sgfs: [sgf1, sgf2]
    });

    var spec = gpub.spec.create(o);
    var alias1 = 'sgf-1', alias2 = 'foo-2';
    var mapping = {};
    mapping[alias1] = sgf1;
    mapping[alias2] = sgf2;
    deepEqual(spec.sgfMapping, mapping);
    deepEqual(spec.rootGrouping.positions.length, 2);
    deepEqual(spec.rootGrouping.positions[0].alias, alias1);
    deepEqual(spec.rootGrouping.positions[1].alias, alias2);
  })

  test('Creating a Processed spec with two problems', function() {
    var sgfs = testdata.sgfs;
    var opts = new gpub.Options({
      sgfs: [
        sgfs.trivialproblem,
        sgfs.veryeasy,
        sgfs.easy,
        sgfs.realproblem,
        sgfs.complexproblem,
        sgfs.gogameguruHard,
      ],
      specOptions: {
        defaultPositionType: gpub.spec.PositionType.PROBLEM,
      }
    });
    var spec = gpub.spec.create(opts);
    ok(spec, 'spec should be defined')
    deepEqual(Object.keys(spec.sgfMapping).length, 6, 'should have 6 sgfs');
    deepEqual(spec.sgfMapping['sgf-1'], opts.sgfs[0])
    deepEqual(spec.sgfMapping['sgf-2'], opts.sgfs[1])
    deepEqual(spec.rootGrouping.positions.length, 6, 'should have 6 positions');

    var proc = gpub.spec.process(spec);
    ok(proc, 'processed spec should be defined');
    var secondId = 'sgf-2';
    deepEqual(proc.rootGrouping.generated['sgf-2'].labels['CORRECT'].length, 1,
        'should have one correct answer')
    var rootId = proc.rootGrouping.generated['sgf-2'].labels['PROBLEM_ROOT'][0];
    deepEqual(proc.rootGrouping.generated['sgf-2'].positions[0].id, rootId);
    var corId = proc.rootGrouping.generated['sgf-2'].labels['CORRECT'][0];
    deepEqual(proc.rootGrouping.generated['sgf-2'].positions[1].id, corId);

    var json = proc.serializeJson();
    ok(json, 'should be defined')

    deepEqual(gpub.spec.Spec.deserializeJson(json), proc);
  });

  test('Create: one simple game, with variation', function() {
    var opts = new gpub.Options({
      sgfs: [
        '(;GM[1]AW[aa]AB[ba];B[bb](;W[ab]C[The End!])(;W[ac]C[Surprise!]))'
      ]
    });
    var spec = gpub.spec.create(opts);
    deepEqual(Object.keys(spec.sgfMapping).length, 1, 'Should have 1 sgf');

    var proc = gpub.spec.process(spec);
    ok(proc, 'should be defined');
    var gen = proc.rootGrouping.generated['sgf-1'];

    deepEqual(gen.labels['MAINLINE'].length, 1);
    var mainId = gen.labels['MAINLINE'][0];
    deepEqual(gen.positions[0].id, mainId, 'main id');
    deepEqual(gen.positions[0].initialPosition, '0', 'main init');
    deepEqual(gen.positions[0].nextMovesPath, '0:2', 'main next moves');

    deepEqual(gen.labels['VARIATION'].length, 1);
    var varId = gen.labels['VARIATION'][0];
    deepEqual(gen.positions[1].id, varId, 'var id');
    deepEqual(gen.positions[1].initialPosition, '1', 'var init');
    deepEqual(gen.positions[1].nextMovesPath, '1', 'var next moves');
  });
})();
