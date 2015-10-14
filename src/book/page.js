gpub.book.page = {};

/**
 * Enum-like type enumerating the supported page sizes.
 */
gpub.book.page.type = {
  A4: 'A4',
  /** 8.5 x 11 */
  LETTER: 'LETTER',
  /** 6 x 9 */
  OCTAVO: 'OCTAVO',
  /** 5 x 7 */
  NOTECARD: 'NOTECARD',
  /** 8 x 10 */
  EIGHT_TEN: 'EIGHT_TEN',
  /** 5.5 x 8.5 */
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE'
};

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 */
gpub.book.page.size = {
  A4: {
    heightMm: 297,
    widthMm: 210,
    widthIn: 8.268,
    heightIn: 11.693
  },
  /** Standard printer paper. */
  LETTER: {
   heightMm: 280,
    widthMm: 210,
    heightIn: 11,
    widthIn: 8.5
  },
  /**
   * 6x9. Octavo is probably the most common size for professionally printed go
   * books.
   */
  OCTAVO: {
    heightMm: 229,
    widthMm: 152,
    heightIn: 9,
    widthIn: 6
  },
  /**
   * 5x7 paper. Doesn't have an official name, as far as I know, so we'll call
   * it Notecard.
   */
  NOTECARD: {
    heightMm: 178,
    widthMm: 127,
    heightIn: 7,
    widthIn: 5
  },

  /** Miscellaneous sizes, named by the size. */
  EIGHT_TEN: {
    heightMm: 254,
    widthMm: 203,
    heightIn: 10,
    widthIn: 8
  },
  FIVEFIVE_EIGHTFIVE: {
    heightMm: 216,
    widthMm: 140,
    heightIn: 8.5,
    widthIn: 5.3
  }
};
