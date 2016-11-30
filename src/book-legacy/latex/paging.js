/**
 * (Currently Experimental) Page wrapper.
 *
 * A page is just that: a representation of a page. The page has knowledge of
 * its margins, bleed, trim, and stock size. From that we can determine where
 * to place text and go diagrams.
 *
 * How they work together:
 *  |Bleed |Trim |Margin
 *
 * Bleed: the part that will be cut off. Note that bleed should only apply to
 *    the outside edges.
 * Trim: the part of the book actually shown (not trimmed). This is also known
 *    as the 'final size'.
 * Margin: the whitespace border around the text.
 *
 * Sometimes you'll see the term 'stock size'.  This simply refers to the paper
 * size.
 *
 * Note: by default, we don't assume bleed.
 */

/**
 * The paging instance is a factory for pages.  We want all pages to share the
 * same properties.  Thus, the purpose of this factory.
 *
 * pageType: A member of gpub.book.page.type;
 * intersectionSize: In point-size. Note that 1 pt = 1/72 of an inch. Note: Not
 *    all diagram styles support all point sizes.
 * margins: Optional. Right/Left margin in inches. Currently pretty crude.
 * bleed: Optional. Not used at the moment.
 */
gpub.book.latex.Paging = function(
    pageType,
    intersectionSize,
    margins,
    bleed) {
  this.buffer = [];

  /** Size of the pages produced by the paging factory. */
  // TODO(kashomon): why is this guarded?
  this.pageSize = pageType ||
      gpub.book.page.type.LETTER;

  if (!gpub.book.page.type[this.pageSize] ||
      !gpub.book.page.size[this.pageSize]) {
    throw new Error('Unknown page size: ' + this.pageSize);
  }

  // TODO(kashomon): Support margins.
  this.margins = margins ||
      gpub.book.latex.defaultMargins;

  /** Size of the go-board intersections in pt. */
  this.intSize = intersectionSize;

  /** The bleed amount in inches. Exterior edges only. */
  this.bleed = bleed || 0;

  /** The current page, for the purposes of adding diagrams */
  // CURRENTLY UNUSED
  this.currentPage = null;

  /** Total pages, minus the current page*/
  // CURRENTLY UNUSED
  this.pages = [];

  /**
   * Map from some key to some reference value. For games this might be
   * movenumber > diagram Id
   */
  this._diagramRefMap = {};
};

gpub.book.latex.Paging.prototype = {
  /**
   * Adds a diagram to the paging tracker.
   */
  addDiagram: function(
      diagramType,
      diagramString,
      context,
      flattened,
      sgfId) {
    this._populateRefMap(flattened, sgfId, context);
    var ref = this._getReference(flattened, context);
    var contextualized = gpub.book.latex.context.typeset(
        diagramType,
        diagramString,
        context,
        flattened,
        this.intSize,
        gpub.book.page.size[this.pageSize],
        ref);
    this.buffer.push(contextualized);
  },

  /** Populate the reference map based on the context type. */
  _populateRefMap: function(flattened, sgfId, context) {
    sgfId = gpub.book.latex.sanitize(sgfId);
    if (context.contextType === gpub.book.contextType.EXAMPLE) {
      if (flattened.isOnMainPath()) {
        // We have to choose some move number to represent the diagram. Might as
        // well be the starting number.
        var label = sgfId + ':mainmove-' + flattened.startingMoveNum();
        for (var i = flattened.startingMoveNum();
            i <= flattened.endingMoveNum();
            i++) {
          this._diagramRefMap[i] = label;
        }
      }
    }
  },

  /** Gete the reference label for latex. Return null if no ref can be found. */
  _getReference: function(flattened, context) {
    if (context.pdfx1a) {
      return null;
    }
    if (context.contextType === gpub.book.contextType.EXAMPLE) {
      var mainMove = flattened.mainlineMove();
      if (!flattened.isOnMainPath() && mainMove !== null) {
        return this._diagramRefMap[flattened.nextMainlineMoveNum()] || null;
      } else if (flattened.isOnMainPath()) {
        return this._diagramRefMap[flattened.startingMoveNum()] || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  /** Flush the pages buffer as a string. */
  flushAll: function() {
    return this.buffer.join('\n');
  },

  /**
   * Returns the relevant latex preamble. Should be added to the document
   * before page construction.
   */
  pagePreamble: function() {
    var size = gpub.book.page.size[this.pageSize];
    return [
      '%%% Page Settings Preamble %%%',
      // this.bleed ? this._trimSetting() : '',
      '\\setstocksize{' + size.heightIn + 'in}{' + size.widthIn + 'in}',
      '\\settrimmedsize{\\stockheight}{\\stockwidth}{*}',
      '\\settypeblocksize{0.85\\stockheight}{0.85\\stockwidth}{*}',
      '\\setulmargins{*}{*}{1.618}',
      '\\setlrmargins{*}{*}{1}',
      '\\setheaderspaces{*}{*}{1.618}',
      '\\checkandfixthelayout', // Must be last

      '%%% End Page Settings Preamble %%%'
    ].join('\n');
  },

  /**
   * Sets the page size for the memoir class. I.e., returns the relevant latex
   * command.
   */
  _pageSizeSetting: function() {
    var size = gpub.book.page.size[this.pageSize];
    return '\\setstocksize' +
      '{' + size.heightIn + 'in}' +
      '{' + size.widthIn + 'in}';
  },

  /**
   * Sets the margins on the page: Returns the relevant latex command.
   * Note: this is probably the least elegant way of setting the margins. The
   * memoir class has lots of machinery for set margins using a ratio setting.
   */
  _marginSetting: function() {
    // Currently we don't set the vertical margin, but could be set with
    // \setulmarginsandblock
    return '\\setlrmarginsandblock{' + this.margins + 'in}{' +
        this.margins + 'in}{*}';
  },

  /**
   * Set the trims/bleeds. This is the amount that's cut (or trimmed) from the
   * page and thus doesn't show up in the finished product.
   *
   * Since professional printers can print at trim (no bleed), we
   */
  _trimSetting: function() {
    // For now we assume that we're printing at trim. In otherwords, that we're
    // not using bleed.
    return '\\settrims{' + this.bleed + 'in}{' + this.bleed + 'in}';
  },

  /**
   * Returns
   * {
   *  rows: X (as float).
   *  cols: X (as float).
   * }
   */
  _calculateUnits: function() {
    var intPt = this.intersectionSize;
    var inchesPer = initPt / 72;
    var sizeObj = gpub.book.page.sizeMapping[this.pageSize];
    var interiorWidth = (sizeObj.widthIn - 2 * this.margins) / inchesPer;
    var interiorHeight  = (sizeObj.heightIn- 2 * this.margins) / inchesPer;
    return {
      cols: interiorWidth,
      rows: interiorHeight
    };
  }
};


/**
 * Default margin amounts, in inches.
 */
gpub.book.latex.defaultMargins = 0.5;

/**
 * Base bleed amount, in inches. Note: This is not the default, simple the
 * standard bleed amount. Note that printers want bleed on only exterior
 * edges
 */
gpub.book.latex.standardBleed  = 0.125;
