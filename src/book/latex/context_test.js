(function() {
  module('gpub.boo k.latex.templateTest');
  var diagramTypes = gpub.diagrams.diagramType;

  var fakeFlattened = {
    comment: function() { return 'Comment!' },
    mainlineMove: function() { 
      return {
        color: 'BLACK',
        point: glift.util.point(0,0)
      }
    },
    isOnMainPath: function() { return true },
    mainlineMoveNum: function() { return 10 },
    // mainlineMoveNum should match starting moveNum when isOnMainPath=true
    startingMoveNum: function() { return 10 },
    endingMoveNum: function() { return 20 },
    collisions: function() { [] }
  };

  var fakeContext = {
    contextType: gpub.book.contextType.EXAMPLE,
    isChapter: true
  };

  test('Round trip: Exceptionless', function() {
    var d = gpub.book.latex.context.typeset(
        diagramTypes.GNOS,
        'Diagram:zed!',
        fakeContext,
        fakeFlattened,
        12 /* intSize*/,
        gpub.book.page.size.LETTER);
    ok(d, 'must be defined');
  });

  test('Round Trip: Characteristics', function() {
    var d = gpub.book.latex.context.typeset(
        diagramTypes.GNOS,
        'Diagram:zed!',
        fakeContext,
        fakeFlattened,
        12 /* intSize*/,
        gpub.book.page.size.LETTER);
    ok(/minipage\}\[t\]\{.*0pt/.test(d), 
        'Correct minipage size: diagram');
    ok(/minipage\}\[t\]\{.*0pt/.test(d), 
        'correct minipage size: text');
  });
})();
