(function() {
  module('gpub.opts.diagramOptionsTest');

  test('That diagram options construction work.', function() {
    var opt = new gpub.opts.DiagramOptions({
      maxDiagrams: 12,
    });
    deepEqual(opt.maxDiagrams, 12);
    deepEqual(opt.autoBoxCropOnVariation, false);
    deepEqual(opt.diagramType, gpub.diagrams.Type.GNOS);
  });
})();
