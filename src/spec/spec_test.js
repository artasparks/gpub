gpub.spec.specTest  = function() {
  module('gpub.spec.specTest');
  var spec = gpub.spec;
  var defaultOptions = gpub.processOptions();

  test('fromSgfs: Default Case', function() {
    var out = spec.fromSgfs([], defaultOptions);
    deepEqual(out.divId, null);
    deepEqual(out.sgfCollection, []);
    deepEqual(out.sgfMapping, {});
    deepEqual(out.metadata, {});
  });

  test('createExample', function() {
    var out = spec.createExample('zed', [0,0,0], [0,1]);
    deepEqual(out.widgetType, 'EXAMPLE');
    deepEqual(out.alias, 'zed');
    deepEqual(out.initialPosition, '3');
    deepEqual(out.nextMovesPath, '0.1');
    deepEqual(out.boardRegion, 'ALL');
  });

  test('fromSgfs: one simple game', function() {
    var out = spec.fromSgfs([
      '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])'
      ], stypes.GAME_BOOK);
    var outcol = out.sgfCollection;
    deepEqual(outcol.length, 1);
    deepEqual(outcol[0], spec.createExample('sgf:0', [], [0]));
  });

  test('fromsGfs: one simple game, with variation', function() {
    var out = spec.fromSgfs([
      '(;GM[1]AW[aa]AB[ba];B[bb](;W[ab]C[The End!])(;W[ac]C[Surprise!]))'
      ]);
    var outcol = out.sgfCollection;
    deepEqual(outcol.length, 2);
    deepEqual(outcol[0], spec.createExample('sgf:0', [], '0.0'));
    deepEqual(outcol[1], spec.createExample('sgf:0', [0], '1'));
  });
};
