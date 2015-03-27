/**
 * Page context wrapper.
 */
gpub.book.Page = function() {
  this.lines = [];
};

gpub.book.Page.prototype = {
  /** Add a diagram to the page. */
  addDiagram: function(lines, comment) {
  },

  /** Clear the page lines */
  flush: function() {
    var out = this.lines.join('\n');
    this.lines = [];
    return out;
  }
};

gpub.book.pageSize = {
  A4: 'A4',
  A5: 'A5',
  LETTER: 'LETTER',

  // http://en.wikipedia.org/wiki/Book_size
  QUARTO: 'QUARTO',
  OCTAVO: 'OCTAVO',
  TWELVEMO: 'TWELVEMO'
};
