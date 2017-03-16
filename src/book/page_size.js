goog.provide('gpub.book.PageSize');
goog.provide('gpub.book.pageDimensions');
goog.provide('gpub.book.PageDim');


goog.scope(function() {

/**
 * Some predefined page sizes for convenince.
 * @enum {string}
 */
gpub.book.PageSize = {
  A4: 'A4',
  /** Standard printer paper. */
  LETTER: 'LETTER',
  /**
   * 6x9. Octavo is probably the most common size for professionally printed go
   * books.
   */
  OCTAVO: 'OCTAVO',
  /**
   * 5x7 paper. Doesn't have an official name, as far as I know, so we'll call
   * it Notecard.
   */
  NOTECARD: 'NOTECARD',

  /** 8x10. Miscellaneous sizes, named by the size. */
  EIGHT_TEN: 'EIGHT_TEN',
  /** 5.5 x 8.5 */
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE',
};

/**
 * @typedef{{
 *  heightMm: number,
 *  widthMm: number,
 *  heightIn: number,
 *  widthIn: number
 * }}
 */
gpub.book.PageDim;

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 * @type {Object<gpub.book.PageSize,gpub.book.PageDim>}
 *
 */
gpub.book.pageDimensions = {};

var pd = gpub.book.pageDimensions;
var ps = gpub.book.PageSize;

pd[ps.A4] = {
  heightMm: 297,
  widthMm: 210,
  widthIn: 8.268,
  heightIn: 11.693
};
pd[ps.LETTER] = {
 heightMm: 280,
  widthMm: 210,
  heightIn: 11,
  widthIn: 8.5
};
pd[ps.OCTAVO] = {
  heightMm: 229,
  widthMm: 152,
  heightIn: 9,
  widthIn: 6
};
pd[ps.NOTECARD] = {
  heightMm: 178,
  widthMm: 127,
  heightIn: 7,
  widthIn: 5
};
pd[ps.EIGHT_TEN] = {
  heightMm: 254,
  widthMm: 203,
  heightIn: 10,
  widthIn: 8
};
pd[ps.FIVEFIVE_EIGHTFIVE] = {
  heightMm: 216,
  widthMm: 140,
  heightIn: 8.5,
  widthIn: 5.3
};

})  // goog.scope
