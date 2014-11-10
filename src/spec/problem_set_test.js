gpub.spec.problemSetTest = function() {
  module('gpub.spec.problemSetTest');

  test('Ensure problem generation', function() {
    var sgf = '(;GM[1]C[foo]AB[aa])';
    var mt = glift.sgf.parse(sgf);
    deepEqual(
        gpub.spec.problemSet.one(mt, 'zed', {region: 'TOP'}),
        {
          alias: 'zed',
          widgetType: 'STANDARD_PROBLEM',
          boardRegion: 'TOP'
        });

    deepEqual(
        gpub.spec.problemSet.one(mt, 'zed', {}),
        {
          alias: 'zed',
          widgetType: 'STANDARD_PROBLEM',
          boardRegion: 'AUTO'
        });
  });
};
