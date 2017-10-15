(function() {
  module('gpub.book.bookMakerTest');

  var emptyRendererd = {
    metadata: [],
    diagrams: []
  };
  var emptyGrouping = new gpub.spec.Grouping();
  var emptyMaker = new gpub.book.BookMaker(emptyGrouping, emptyRendererd, {});

  test('That full creation works', function() {
    // First create the spec / rendered objs.
    var problem = testdata.sgfs.veryeasy
    var maker = gpub.init({
        sgfs: {'sgf-1': problem},
        grouping: ['sgf-1'],
        specOptions: {
          positionType: 'PROBLEM',
        },
      })
      .createSpec()
      .processSpec()
      .renderDiagrams()
      .bookMaker();

    ok(maker);
    deepEqual(maker.posIds_.length, 2)
    deepEqual(maker.idFromIdx(0), 'sgf-1__0');
    deepEqual(maker.idFromIdx(1), 'sgf-1__0__0-6');
    deepEqual(maker.idFromIdx(2), '', 'out of bounds');
    deepEqual(maker.seenPos_, 1);

    for (var i = 0; i < maker.posIds_.length; i++) {
      config = maker.getConfig(maker.idFromIdx(i));
      deepEqual(config.id, maker.idFromIdx(i), i + ') id');
      deepEqual(config.basePosIndex, 1, i + ') base index');
      ok(config.diagram, i + ') diagram');
      ok(config.metadata.id, config.id, i + ') metadata');
      ok(config.position.id, config.id, i + ') position spec');
    }

    var id = maker.idFromIdx(0);
    var config = maker.getConfig(id);
    ok(config)
    deepEqual(config.id, id, 'ids must be equal');
    ok(config.fullAnnotation(), 'annotation must be defined');
    deepEqual(typeof config.collisionAnnotation(), 'string');
    ok(config.moveNumberAnnotation(), 'annotation must be defined');
    ok(config.hasLabel('PROBLEM_ROOT'), 'must be problem root');

    id = maker.idFromIdx(1);
    config = maker.getConfig(id);
    ok(config)
    deepEqual(config.id, id, 'ids must be equal');
    ok(config.fullAnnotation(), 'annotation must be defined');
    deepEqual(typeof config.collisionAnnotation(), 'string');
    ok(config.moveNumberAnnotation(), 'annotation must be defined');
    ok(config.hasLabel('CORRECT'), 'must be correct');
  });

  test('Latex Helper', function() {
    var l = emptyMaker.latexHelper();
    ok(l, 'latex helper must be defined');
    var header = l.pdfx1aHeader({
      title: 'foo', colorProfileFile: 'bar', pageSize: 'LETTER'
    });
    ok(/foo/.test(header))
  })
})();
