gpub.api.endToEndTest = function() {
  module('glift.api.endToEndTest');
  var sgf = testdata.gogameguru_commentary;

  test('Setup', function() {
    ok(sgf);
    ok(gpub);
    ok(gpub.defaultOptions);
    ok(gpub.bookPurpose);
    ok(gpub.bookFormat);
  });

  test('Testing validation: no SGFs', function() {
    try {
      gpub.create();
    } catch (e) {
      ok(/SGF array must be defined and non-empty/.test(e).toString());
    }
  });
};
