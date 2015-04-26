///////////////////
// Experimental! //
///////////////////

/**
 * Page context wrapper. I think this will probably -- at least for now -- be a
 * LaTeX consideration.
 */
gpub.book.latex.Page = function(pageSize) {
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
    heightIn: 11.693,
    widthMm: 210,
    widthIn: 8.268
  },
  LETTER: {
    height: 280, // 11 in
    width: 210 // 8.5 in
  },
  OCTAVO: {
    height: 229, // 9 in,
    width: 152 // 6 in
  },
  NOTECARD: {
    height:178, // 7 in
    width:127 // 5 in
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
