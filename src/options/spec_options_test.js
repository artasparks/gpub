(function() {
  module('gpub.opts.specOptionsTest');

  test('That spec options construction work.', function() {
    var opt = new gpub.opts.SpecOptions({
      positionType: gpub.spec.PositionType.PROBLEM
    });
    deepEqual(opt.positionType, gpub.spec.PositionType.PROBLEM);
    deepEqual(opt.idGenType, gpub.spec.IdGenType.PATH);
    deepEqual(opt.autoRotateGames, true);
  });
})();
