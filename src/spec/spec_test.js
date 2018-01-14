(function() {
  module('gpub.spec.specTest');

  test('create spec', function() {
    var cache = new gpub.util.MoveTreeCache();
    var sgf = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var o = new gpub.Options({
      games: {'sgf-1': sgf},
      grouping: [
        'sgf-1',
      ],
    }, cache);
    var spec = gpub.spec.create(o);

    var gameId = 'sgf-1';
    var mapping = {};
    mapping[gameId] = sgf;
    deepEqual(spec.sgfMapping, mapping);

    var grouping = spec.rootGrouping;
    ok(grouping);
    deepEqual(grouping.groupings.length, 0);
    deepEqual(grouping.positionType, gpub.spec.PositionType.GAME_COMMENTARY);
    deepEqual(grouping.positions.length, 1);

    var pos = grouping.positions[0];
    deepEqual(pos.gameId, gameId);
    deepEqual(pos.id, gameId);
    deepEqual(pos.initialPosition, undefined);
    deepEqual(pos.nextMovesPath, undefined);
    deepEqual(pos.boardRegion, undefined);
    deepEqual(pos.positionType, undefined);
  });

  test('create spec: two games', function() {
    var cache = new gpub.util.MoveTreeCache();
    var sgf1 = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var sgf2 = '(;GM[1]GN[foo]AW[aa]AB[ba];B[bb];W[cc](;B[ab]'
        + 'C[Correct!])(;W[ac]C[Surprise!]))';
    var o = new gpub.Options({
      games: {'sgf-1': sgf1, 'sgf-2': sgf2},
      grouping: ['sgf-1', 'sgf-2'],
    });

    var spec = gpub.spec.create(o, cache);
    var gameId1 = 'sgf-1', gameId2 = 'sgf-2';
    var mapping = {};
    mapping[gameId1] = sgf1;
    mapping[gameId2] = sgf2;
    deepEqual(spec.sgfMapping, mapping);
    deepEqual(spec.rootGrouping.positions.length, 2);
    deepEqual(spec.rootGrouping.positions[0].gameId, gameId1);
    deepEqual(spec.rootGrouping.positions[1].gameId, gameId2);
  })

  test('Creating a Processed spec with problems', function() {
    var cache = new gpub.util.MoveTreeCache();
    var sgfs = testdata.sgfs;
    var opts = new gpub.Options({
      games: {
        'sgf-1': sgfs.trivialproblem,
        'sgf-2': sgfs.veryeasy,
        'sgf-3': sgfs.easy,
        'sgf-4': sgfs.realproblem,
        'sgf-5': sgfs.complexproblem,
        'sgf-6': sgfs.gogameguruHard,
      },
      grouping: [
        'sgf-1', 'sgf-2', 'sgf-3', 'sgf-4', 'sgf-5', 'sgf-6',
      ],
      specOptions: {
        positionType: gpub.spec.PositionType.PROBLEM,
      }
    });
    var spec = gpub.spec.create(opts, cache);
    ok(spec, 'spec should be defined')
    deepEqual(Object.keys(spec.sgfMapping).length, 6, 'should have 6 games');
    deepEqual(spec.sgfMapping['sgf-1'], opts.games['sgf-1'])
    deepEqual(spec.sgfMapping['sgf-2'], opts.games['sgf-2'])
    deepEqual(spec.rootGrouping.positions.length, 6, 'should have 6 positions');

    var proc = gpub.spec.process(spec, cache);
    ok(proc, 'processed spec should be defined');
    var secondId = 'sgf-2';
    var sgf2Labels = proc.rootGrouping.generated['sgf-2'].positionLabels();
    deepEqual(sgf2Labels['CORRECT'].length, 1,
        'should have one correct answer')
    var rootId = sgf2Labels['PROBLEM_ROOT'][0];
    deepEqual(proc.rootGrouping.generated['sgf-2'].positions[0].id, rootId);
    var corId = sgf2Labels['CORRECT'][0];
    deepEqual(proc.rootGrouping.generated['sgf-2'].positions[1].id, corId);

    var json = proc.serializeJson();
    ok(json, 'should be defined')

    deepEqual(gpub.spec.Spec.deserializeJson(json), proc);
  });

  var oneVar = '(;GM[1]AW[aa]AB[ba];B[bb](;W[ab]C[The End!])(;W[ac]C[Surprise!]))';
  test('Create: one simple game, with variation', function() {
    var cache = new gpub.util.MoveTreeCache();
    var opts = new gpub.Options({
      games: {'sgf-1': oneVar},
      grouping: ['sgf-1'],
    });
    var spec = gpub.spec.create(opts, cache);
    deepEqual(Object.keys(spec.sgfMapping).length, 1, 'Should have 1 sgf');

    var proc = gpub.spec.process(spec, cache);
    ok(proc, 'should be defined');
    var gen = proc.rootGrouping.generated['sgf-1'];
    var genLabels = gen.positionLabels();

    deepEqual(genLabels['MAINLINE'].length, 1);
    var mainId = genLabels['MAINLINE'][0];
    deepEqual(gen.positions[0].id, mainId, 'main id');
    deepEqual(gen.positions[0].initialPosition, '0', 'main init');
    deepEqual(gen.positions[0].nextMovesPath, '0:2', 'main next moves');

    deepEqual(genLabels['VARIATION'].length, 1);
    var varId = genLabels['VARIATION'][0];
    deepEqual(gen.positions[1].id, varId, 'var id');
    deepEqual(gen.positions[1].initialPosition, '1', 'var init');
    deepEqual(gen.positions[1].nextMovesPath, '1', 'var next moves');
  });

  test('Create with IdGenType=Path', function() {
    var cache = new gpub.util.MoveTreeCache();
    var opts = new gpub.Options({
      games: {'sgf-1': oneVar},
      grouping: ['sgf-1'],
    });
    var spec = gpub.spec.create(opts, cache);
    var proc = gpub.spec.process(spec, cache);
    var gen = proc.rootGrouping.generated['sgf-1'];
    deepEqual(gen.positions[0].id, 'sgf-1__0__0-2')
    deepEqual(gen.positions[1].id, 'sgf-1__1__1')
  });

  test('Create with IdGenType=Sequential', function() {
    var cache = new gpub.util.MoveTreeCache();
    var opts = new gpub.Options({
      games: {'sgf-1': oneVar},
      grouping: ['sgf-1'],
      specOptions: {
        idGenType: 'SEQUENTIAL',
      }
    });
    var spec = gpub.spec.create(opts, cache);
    var proc = gpub.spec.process(spec, cache);
    var gen = proc.rootGrouping.generated['sgf-1'];
    deepEqual(gen.positions[0].id, 'sgf-1-0')
    deepEqual(gen.positions[1].id, 'sgf-1-1')
  });

  test('Create with IdGenType=Path, gggEasy44', function() {
    var cache = new gpub.util.MoveTreeCache();
    var opts = new gpub.Options({
      games: {'sgf-1': testdata.sgfs.gggEasy44},
      grouping: ['sgf-1'],
      specOptions: {
        positionType: gpub.spec.PositionType.PROBLEM,
      }
    });
    var spec = gpub.spec.create(opts, cache);
    var proc = gpub.spec.process(spec, cache);
    ok(proc, 'must have succeeded.');
  });
})();
