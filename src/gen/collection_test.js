gpub.gen.collectionTest = function() {
  module('gpub.gen.collectionTest');
  var coll = gpub.gen.collection;

  test('fromSgfGames: Default Case', function() {
    var out = coll.fromGames();
    deepEqual(out.divId, null);
    deepEqual(out.sgfCollection, []);
    deepEqual(out.sgfMapping, {});
  });

  test('createExample', function() {
    var out = coll.createExample('zed', [0,0,0], [0,1]);
    deepEqual(out.widgetType, 'EXAMPLE');
    deepEqual(out.alias, 'zed');
    deepEqual(out.initialPosition, '3');
    deepEqual(out.nextMovesPath, '0.1');
    deepEqual(out.boardRegion, 'ALL');
  });

  test('fromGames: one simple game', function() {
    var out = coll.fromGames([
      '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])'
    ]);
    var outcol = out.sgfCollection;
    deepEqual(outcol.length, 1);
    deepEqual(outcol[0], coll.createExample('sgf:0', [], [0]));
  });

  test('fromGames: one simple game, with variation', function() {
    var out = coll.fromGames([
      '(;GM[1]AW[aa]AB[ba];B[bb](;W[ab]C[The End!])(;W[ac]C[Surprise!]))'
    ]);
    var outcol = out.sgfCollection;
    deepEqual(outcol.length, 2);
    deepEqual(outcol[0], coll.createExample('sgf:0', [], '0.0'));
    deepEqual(outcol[1], coll.createExample('sgf:0', [0], '1'));
  });
};
