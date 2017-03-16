goog.provide('gpub.book.Metadata');

/**
 * Grab bag of options for book generation.
 *
 * @param {!gpub.book.Metadata=} opt_o
 * @constructor @struct @final
 */
gpub.book.Metadata = function(opt_o) {
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
   * Unique identifier for this book.
   * @type {string}
   */
  this.id = o.id;

  /** @type {string} */
  this.idType = o.idType || 'uuid';

  /** @type {string} */
  this.idName = o.idName || 'baduk-epub-id';

  /** @type {string} */
  this.isbn10 = o.isbn10 || '';

  /** @type {string} */
  this.isbn13 = o.isbn13 || '';

  /**
   * URI Identifier.
   * @type {string}
   */
  this.uriId = o.uriId || 'http://github.com/Kashomon/gpub';

  /** @type {string}  */
  this.title = o.title || '';

  // TODO(kashomon): Add subtitles. Maybe.
  // https://www.mobileread.com/forums/showthread.php?t=210812
  // this.subtitle

  /** @type {string} */
  this.lang = o.lang || 'en';

  /** @type {string} */
  this.subject = o.subject || 'Go, Baduk, Wei-qi, Board Games, Strategy Games';

  /** @type {string} */
  this.description = o.description || '';

  /** @type {string} */
  this.rights = o.rights || 'All Rights Reserved.';

  /** @type {string} */
  this.publisher = o.publisher || '';

  /** @type {!Array<string>} */
  this.authors = o.authors || '';

  /** @type {string} */
  this.relation = o.relation || 'http://github.com/Kashomon/gpub';

  // simple padding function.
  var dpad = function(dnum) {
    return dnum < 10 ? '0' + dnum : '' + dnum;
  }

  var d = new Date();
  /**
   * ISO 8601 Date String
   * @type {string}
   */
  this.generationDate = o.generationDate ||
      d.toISOString().substring(0,19) + 'Z';
  // this.generationDate = o.generationDate || (d.getUTCFullYear() +
      // '-' + dpad(d.getUTCMonth() + 1) +
      // '-' + dpad(d.getUTCDate()));

  /** @type {string} */
  this.publicationDate = o.publicationDate || '';
  if (this.publicationDate && (
      !/\d\d\d\d/.test(this.publicationDate) ||
      !/\d\d\d\d-\d\d-\d\d/.test(this.publicationDate))) {
    throw new Error('Publication date must have the form YYYY-MM-DD. ' +
        'Was: ' + this.publicationDate);
  }
};

/**
 * A simple guide function
 * @return {string} guid with the format
 */
gpub.book.Metadata.guid = function() {
  // from stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};
