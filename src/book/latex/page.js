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
 * The paging instance is a factory for pages. In particulary, we don't want
 */
gpub.book.latex.Paging = function(pageSize, margin, intersectionSize, bleed) {
  this.buffer = [];

  // TODO(kashomon): Set via page size.  This
  this.rows = 0;
  this.cols = 0;

  this.pageSize = pageSize ||
      gpub.book.latex.pageSize.LETTER;

  this.margins = margins ||
      gpub.book.latex.Page.defaultMargins;

  this.intersectionSize = intersectionSize;

  this.bleed = bleed || 0;
};

gpub.book.latex.Paging.prototype = {
  /** Creates a new page */
  newPage: function() {
    return new gpub.book.latex.Page();
  }
};


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
gpub.book.latex.Page.defaultMargins = 0.5;

/**
 * Base bleed amount, in inches. Note: This is not the default, simple the
 * standard bleed amount. Note that many printers want bleed on only exterior
 * edges.
 */
gpub.book.latex.Page.standardBleed  = 0.125;

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
