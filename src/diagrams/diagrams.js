gpub.diagrams = {
  /**
   * Types of diagram generation.
   */
  types: {
    /**
     * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
     */
    GOOE: 'GOOE',

    /**
     * Another LaTeX font / LaTeX style package
     * >> Not Currently Supported
     */
    IGO: 'IGO',

    /**
     * Native PDF generation
     * >> Not Currently Supported
     */
    PDF: 'PDF'
  },

  sizes: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  /**
   * Creates a diagram-for-print!
   */
  create: function(sgf, type, initPos, nextMovesPath, boardRegion) {
    var flattened = this.flatten(sgf, initPos, nextMovesPath, boardRegion);
    switch(type) {
      case 'GOOE':
        return gpub.diagrams.gooe.create(flattened);
      default:
        throw new Error('Not currently supported: ' + type);
    }
  },

  /**
   * Return a Flattened object, which is key for generating diagrams.
   */
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  }
};
