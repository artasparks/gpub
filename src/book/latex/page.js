/**
 * Page context wrapper. I think this will probably -- at least for now -- be a
 * LaTeX consideration.
 */
gpub.book.latex.Page = function() {
  this.buffer = [];
};

gpub.book.latex.Page.prototype = {
  /** Add a diagram to the page. */
  addDiagram: function(str, context, comment, label, isMainLine) {

  },

  /** Clear the page lines */
  flush: function() {
    var out = this.buffer.join('\n');
    this.buffer = [];
    return out;
  }
};

gpub.book.latex.pageSize = {
  A4: 'A4',
  A5: 'A5',
  LETTER: 'LETTER',

  // http://en.wikipedia.org/wiki/Book_size
  QUARTO: 'QUARTO',
  OCTAVO: 'OCTAVO',
  TWELVEMO: 'TWELVEMO'
};
