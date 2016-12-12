(function() {
  module('gpub.diagrams.igo.intersectionsTest');
  var newTracker = function() { return new gpub.diagrams.igo.Intersections(); };
  var pt = glift.util.point;

  test('Simple marks object usage', function() {
    var t = newTracker();
    t.addMark('BLACK', 'XMARK', '1,1');
    t.addMark('BLACK', 'CIRCLE', '1,2');
    t.addMark('BLACK', 'CIRCLE', '2,2');
    t.addMark('BLACK', 'SQUARE', '1,3');
    t.addMark('BLACK', 'TRIANGLE', '1,4');
    t.addMark('WHITE', 'CIRCLE', '3,2');
    deepEqual(t.marks.BLACK.XMARK[0], '1,1');
    deepEqual(t.marks.BLACK.CIRCLE[0], '1,2');
    deepEqual(t.marks.BLACK.CIRCLE[1], '2,2');
    deepEqual(t.marks.BLACK.SQUARE[0], '1,3');
    deepEqual(t.marks.BLACK.TRIANGLE[0], '1,4');
    deepEqual(t.marks.WHITE.CIRCLE[0], '3,2');

    ok(t.seenStones['1,1']);
    ok(t.seenStones['1,2']);
    ok(t.seenStones['2,2']);
    ok(t.seenStones['1,3']);
    ok(t.seenStones['1,4']);
    ok(t.seenStones['3,2']);
  });

  test('Add empty text labels', function() {
    var t = newTracker();
    t.addEmptyTextLabel('1,1', 'a');
    t.addEmptyTextLabel('2,1', 'a');
    t.addEmptyTextLabel('1,2', 'b');
    deepEqual(t.emptyTextLabels.a, ['1,1', '2,1']);
    deepEqual(t.emptyTextLabels.b, ['1,2'])
  });

  var mklbl = function(ptstr, color, label) {
    return {ptstr: ptstr, color:color, label:label};
  }

  test('Add stone text labels: simple', function() {
    var t = newTracker();
    t.addStoneTextLabels([
      // sequence 2
      mklbl('2,2', 'WHITE', '8'),
      mklbl('2,1', 'BLACK', '7'),
      mklbl('2,4', 'WHITE', '10'),
      mklbl('2,3', 'BLACK', '9'),

      // sequence 1
      mklbl('1,2', 'WHITE', '2'),
      mklbl('1,1', 'BLACK', '1'),
      mklbl('1,3', 'BLACK', '3'),
    ]);

    deepEqual(t.sequences.length, 2);
    deepEqual(t.sequences[0], [
      mklbl('1,1', 'BLACK', '1'),
      mklbl('1,2', 'WHITE', '2'),
      mklbl('1,3', 'BLACK', '3'),
    ]);

    deepEqual(t.sequences[1], [
      mklbl('2,1', 'BLACK', '7'),
      mklbl('2,2', 'WHITE', '8'),
      mklbl('2,3', 'BLACK', '9'),
      mklbl('2,4', 'WHITE', '10')]);

    ok(t.seenStones['1,1']);
    ok(t.seenStones['1,2']);
    ok(t.seenStones['1,3']);
    ok(t.seenStones['2,1']);
    ok(t.seenStones['2,2']);
    ok(t.seenStones['2,3']);
    ok(t.seenStones['2,4']);
  });

  test('Add stone text labels: gaps', function() {
    var t = newTracker();
    t.addStoneTextLabels([
      // sequence with 1 gap
      mklbl('1,2', 'WHITE', '2'),
      mklbl('1,1', 'BLACK', '1'),
      mklbl('1,3', 'BLACK', '3'),
      mklbl('1,5', 'BLACK', '5'),
      mklbl('1,6', 'WHITE', '6'),
    ]);
    deepEqual(t.sequences.length, 1);
    deepEqual(t.sequences[0].length, 6);
    deepEqual(t.sequences[0][3], null);

    t = newTracker();
    t.addStoneTextLabels([
      // sequence with 1 gap
      mklbl('1,2', 'WHITE', '2'),
      mklbl('1,1', 'BLACK', '1'),
      mklbl('1,3', 'BLACK', '3'),
      mklbl('1,6', 'WHITE', '6'),
      mklbl('1,7', 'BLACK', '7'),
    ]);
    deepEqual(t.sequences.length, 1);
    deepEqual(t.sequences[0].length, 7);
    deepEqual(t.sequences[0][3], null);
    deepEqual(t.sequences[0][4], null);
  });

  var process = gpub.diagrams.igo.processIntersections;
  var symbols = glift.flattener.symbols;

  test('Process intersections: simple', function() {
    var marks = {};
    var stones = {};
    var labels = {};
    marks['1,1'] = symbols.XMARK;
    marks['1,2'] = symbols.TEXTLABEL;
    stones['1,1'] = { point: pt(1,1), color: 'BLACK' };
    stones['1,3'] = { point: pt(1,3), color: 'WHITE' };
    labels['1,2'] = 'Z';

    var tracker = process(marks, stones, labels);
    ok(tracker.seenStones['1,1']);
    ok(tracker.seenStones['1,3']);
    deepEqual(tracker.marks.BLACK.XMARK[0], '1,1');
    deepEqual(tracker.emptyTextLabels.Z, ['1,2'])
    deepEqual(tracker.blankStones.WHITE[0], '1,3');
  });

  test('Process intersections: sequence', function() {
    var marks = {};
    var stones = {};
    var labels = {};
    marks['1,1'] = symbols.TEXTLABEL;
    marks['1,2'] = symbols.TEXTLABEL;
    marks['1,3'] = symbols.TEXTLABEL;
    stones['1,1'] = { point: pt(1,1), color: 'BLACK' };
    stones['1,2'] = { point: pt(1,2), color: 'BLACK' };
    stones['1,3'] = { point: pt(1,3), color: 'WHITE' };
    labels['1,1'] = '1';
    labels['1,2'] = '3';
    labels['1,3'] = '2';

    var tracker = process(marks, stones, labels);
    ok(tracker.seenStones['1,1']);
    ok(tracker.seenStones['1,2']);
    ok(tracker.seenStones['1,3']);
    deepEqual(tracker.sequences.length, 1);
    deepEqual(tracker.sequences[0].length, 3);
    deepEqual(tracker.sequences[0][2].label, '3');
  })
})();
