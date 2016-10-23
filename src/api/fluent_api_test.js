(function() {
  module('gpub.api.fluentApiTest');
  var sgfs = testdata.sgfs;

  test('Fluent API: Spec Creation', function() {
    var veasy = testdata.sgfs.veryeasy;
    var triv = testdata.sgfs.trivialproblem;
    var opt = {
      sgfs: [veasy, triv],
      ids: ['veasy', 'triv'],
      specOptions: {
        positionType: 'PROBLEM',
      },
    };
    var id0 = opt.ids[0];
    var id1 = opt.ids[1];

    var api = gpub.init(opt);
    ok(api, 'must be defined');
    deepEqual(api.options().sgfs, opt.sgfs);
    deepEqual(api.options().ids, opt.ids);

    api.createSpec();
    var spec = api.spec();
    deepEqual(spec.version, gpub.spec.SpecVersion.V1);
    var expMap = {};
    expMap[id0] = opt.sgfs[0];
    expMap[id1] = opt.sgfs[1];
    deepEqual(spec.sgfMapping, expMap);
    deepEqual(spec.rootGrouping.positions.length, 2);
    deepEqual(spec.rootGrouping.positionType, 'PROBLEM');
    deepEqual(api.diagrams_, null);

    var expCache = {};
    expCache[id0] = glift.parse.fromString(opt.sgfs[0]);
    expCache[id1] = glift.parse.fromString(opt.sgfs[1]);
    deepEqual(api.cache_.sgfMap, expMap, 'cache sgf map');
    deepEqual(api.cache_.get(id0).toSgf(), expCache[id0].toSgf(), 'sgf1 text');
    deepEqual(api.cache_.get(id1).toSgf(), expCache[id1].toSgf(), 'sgf2 text');
  });

  test('Fluent API: Full Diagram Creation', function() {
    var sgf = testdata.gogameguru_commentary;
    var api = gpub.init({
      sgfs: [sgf],
      diagramOptions: {
        maxDiagrams: 20,
      }})
      .createSpec()
      .processSpec()
      .renderDiagrams();

    var diag = api.diagrams();
    ok(diag, 'Diagrams must be defined');
    deepEqual(diag.diagrams.length, 20);
  });
})();
