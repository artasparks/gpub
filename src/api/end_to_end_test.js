(function() {
  module('glift.api.endToEndTest');
  var sgf = testdata.gogameguru_commentary;

  test('Setup', function() {
    ok(sgf, 'testdata defined');
    ok(glift, 'glift global defined');
    ok(gpub.defaultOptions, 'defaultOptions: defined');
    ok(gpub.bookPurpose, 'bookPurpose: defined');
    ok(gpub.outputFormat, 'ouputFormat: defined');
  });

  test('Testing validation: no SGFs', function() {
    try {
      gpub.create();
    } catch (e) {
      ok(/SGF array must be defined and non-empty/.test(e).toString());
    }
  });

  test('Testing full happy path, no exceptions', function() {
    var output = gpub.create({
      sgfs: [sgf],
      maxDiagrams: 20
    })
    ok(output, 'Output should be defined');
  });
})();
