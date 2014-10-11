gpub.diagrams.diagramsTest = function() {
  module('glift.diagrams.diagramsTest');
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])';
  var diagramTypes = gpub.diagrams.types;

  test('Test basic flattened', function() {
    var f = gpub.diagrams.flatten(basicSgf);
    ok(f !== undefined);
    deepEqual(f.comment(), 'foo');
  });

  test('Create: GOOE', function() {
    var d = gpub.diagrams.create(basicSgf, diagramTypes.GOOE);
    ok(d.indexOf(gpub.diagrams.gooe.symbolMap.TOP_EDGE) !== -1);
  });
};
