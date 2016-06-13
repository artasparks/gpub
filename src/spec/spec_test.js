(function() {
  module('gpub.spec.specTest');
  var spec = gpub.spec;

  // var defaultOptions = gpub.processOptions();
  // var problemSetOpts = gpub.processOptions({
    // bookPurpose: gpub.bookPurpose.PROBLEM_SET
  // });

  test('Get processor', function() {
    for (var key in gpub.spec.SgfType) {
      var proc = gpub.spec.processor(key);
      ok(proc, 'Processor not defined for key: ' + proc);
    }
  });

  test('create spec', function() {
    var sgf = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var o = gpub.processOptions({
      sgfs: [sgf]
    });
    var spec = gpub.spec.create(o);

    var alias = 'sgf:0';
    var mapping = {};
    mapping[alias] = sgf;
    deepEqual(spec.sgfMapping, mapping);

    var grouping = spec.grouping;
    ok(grouping);
    deepEqual(grouping.subGroupings.length, 0);
    deepEqual(grouping.boardRegion, glift.enums.boardRegions.AUTO);
    deepEqual(grouping.sgfType, gpub.spec.SgfType.GAME_COMMENTARY);
    deepEqual(grouping.sgfs.length, 1);

    var sgf = grouping.sgfs[0];
    deepEqual(sgf.id, alias);
    deepEqual(sgf.alias, alias);
    deepEqual(sgf.initialPosition, undefined);
    deepEqual(sgf.nextMovesPath, undefined);
    deepEqual(sgf.boardRegion, undefined);
    deepEqual(sgf.sgfType, undefined);
  });

  test('create spec: two sgfs', function() {
    var sgf1 = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var sgf2 = '(;GM[1]GN[foo]AW[aa]AB[ba];B[bb];W[cc](;B[ab]'
        + 'C[Correct!])(;W[ac]C[Surprise!]))';
    var o = gpub.processOptions({
      sgfs: [sgf1, sgf2]
    });

    var spec = gpub.spec.create(o);
    var alias1 = 'sgf:0', alias2 = 'foo:1';
    var mapping = {};
    mapping[alias1] = sgf1;
    mapping[alias2] = sgf2;
    deepEqual(spec.sgfMapping, mapping);
    deepEqual(spec.grouping.sgfs.length, 2);
    deepEqual(spec.grouping.sgfs[0].alias, alias1);
    deepEqual(spec.grouping.sgfs[1].alias, alias2);
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
