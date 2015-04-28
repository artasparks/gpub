/**
 * (Currently Experimental) Page context wrapper for LaTeX.
 */
gpub.book.latex.Page = function(pageSize, bleed, margin) {
  this.buffer = [];

  // TODO(kashomon): Set via page size
  this.rows = 0;
  this.cols = 0;

  this.bleed = 0.125;

  this.margins = 0.25;

  this.pageSize = pageSize;
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
