gpub.spec.problemBookTest = function() {
  module('gpub.spec.problemBookTest');
  var multi = gpub.spec.problemBook.multi;

  test('One problem', function() {
    var sgf = '(;GM[1]AB[aa];B[ab])';
    var mt = glift.parse.fromString(sgf);
    var out = multi([{movetree: mt, name: 'zed'}]);
    ok(out !== undefined);
    deepEqual(out[0].metadata.exampleType, 'PROBLEM');
    deepEqual(out[1].metadata.exampleType, 'ANSWER');
  });

  test('Two problems', function() {
    var sgf1 = '(;GM[1]AB[aa];B[ab])';
    var sgf2 = '(;GM[1]AB[bb];B[bc])';
    var mt1 = glift.parse.fromString(sgf1);
    var mt2 = glift.parse.fromString(sgf2);
    var out = multi([
        {movetree: mt1, name: 'zed1'},
        {movetree: mt2, name: 'zed2'}]);
    ok(out !== undefined);
    deepEqual(out.length, 4);
    deepEqual(out[0].metadata.exampleType, 'PROBLEM');
    deepEqual(out[1].metadata.exampleType, 'PROBLEM');
    deepEqual(out[2].metadata.exampleType, 'ANSWER');
    deepEqual(out[3].metadata.exampleType, 'ANSWER');
  });
};
