(function() {
  module('gpub.spec.specTest');
  var spec = gpub.spec;

  test('serialize', function() {
    var sgf1 = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var sgf2 = '(;GM[1]AW[aa]AB[ba];B[bb]C[Another End!])';

    var sgfs = [{
        alias: 'foo',
        sgfType: gpub.spec.SgfType.EXAMPLE,
      },{
        alias: 'bar',
        sgfType: gpub.spec.SgfType.PROBLEM,
      }]
    var spec = new gpub.spec.Spec({
      grouping: {
        sgfs: sgfs
      },
      sgfMapping: {
        'foo': sgf1,
        'bar': sgf2
      }
    });

    var json = spec.serializeJson();
    ok(json, 'JSON serialization should be defined');

    var obj = JSON.parse(json);
    deepEqual(obj.sgfMapping, spec.sgfMapping, 'mapping');
    deepEqual(obj.grouping.subGroupings, [], 'subGroupings');
    deepEqual(obj.grouping.sgfs, sgfs, 'sgfs');

    var parsed = gpub.spec.Spec.deserializeJson(json);
    deepEqual(spec, parsed, 'Round trip should produce same results');
  });
})()
