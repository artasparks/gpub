gpub.diagrams = {
  /**
   * Types of diagram output.
   */
  // TODO(kashomon): Make part of the API (gpub.api)
  diagramType: {
    /**
     * Sensei's library ASCII variant.
     */
    SENSEIS_ASCII: 'SENSEIS_ASCII',
    /**
     * GPUB's ASCII variant.
     */
    GPUB_ASCII: 'GPUB_ASCII',

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
    PDF: 'PDF',
    /**
     * Generate SVG Diagrams.
     */
    SVG: 'SVG'
  },

  /**
   * The new method for generating diagrams. Note that this no longer generates
   * the diagram context -- that is left up to the relevant book generator.
   */
  create: function(flattened, diagramType, options) {
    // TODO(kashomon): Remove optional options obj. We should only do options
    // processing in api land.
    options = options || {};
    return this._getPackage(diagramType).create(flattened, options);
  },

  /** Renders go stones that exist in a block of text. */
  renderInline: function(diagramType, text) {
    return this._getPackage(diagramType).renderInline(text);
  },

  /** Gets a diagram type package */
  _getPackage: function(diagramType) {
    if (!diagramType || !gpub.diagrams.diagramType[diagramType]) {
      throw new Error('Unknown diagram type: ' + diagramType);
    }
    var pkgName = glift.enums.toCamelCase(diagramType);
    var pkg = gpub.diagrams[pkgName];

    if (!pkg) {
      throw new Error('No package for diagram type: ' + diagramType);
    }
    if (!pkg.create) {
      throw new Error('No create method for diagram type: ' + diagramType);
    }
    return pkg
  },

  /** Gets the initialization data for a diagramType. */
  getInit: function(diagramType, outputFormat) {
    var pkg = this._getPackage(diagramType);
    if (!pkg.init || typeof pkg.init != 'object') {
      throw new Error('No init obj');
    }
    var init = pkg.init[outputFormat];
    if (!init) {
      return ''
    } else if (typeof init === 'function') {
      return init();
    } else if (typeof init === 'string') {
      return init;
    } else {
      return '';
    }
  },

  /**
   * A flattener helper.  Returns a glift Flattened object, which is key for
   * generating diagrams.
   */
  // TODO(kashomon): Consider deleting this. It's really not doing much at all.
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
   * Construct the label based on the flattened object. From the flattened
   * object, we must extract the collisions and the move numbers.
   *
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  createLabel: function(flattened) {
    return gpub.diagrams._constructLabel(
        collisions = flattened.collisions(),
        isOnMainline = flattened.isOnMainPath(),
        startNum = flattened.startingMoveNum(),
        endNum = flattened.endingMoveNum());
  },

  /**
   * Construct the label based on the flattened object. From the flattened
   * object, we must extract the collisions and the move numbers.
   *
   * Collisions is an array of collisions objects, having the form:
   * {
   *    color: <color>,
   *    mvnum: <number>,
   *    label: <str label>,
   *    collisionStoneColor: <str label>,
   * }
   *
   * returns: stringified label format.
   */
  _constructLabel: function(collisions, isOnMainline, startNum, endNum) {
    var baseLabel = '';

    if (isOnMainline) {
      // If we're on the mainline branch, construct a label that's like:
      // (Moves: 1-12)
      // or 
      // (Move: 32)
      var nums = [startNum];
      if (startNum !== endNum) {
        // Note: Currently the API is such that if there's only one move, then
        // startNum == endNum.
        nums.push(endNum);
      }
      var moveLabel = nums.length > 1 ? 'Moves: ' : 'Move: ';
      baseLabel += '(' + moveLabel + nums.join('-') + ')';
    }

    // No Collisions! Woohoo
    if (collisions == null || collisions.length === 0) {
      return baseLabel;
    }

    // First we collect all the labels by type, being careful to perserve the
    // ordering in which the labels came in.
    var labelToColArr = {};
    var labelToColStoneColor = {};
    var labelOrdering = [];
    for (var i = 0; i < collisions.length; i++) {
      var c = collisions[i];
      if (!labelToColArr[c.label]) {
        labelOrdering.push(c.label);
        labelToColArr[c.label] = [];
      }
      if (!labelToColStoneColor[c.label]) {
        labelToColStoneColor[c.label] = c.collisionStoneColor;
      }
      labelToColArr[c.label].push(c);
    }

    // Now we construct rows that look like:
    //
    // Black 13, White 16, Black 19 at a
    // Black 14, White 17, Black 21 at 3
    var allRows = []
    for (var k = 0; k < labelOrdering.length; k++) {
      var label = labelOrdering[k];
      var colArr = labelToColArr[label];
      var row = [];
      for (var i = 0; i < colArr.length; i++) {
        var c = colArr[i];
        var color = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
        row.push(color + ' ' + c.mvnum);
      }
      var colStoneColor = labelToColStoneColor[label];
      colStoneColor = (colStoneColor === glift.enums.states.BLACK ? 
          'Black' : 'White') + ' ';

      var rowString = row.join(', ') + ' at ' + colStoneColor + label;
      allRows.push(rowString);
    }
    if (baseLabel) { baseLabel += '\n'; }
    baseLabel += allRows.join(',\n') + '.';
    return baseLabel;
  }
};
