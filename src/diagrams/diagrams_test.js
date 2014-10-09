gpub.diagrams.diagramsTest = function() {
  module('glift.diagrams.diagramsTest');
  test('Test basic flattened', function() {
    var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])';
    var f = gpub.diagrams.flatten(basicSgf);
    ok(f !== undefined);
    deepEqual(f.comment(), 'foo');
  });
};
