(function() {
  module('gpub.diagrams.senseisAsciiTest');

  var symbolMap = gpub.diagrams.senseisAscii.symbolMap;
  var create = gpub.diagrams.senseisAscii.create;
  var basicSgf = '(;GB[1]C[foo]AW[aa]AB[ab][ad]LB[ab:z]LB[bc:2]' +
      '[ad:30]TR[dd])';
  var flattened = gpub.diagrams.flatten(basicSgf, [], [], 'TOP_LEFT');
  var options = {};

  test('Senseis Ascii: no exceptions', function() {
    var ascii = create(flattened, {});
    ok(ascii);
    // console.log(ascii);
  });
})();
