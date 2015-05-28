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
 * intersectionSize: In point-size. Note that 1 pt = 1/72 of an inch.
 * rlMargins: Optional. In inches. Currently pretty crude.
 * bleed: Optional. Not used at the moment.
 */
gpub.book.latex.Paging = function(
    pageType,
    intersectionSize,
    margins,
    bleed) {
  this.buffer = [];

  /** Size of the pages produced by the paging factory. */
  this.pageSize = pageSize ||
      gpub.book.page.type.LETTER;

  // TODO(kashomon): Support margins.
  this.margins = rlMargins ||
      gpub.book.latex.defaultMargins;

  /**
   * Size of the go-board intersections in pt.
   */
  this.intersectionSize = intersectionSize;

  /** The bleed amount in inches. Exterior edges only. */
  this.bleed = bleed || 0;

  /** The current page, for the purposes of adding diagrams */
  this.currentPage = null;

  /** Total pages, minus the current page*/
  this.pages = [];
};

gpub.book.latex.Paging.prototype = {
  /**
   * Adds a diagram to the paging tracker.
   */
  addDiagram: function(
      diagramType,
      diagramString,
      context,
      flattened) {
    var contextualized = gpub.book.latex.context.typeset(
        opts.diagramType, diagram, ctx, flattened);
    if (!this.currentPage) {
      this.currentPage = this.newPage();
    }
    if (this.currentPage.isFull()) {
      this.flushPage();
    }
    this.currentPage.addDiagram(contextualized);
  },

  /** Creates a new page */
  newPage: function() {
    // TODO(kashomon): Pass in page details
    return new gpub.book.latex.Page();
  },

  /** Flush the page to the finished 'pages'. */
  flushPage: function() {
    if (!this.currentPage) {
      return;
    }
    this.pages.push(this.currentPage);
    this.currentPage = this.newPage();
  },

  /** Flush the pages buffer as a string. */
  flushAll: function() {
    if (this.currentPage && !this.currentPage.isEmpty()) {
      this.flushPage();
    }
    var out = [];
    for (var i = 0; i < this.pages.length; i++) {
      out.push(pages[i].flush());
    }
    return out.join('\n');
  },

  /**
   * Returns the relevant latex preamble. Should be added to the document
   * before page construction.
   */
  pagePreamble: function() {
    return [
      this._pageSizeSetting(),
      this._marginSetting(),
      this.bleed ? this._trimSetting() : '',
      '\\checkandfixthelayout', // Do we need this here?
    ].join('\n');
  },

  /**
   * Sets the page size for the memoir class. I.e., returns the relevant latex
   * command.
   */
  _pageSizeSetting: function() {
    var size = gpub.boox.page.sizeMapping[this.pageSize];
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
    return '\\setlrmarginsandblock{' + this.rlMargins + 'in}{' +
        this.rlMargins + 'in}{*}';
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
 * A page instance. Should be crated with the Paging factory.
 */
gpub.book.latex.Page = function(rows, cols) {
  this.rows = rows;

  this.cols = cols;

  this.diagramCount = 0;

  this.buffer = [];
};

gpub.book.latex.Page.prototype = {
  /** Add a diagram to the page. */
  addDiagram: function(str) {
    this.buffer.push(str);
    this.diagramCount++;
    return this;
  },

  /** Returns whether or not the page thinks it's full. */
  isFull: function() {
    // TODO(kashomon): This is a hack to preserve the current behavior while we
    // figure out how this should work.
    return this.diagramCount >= 2
  },

  /** Clear the page lines */
  flush: function() {
    var out = this.buffer.join('\n');
    this.buffer = [];
    return out;
  },

  isEmpty: function() {
    return this.buffer.length != 0;
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

