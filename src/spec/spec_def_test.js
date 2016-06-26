(function() {
  module('gpub.spec.specTest');
  var spec = gpub.spec;

  test('Serialize spec', function() {
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
      rootGrouping: {
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
    deepEqual(obj.rootGrouping.groupings, [], 'groupings');
    deepEqual(obj.rootGrouping.sgfs, sgfs, 'sgfs');

    var parsed = gpub.spec.Spec.deserializeJson(json);
    deepEqual(spec, parsed, 'Round trip should produce same results');
  });

  test('Deserialize spec', function() {
    var sgf = '(;GM[1])'
    var testSpec = '{\n'
        + '  \"rootGrouping\": {'
        + '  },'
        + '  \"sgfMapping\": {'
        + '     \"foo\": \"' + sgf + '\"\n'
        + '  }\n'
        + '}\n'
    var spec = gpub.spec.Spec.deserializeJson(testSpec);
    deepEqual(spec.sgfMapping['foo'], sgf);
  });
})()
