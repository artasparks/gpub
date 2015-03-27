/**
 * The diagram context. How should the diagram be displayed in the page?
 */
gpub.book.diagramContext = {
  /** No diagram context: just the digaram. */
  NONE: 'NONE',

  /**
   * No go diagram; just text. WidgetType should be of type EXAMPLE.
   */
  DESCRIPTION: 'DESCRIPTION',

  /**
   * No go diagram; just text. At the beginning of commentary. Should be of
   * type EXAMPLE.
   */
  DESCRIPTION_INTRO: 'DESCRIPTION_INTRO',

  /** Go diagram + text + variations. */
  EXAMPLE: 'EXAMPLE',

  /** Chapter + Go diagram + text + variations. */
  EXAMPLE_CHAPTER: 'EXAMPLE_CHAPTER',

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

/**
 * Gets the diagram context from a movetree, which says, roughly, how to typeset
 * a diagram in the page.
 *
 * This method uses a bunch of heuristics and is somewhat brittle.
 */
gpub.book.getDiagramContext = function(movetree, sgfObj) {
  var ctx = gpub.book.diagramContext;
  var wtypes = glift.enums.widgetTypes;
  var wt = sgfObj.widgetType;

  if (wt === wtypes.STANDARD_PROBLEM ||
      wt === wtypes.STANDARD_PROBLEM) {
    return ctx.PROBLEM;
  } else if (wt === wtypes.EXAMPLE) {
    return ctx.EXAMPLE;
  } else if (
      wt === wtypes.GAME_VIEWER ||
      wt === wtypes.REDUCED_GAME_VIEWER) {
    return ctx.VARIATIONS; // Needs
  }

  return ctx.NONE;
};
