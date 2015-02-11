gpub.diagrams = {
  /**
   * Types of diagram output.
   */
  diagramType: {
    /**
     * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
     */
    GOOE: 'GOOE',

    /**
     * Josh Hoak's variant of Gooe
     */
    GNOS: 'GNOS',

    /**
     * Another LaTeX font / LaTeX style package
     * >> Not Currently Supported
     */
    IGO: 'IGO',

    /**
     * Native PDF generation
     * >> Not Currently Supported, but here for illustration.
     */
    PDF: 'PDF'
  },

  /**
   * Types of diagram purposes. It's not currently clear to me if this should
   * continue to exist. This should never be exposed in a top-level API, but it
   * might make sense to expose this package's API.
   */
  diagramPurpose: {
    SECTION_INTRO: 'SECTION_INTRO',

    GAME_REVIEW: 'GAME_REVIEW',
    GAME_REVIEW_CHAPTER: 'GAME_REVIEW_CHAPTER',

    PROBLEM: 'PROBLEM',
    ANSWER: 'ANSWER'
  },

  // TODO(kashomon): Remove this. Sizes are a property of the fonts, at least
  // for latex. Gooe only supports 2 sizes.  Gnos supports 8.
  sizes: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  /**
   * Generates a diagram for a specific purpose and a given format
   *
   * flattened: Glift flattened obj.
   */
  forPurpose: function(
      flattened,
      diagramType,
      bookFormat,
      diagramPurpose,
      bookData) {
    if (!diagramType || !gpub.diagrams.diagramType[diagramType]) {
      throw new Error('Unknown diagram type: ' + diagramType);
    }
    if (!bookFormat || !gpub.book.bookFormat[bookFormat]) {
      throw new Error('Unknown diagram type: ' + bookFormat);
    }
    if (!diagramPurpose || !gpub.diagrams.diagramPurpose[diagramPurpose]) {
      throw new Error('Unknown diagram type: ' + diagramPurpose);
    }

    var bookData = bookData || {};
    var diagramString = gpub.diagrams.fromFlattened(flattened, diagramType);

    var pkg = null;
    switch(bookFormat) {
      case 'LATEX':
        pkg = gpub.diagrams.latex
        break;
      default:
        throw new Error('Unsupported book format: ' + bookFormat);
    }

    var label = null;
    switch(diagramPurpose) {
      case 'GAME_REVIEW':
      case 'GAME_REVIEW_CHAPTER':
      case 'SECTION_INTRO':
        label  = gpub.diagrams.constructLabel(
            flattened.collisions(),
            flattened.isOnMainPath(),
            flattened.startingMoveNum(),
            flattened.endingMoveNum());
        break;
      default:
        label = '';
    }

    return pkg.typeset(
        diagramString,
        diagramPurpose,
        flattened.comment(),
        label,
        flattened.isOnMainPath(),
        bookData);
  },

  /**
   * Creates a diagram-for-print! This is largely a convenience method.  Most
   * users will want
   */
  create: function(sgf, diagramType, initPos, nextMovesPath, boardRegion) {
    var flattened = this.flatten(sgf, initPos, nextMovesPath, boardRegion);
    return this.fromFlattened(flattened, diagramType);
  },

  /**
   * A flattener helper.  Returns a Flattened object, which is key for
   * generating diagrams.
   */
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  },

  /**
   * Return a diagram from a glift Flattened object.
   */
  fromFlattened: function(flattened, diagramType) {
    switch(diagramType) {
      case 'GOOE':
        return gpub.diagrams.gooe.create(flattened);
      case 'GNOS':
        return gpub.diagrams.gnos.create(flattened);
      default:
        throw new Error('Not currently supported: ' + diagramType);
    }
  },

  /**
   * Construct the label based on the collisions and the move numbers.
   * 
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  constructLabel: function(collisions, isOnMainline, startNum, endNum) {
    var baseLabel = '';
    if (isOnMainline) {
      var nums = [startNum];
      if (startNum !== endNum) {
        nums.push(endNum);
      }
      var moveLabel = nums.length > 1 ? 'Moves: ' : 'Move: ';
      baseLabel += '(' + moveLabel + nums.join('-') + ')';
    }

    if (collisions && collisions.length) {
      var buffer = [];
      for (var i = 0; i < collisions.length; i++) {
        var c = collisions[i];
        var col = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
        buffer.push(col + ' ' + c.mvnum + ' at ' + c.label);
      }
      if (baseLabel) {
        baseLabel += '\n';
      }
      baseLabel += buffer.join(', ') + '.';
    }

    return baseLabel;
  }
};
