(function() {
  module('gpub.optionsTest');
  var defaultOptions = new gpub.Options();

  test('Process options: default', function() {
    var o = new gpub.Options();
    ok(o, 'make sure it works');
    ok(o.templateOptions.metadata.id, 'make sure it has an id');
  });

  test('Process options: default', function() {
    var o = new gpub.Options({
      templateOptions: {
        metadata: {
          title: 'Zed',
          id: 'foo',
        }
      }
    });
    deepEqual(o.templateOptions.metadata.title, 'Zed');
    deepEqual(o.templateOptions.metadata.id, 'foo');
  });

  test('Apply defaults', function() {
    var o = gpub.Options.applyDefaults({
      specOptions: {
        autoRotateCropTypes: { 'PROBLEM':  true },
        autoRotateGames: true,
      },
      templateOptions: {
      },
    }, {
      specOptions: {
        positionType: gpub.spec.PositionType.PROBLEM,
        autoRotateGames: false,
      },
      diagramOptions: {
        goIntersectionSize: '12mm',
      },
      templateOptions: {
        pdfx1a: true,
      },
    });
    deepEqual(o, {
      specOptions: {
        autoRotateCropTypes: { 'PROBLEM':  true },
        autoRotateGames: true,
        positionType: gpub.spec.PositionType.PROBLEM,
      },
      diagramOptions: {
        goIntersectionSize: '12mm',
      },
      templateOptions: {
        pdfx1a: true,
      },
    });
  })
})();
