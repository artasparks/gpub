gpub.book.page = {};

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 */
gpub.book.page.sizeMapping = {
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

gpub.book.page.pageSize = {
  A4: 'A4',
  A5: 'A5',
  LETTER: 'LETTER',

  // http://en.wikipedia.org/wiki/Book_size
  QUARTO: 'QUARTO',
  OCTAVO: 'OCTAVO',

  NOTECARD: 'NOTECARD',

  TWELVEMO: 'TWELVEMO'
};
