(function() {
  module('gpub.spec.processorTest');

  var sgfOne = '(;GM[1]GN[Zed];B[aa];W[bb]C[So good!];B[cc])';
  var sgfTwo = '(;GM[1]GN[Zed];B[aa];W[bb]C[Still Cool!];B[cc])';
  var sgfThree = '(;GM[1];B[aa];W[bb]C[Still Cool!];B[cc])';

  test('Process one SGF', function() {
    var cache = new gpub.util.MoveTreeCache();
    var spec = gpub.spec.create(new gpub.Options({
      sgfs: [sgfOne],
    }), cache);

    var proc = gpub.spec.process(spec, cache);

    var id = 'Zed-1'
    deepEqual(proc.rootGrouping.positions[0].id, id);
    deepEqual(proc.rootGrouping.positions[0].alias, id);
    deepEqual(proc.rootGrouping.generated[id].positions.length, 2);
    deepEqual(proc.rootGrouping.generated[id].positions[0].alias, id);
  });

  test('Process three SGFs', function() {
    var cache = new gpub.util.MoveTreeCache();
    var spec =  gpub.spec.create(new gpub.Options({
      sgfs: [
        sgfOne,
        sgfTwo,
        sgfThree,
      ]
    }), cache);

    var proc = gpub.spec.process(spec, cache);

    deepEqual(proc.rootGrouping.positions.length, 3);

    proc.rootGrouping.positions.forEach(function(p) {
      var id = p.id;
      ok(proc.rootGrouping.generated[id], 'should have generated for id: ' + id);
      var gen = proc.rootGrouping.generated[id];
      deepEqual(gen.positions.length, 2);
      for (var i = 0; i < gen.positions.length; i++) {
        var genp = gen.positions[i];
        genp.alias = gen.alias;
        genp.id = gen.alias + '-' + i;
      };
      deepEqual(gen.labels['MAINLINE'].length, 2);
      deepEqual(gen.labels['VARIATION'].length, 0);
    });
  });

})();
