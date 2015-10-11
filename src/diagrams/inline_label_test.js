(function() {
  module('glift.diagrams.inlineLabelTest');
  var r = gpub.diagrams.inlineLabelRegex;
  var rep = gpub.diagrams.inlineReplacer;

  test('inlineLabelRegex: valid test cases', function() {
    var validTestCases = [
      'Black 1',
      'Black 2\n',
      'White 12 zed',
      'White 12"',
      'White 12\'',
      'White 123:',
      'White 123.',
      'White 123,',
      'White 123_',
      'White 123-',
      'White 123>',
      'White 123<',
      'White 123?',
      'White 123!',
      'White 123~',
      'White 12.4',
      'White 123`',
      'White 123@',
      'White (a)',
      'Black (123):',
      'Black (E);',
      'Black A',
    ];
    for (var i = 0; i < validTestCases.length; i++) {
      ok(r.test(validTestCases[i]), 'Case: ' + validTestCases[i]);
    }
  });

  test('inlineLabelRegex: invalidTestCases', function() {
    var invalidTestCases = [
      'White',
      'Black',
      'White 1234',
      'White A234',
      'White the',
      'White a',
      'Black AB',
      'White (%)-',
    ];
    for (var i = 0; i < invalidTestCases.length; i++) {
      ok(!r.test(invalidTestCases[i]), 'Case: ' + invalidTestCases[i]);
    }
  });

  test('Replace Inline', function() {
    var text = 'Black A, White (a), Black 123 at Black 12.'
    var out = gpub.diagrams.replaceInline(text, function(full, player, label) {
      return label;
    });
    deepEqual(out, 'A, a, 123 at 12.');
  });
})();
