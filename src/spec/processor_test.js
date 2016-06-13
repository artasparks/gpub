(function() {
  module('gpub.spec.processorTest');

  var sgfOne = '(;GM[1]GN[Zed];B[aa];W[bb]C[So good!];B[cc])';
  var sgfTwo = '(;GM[1]GN[Zed];B[aa];W[bb]C[Still Cool!];B[cc])';
  var sgfThree = '(;GM[1];B[aa];W[bb]C[Still Cool!];B[cc])';

  // test('Process one SGF', function() {
    // var spec =  gpub.spec.create([
      // sgfOne
    // ], {
      // bookPurpose: gpub.bookPurpose.GAME_COMMENTARY,
      // boardRegion: glift.enums.boardRegions.AUTO
    // });

    // deepEqual(spec.sgfCollection.length, 2);
    // deepEqual(spec.sgfCollection[0].alias, 'Zed:0');
  // });

  // test('Process three SGFs', function() {
    // var spec =  gpub.spec.create([
      // sgfOne,
      // sgfTwo,
      // sgfThree,
    // ], {
      // bookPurpose: gpub.bookPurpose.GAME_COMMENTARY,
      // boardRegion: glift.enums.boardRegions.AUTO
    // });

    // deepEqual(spec.sgfCollection.length, 6);
    // deepEqual(spec.sgfCollection[0].alias, 'Zed:0');
    // deepEqual(spec.sgfCollection[2].alias, 'Zed:1');
    // deepEqual(spec.sgfCollection[4].alias, 'sgf:2');
  // });

  // test('Process Two SGFs!', function() {
    // var sgfOne
    // deepEqual(1, 1, '1 should equal 1');
  // });
})();
