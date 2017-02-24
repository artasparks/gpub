(function() {
  module('glift.orientation.rotationTests');
  var rotations = glift.enums.rotations;
  var boardRegions = glift.enums.boardRegions;

  var ordering = {
    corner: boardRegions.TOP_RIGHT,
    side: boardRegions.TOP
  };

  test('findCanonicalRotation: corner', function() {
    var find = glift.orientation.findCanonicalRotation;
    var mt = glift.rules.movetree.getFromSgf('(;GM[1];B[aa])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_90);

    mt = glift.rules.movetree.getFromSgf('(;GM[1];B[ma])');
    deepEqual(find(mt, ordering), rotations.NO_ROTATION);

    mt = glift.rules.movetree.getFromSgf('(;GM[1];B[am])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_180);

    mt = glift.rules.movetree.getFromSgf('(;GM[1];B[mm])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_270);
  });

  test('findCanonicalRotation: side', function() {
    var find = glift.orientation.findCanonicalRotation;
    var mt = glift.rules.movetree.getFromSgf('(;GM[1];B[aa];W[ma])');
    deepEqual(find(mt, ordering), rotations.NO_ROTATION);

    var mt = glift.rules.movetree.getFromSgf('(;GM[1];B[aa];W[am])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_90);

    var mt = glift.rules.movetree.getFromSgf('(;GM[1];B[mm];W[am])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_180);

    var mt = glift.rules.movetree.getFromSgf('(;GM[1];B[mm];W[ma])');
    deepEqual(find(mt, ordering), rotations.CLOCKWISE_270);
  });

  test('Autorotate: corner', function() {
    var pt = glift.util.point;
    var mt = glift.rules.movetree.getFromSgf(
      '(;GM[1]B[cb]C[foo];W[ac])');

    deepEqual(mt.properties().getAsPoint('B'),  pt(2, 1));
    var nmt = glift.orientation.autoRotateCrop(mt, {
      corner: boardRegions.TOP_LEFT,
      side: boardRegions.TOP
    });
    deepEqual(nmt.properties().getAsPoint('B'),  pt(2, 1));
    deepEqual(nmt.properties().getOneValue('C'), 'foo');

    nmt = glift.orientation.autoRotateCrop(mt, {
      corner: boardRegions.TOP_RIGHT,
      side: boardRegions.TOP
    });
    deepEqual(nmt.properties().getAsPoint('B'),  pt(17, 2));
    deepEqual(nmt.properties().getOneValue('C'), 'foo');
    nmt.moveDown();
    deepEqual(nmt.properties().getAsPoint('W'),  pt(16, 0));

    nmt = glift.orientation.autoRotateCrop(mt, {
      corner: boardRegions.BOTTOM_RIGHT,
      side: boardRegions.TOP
    });
    deepEqual(nmt.properties().getAsPoint('B'),  pt(16, 17));

    nmt = glift.orientation.autoRotateCrop(mt, {
      corner: boardRegions.BOTTOM_LEFT,
      side: boardRegions.TOP
    });
    deepEqual(nmt.properties().getAsPoint('B'),  pt(1, 16));
  });
})();
