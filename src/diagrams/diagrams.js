gpub.diagrams = {
  diagramSize: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  diagramTypes: {
    GAME_REVIEW: 'GAME_REVIEW'
  },

  /**
   * Return a flattened object.
   */
  flatten: function(sgf, initPos, nextMovesPath) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath
    });
  }
};
