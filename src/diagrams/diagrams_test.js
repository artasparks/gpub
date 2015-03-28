(function() {
  module('glift.diagrams.diagramsTest');
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])';
  var diagramType = gpub.diagrams.diagramType;
  var diagramContext = gpub.book.diagramContext;
  var format = gpub.outputFormat;

  test('Create: GOOE', function() {
    var flattened = gpub.diagrams.flatten(basicSgf);
    var d = gpub.diagrams.create(flattened, diagramType.GOOE);
    ok(d.indexOf(gpub.diagrams.gooe.symbolMap.TOP_EDGE) !== -1);
  });

  test('label for collisions', function() {
    var coll = [
      {color: 'BLACK', mvnum: '1', label: 'a'},
      {color: 'WHITE', mvnum: '10', label: 'x'}
    ];
    deepEqual(
        gpub.diagrams._constructLabel(coll),
        'Black 1 at a, White 10 at x.');
  });

  test('Full Latex Creation', function() {
    var f = gpub.diagrams.flatten(basicSgf);
    var out = gpub.diagrams.create(
        gpub.diagrams.flatten(basicSgf),
        diagramType.GOOE);
    ok(out, 'should be truthy');
  });

  test('Get init: gnos', function() {
    var init = gpub.diagrams.getInit('GNOS', 'LATEX');
    deepEqual(init, gpub.diagrams.gnos.init.LATEX);
  });

  test('Get init: gooe', function() {
    var init = gpub.diagrams.getInit('GOOE', 'LATEX');
    deepEqual(init, gpub.diagrams.gooe.init.LATEX());
  });
})();
