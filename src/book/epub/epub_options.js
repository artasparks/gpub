goog.provide('gpub.book.epub.EpubOptions');

// TODO(kashomon): Generalize this and/or combine with book options.

/**
 * Options for ebook generation.
 * @param {!gpub.book.epub.EpubOptions=} opt_o
 * @constructor @struct @final
 */
gpub.book.epub.EpubOptions = function(opt_o) {
  var o = opt_o || {};

  if (!o.id) {
    throw new Error('Id was not defined. Options provided were: ' +
        JSON.stringify(o))
  }

  if (!o.title) {
    throw new Error('Title was not defined. Options provided were: ' +
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
  this.title = o.title || '';

  /** @type {string} */
  this.lang = o.lang || 'en';

  /** @type {string} */
  this.subject = o.subject || 'Go, Baduk, Wei-qi, Board Games, Strategy Games';

  /** @type {string} */
  this.description = o.description || '';

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
  this.generationDate = o.generationDate || (d.getUTCFullYear() +
      '-' + dpad(d.getUTCMonth() + 1) +
      '-' + dpad(d.getUTCDate()));

  /** @type {string} */
  this.publicationDate = o.publicationDate || '';
  if (this.publicationDate && (
      !/\d\d\d\d/.test(this.publicationDate) ||
      !/\d\d\d\d-\d\d-\d\d/.test(this.publicationDate))) {
    throw new Error('Publication date must have the form YYYY-MM-DD. ' +
        'Was: ' + this.publicationDate);
  }
};
