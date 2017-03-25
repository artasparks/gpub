(function() {
  module('gpub.api.specOptionsTest');

  test('That spec options construction work.', function() {
    var opt = new gpub.api.SpecOptions({
      positionType: gpub.spec.PositionType.PROBLEM
    });
    deepEqual(opt.positionType, gpub.spec.PositionType.PROBLEM);
    deepEqual(opt.idGenType, gpub.spec.IdGenType.PATH);
    deepEqual(opt.autoRotateGames, true);
  });
})();
