goog.provide('gpub.book.epub.EpubOptions');

/**
 * @param {!gpub.book.epub.EpubOptions=} opt_o
 * @constructor @struct @final
 */
gpub.book.epub.EpubOptions = function(opt_o) {
  var o = opt_o || {};

  if (!o.id) {
    throw new Error('Id was not defined. Options were: ' +
        JSON.stringify(o))
  }

  /**
   * Should be an ISBN, if it's available.
   * @type {string}
   */
  this.id = o.id;

  /** @type {string} */
  this.isbn = o.isbn || '';

  /**
   * URI Identifier.
   * @type {string}
   */
  this.uriId = o.uriId || 'http://github.com/Kashomon/gpub';

  /** @type {string}  */
  this.title = o.title || 'My Go Book';

  /** @type {string} */
  this.lang = o.lang || 'en';

  /** @type {string} */
  this.subject = o.subject || 'Go, Baduk, Wei-qi, Board Games, Strategy Games';

  /** @type {string} */
  this.description = o.description || 'A Go book!';

  /** @type {string} */
  this.rights = o.rights || 'All Rights Reserved.'

  /** @type {string} */
  this.publisher = o.publisher || '';

  /** @type {string} */
  this.creator = o.creator || ''; // AKA Author.

  /** @type {string} */
  this.relation = o.relation || 'http://github.com/Kashomon/gpub';

  var dpad = function(dnum) {
    return dnum < 10 ? '0' + dnum : '' + dnum;
  }
  var d = new Date();
  /**
   * ISO 8601 Date String
   * @type {string}
   */
  this.date = o.date || (d.getUTCFullYear() +
      '-' + dpad(d.getUTCMonth() + 1) +
      '-' + dpad(d.getUTCDate()));
};
