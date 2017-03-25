(function() {
  module('gpub.api.diagramOptionsTest');

  test('That diagram options construction work.', function() {
    var opt = new gpub.api.DiagramOptions({
      maxDiagrams: 12,
    });
    deepEqual(opt.maxDiagrams, 12);
    deepEqual(opt.autoBoxCropOnVariation, false);
    deepEqual(opt.diagramType, gpub.diagrams.Type.GNOS);
  });
})();
