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

  // test('Create: one simple game, with variation', function() {
    // var out = spec.create([
      // '(;GM[1]AW[aa]AB[ba];B[bb](;W[ab]C[The End!])(;W[ac]C[Surprise!]))'
      // ], defaultOptions);
    // var outcol = out.sgfCollection;
    // deepEqual(outcol.length, 2);
    // deepEqual(outcol[0], spec._createExample('sgf:0', [], '0.0', 'AUTO'));
    // deepEqual(outcol[1], spec._createExample('sgf:0', [0], '1', 'AUTO'));
  // });

  // test('Create: Problem set', function() {
    // var out = spec.create([
        // '(;GM[1]AW[aa]AB[ba];B[bb];W[cc](;B[ab]C[Correct!])(;W[ac]C[Surprise!]))'
      // ], problemSetOpts);
    // ok(out);
    // deepEqual(out.sgfDefaults.widgetType, 'STANDARD_PROBLEM');
    // var outcol = out.sgfCollection;
    // deepEqual(outcol.length, 1);
    // deepEqual(outcol[0], {
      // 'alias': 'sgf:0',
      // 'boardRegion': 'AUTO'
    // });
  // });
})();
