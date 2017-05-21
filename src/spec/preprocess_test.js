(function() {
  module('gpub.spec.preprocess');

  test('Preprocess grouping', function() {
    var cache = new gpub.util.MoveTreeCache();
    var sgf = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var o = new gpub.Options({
      sgfs: [sgf],
      ids: ['z1'],
      grouping: {
        title: 'foo',
        description: 'bar',
        positionType: 'PROBLEM',
        positions: [
          'z1',
        ],
      }
    }, cache);
    var spec = gpub.spec.create(o);
    var gr = spec.rootGrouping;
    deepEqual(gr.title, o.grouping.title, 'title');
    deepEqual(gr.description, o.grouping.description, 'description');
    deepEqual(gr.positionType, o.grouping.positionType, 'description');
  })

  test('Preprocess grouping', function() {
    var cache = new gpub.util.MoveTreeCache();
    var sgf = '(;GM[1]AW[aa]AB[ba];B[bb]C[The End!])';
    var o = new gpub.Options({
      sgfs: [sgf, sgf],
      ids: ['z1', 'z2'],
      grouping: {
        title: 'foo',
        description: 'bar',
        positionType: 'PROBLEM',
        positions: [ 'z1' ],
        groupings: [{
          title: 'bar',
          positions: [ 'z1' ],
        }, {
          title: 'biff',
          positions: [ 'z2' ],
        }]
      }
    }, cache);
    var spec = gpub.spec.create(o);
    var gr = spec.rootGrouping;
    deepEqual(gr.title, o.grouping.title, 'title');
    deepEqual(gr.description, o.grouping.description, 'description');
    deepEqual(gr.positionType, o.grouping.positionType, 'description');

    deepEqual(gr.groupings.length, 2);
    deepEqual(gr.groupings[0].title, 'bar');
    deepEqual(gr.groupings[0].positions[0].alias, 'z1');
    deepEqual(gr.groupings[1].title, 'biff');
    deepEqual(gr.groupings[1].positions[0].alias, 'z2');
  })
})();
