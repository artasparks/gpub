(function() {
  module('gpub.book.bookMakerTest');

  test('That creation works', function() {
    // First create the spec / rendered objs.
    var problem = testdata.sgfs.veryeasy
    var maker = gpub.init({
        sgfs: [problem],
        specOptions: {
          positionType: 'PROBLEM',
        },
      })
      .createSpec()
      .processSpec()
      .renderDiagrams()
      .bookMaker();

    ok(maker);
    deepEqual(maker.idxArr_.length, 2)
    deepEqual(maker.idFromIdx(1), 'sgf-1__0__0-6');
    deepEqual(maker.idFromIdx(2), '');
  });
})();
