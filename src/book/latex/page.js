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
 * pageSize: A member of gpub.book.latex.pageSize;
 * margin: In inches.
 * intersectionSize: In point-size. Note that 1 pt = 1/72 of an inch.
 */
gpub.book.latex.Paging = function(
    pageSize,
    margin,
    intersectionSize,
    bleed) {
  this.buffer = [];

  this.pageSize = pageSize ||
      gpub.book.latex.pageSize.LETTER;

  this.margins = margins ||
      gpub.book.latex.defaultMargins;

  this.intersectionSize = intersectionSize;

  this.bleed = bleed || 0;
};

gpub.book.latex.Paging.prototype = {
  /** Creates a new page */
  newPage: function() {
    return new gpub.book.latex.Page();
  },

  /**
   * returns
   * {
   *  rows: X (as float).
   *  cols: X (as float).
   * }
   */
  calculateUnits: function() {
    var intPt = this.intersectionSize;
    var inchesPer = initPt / 72;
    var sizeObj = gpub.book.latex.sizeMapping[this.pageSize];
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
};

gpub.book.latex.Page.prototype = {
  /** Add a diagram to the page. */
  addDiagram: function(flattened) {
  },

  /** Clear the page lines */
  flush: function() {
    var out = this.buffer.join('\n');
    this.buffer = [];
    return out;
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

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 */
gpub.book.latex.sizeMapping = {
  A4: {
    heightMm: 297,
    widthMm: 210,
    widthIn: 8.268,
    heightIn: 11.693
  },
  LETTER: {
    heightMm: 280,
    widthMm: 210,
    heightIn: 11,
    widthIn: 8.5
  },
  OCTAVO: {
    heightMm: 229,
    widthMm: 152,
    heightIn: 9,
    widthIn: 6
  },
  NOTECARD: {
    heightMm: 178,
    widthMm: 127,
    heightIn: 7,
    widthIn: 5
  }
};

gpub.book.latex.pageSize = {
  A4: 'A4',
  A5: 'A5',
  LETTER: 'LETTER',

  // http://en.wikipedia.org/wiki/Book_size
  QUARTO: 'QUARTO',
  OCTAVO: 'OCTAVO',

  NOTECARD: 'NOTECARD',

  TWELVEMO: 'TWELVEMO'
};
