(function() {
  module('gpub.spec.specTest');
  var spec = gpub.spec;

  test('Serialize spec', function() {
    var sgf1 = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var sgf2 = '(;GM[1]AW[aa]AB[ba];B[bb]C[Another End!])';

    var positions = [{
        alias: 'foo',
        id: 'foo',
        positionType: gpub.spec.PositionType.EXAMPLE,
      },{
        alias: 'bar',
        id: 'bar',
        positionType: gpub.spec.PositionType.PROBLEM,
      }]
    var spec = new gpub.spec.Spec({
      rootGrouping: {
        positions: positions
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
    deepEqual(obj.rootGrouping.positions, positions, 'positions');

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
