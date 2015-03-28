/**
 * Constructs a new Diagram Context.
 */
gpub.book.newDiagramContext = function(ctype, isChapter, isMainline) {
  return {
    contextType: ctype,
    isChapter: isChapter,
    isMainline: isMainline
  };
};

/**
 * The diagram context. How should the diagram be displayed in the page?
 */
gpub.book.contextType = {
  /** No diagram context: just the digaram. */
  NONE: 'NONE',

  /**
   * No go diagram; just text. WidgetType should be of type EXAMPLE.
   */
  DESCRIPTION: 'DESCRIPTION',

  /** Go diagram + text + variations. */
  EXAMPLE: 'EXAMPLE',

  /**
   * Go diagram + text + variations. A 'Variations' needs further processing.
   * It's a 'game' that hasn't been turned into a series of examples.
   */
  VARIATIONS: 'VARIATIONS',

  /**
   * A Go problem. Go Problems need further processing: primarily because are
   * several ways you may want to display answers.
   */
  PROBLEM: 'PROBLEM'
};

gpub.book._headingRegex = /(^|\n)#+\s*\w+/;

/**
 * Gets the diagram context from a movetree, which says, roughly, how to typeset
 * a diagram in the page.
 *
 * This method uses a bunch of heuristics and is somewhat brittle.
 */
gpub.book.getDiagramContext = function(mt, sgfObj) {
  var ctx = gpub.book.contextType;
  var wtypes = glift.enums.widgetTypes;
  var wt = sgfObj.widgetType;

  var ctxType = ctx.NONE;
  var comment = mt.properties().getComment();
  var isChapter = gpub.book._headingRegex.test(comment);

  if (wt === wtypes.STANDARD_PROBLEM ||
      wt === wtypes.STANDARD_PROBLEM) {
    ctxType = ctx.PROBLEM;
  } else if (
      wt === wtypes.GAME_VIEWER ||
      wt === wtypes.REDUCED_GAME_VIEWER) {
    ctxType = ctx.VARIATIONS; // Needs more processing
  } else if (wt === wtypes.EXAMPLE && mt.node().getNodeNum() === 0) {
    var stones = mt.properties().getAllStones();
    if (stones.BLACK.length === 0 && stones.WHITE.length === 0) {
      ctxType = ctx.DESCRIPTION;
    } else {
      ctxType = ctx.EXAMPLE;
    }
  } else {
    ctxType = ctx.EXAMPLE;
  }
  return gpub.book.newDiagramContext(ctxType, isChapter, mt.onMainline());
};
