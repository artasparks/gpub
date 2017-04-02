goog.provide('gpub.book.Metadata');
goog.provide('gpub.book.MetadataDef');

/**
 * Many of these fields are specific to Ebooks.
 *
 * @typedef {{
 *  id: string,
 *  title: string,
 *  subtitle: (string|undefined),
 *  idType: (string|undefined),
 *  idName: (string|undefined),
 *  isbn10: (string|undefined),
 *  isbn13: (string|undefined),
 *  uriId: (string|undefined),
 *  lang: (string|undefined),
 *  subject: (string|undefined),
 *  description: (string|undefined),
 *  rights: (string|undefined),
 *  publisher: (string|undefined),
 *  authors: (!Array<string>|undefined),
 *  generationDate: (string|undefined),
 *  addressLines: (!Array<string>|undefined),
 *  printingRunNum: (number|undefined),
 *  permanenceOfPaper: (boolean|undefined),
 * }}
 */
gpub.book.MetadataDef


/**
 * Grab bag of options for book generation.
 *
 * @param {(!gpub.book.Metadata|!gpub.book.MetadataDef)=} opt_o
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

  /**
   * Title of the book. Must be defined.
   * @type {string}
   */
  this.title = o.title;

  /**
   * Subtitle of the book.
   * @type {string}
   */
  // TODO(kashomon): Maybe include as part of the epub metadata:
  // https://www.mobileread.com/forums/showthread.php?t=210812
  this.subtitle = o.subtitle || '';

  /**
   * What kind of ID is the ID?
   * @type {string}
   */
  this.idType = o.idType || 'uuid';

  /**
   * ID by which to identify the ID. This probably doesn't need to be changed.
   * @type {string}
   */
  this.idName = o.idName || 'baduk-epub-id';

  /**
   * The 10-digit ISBN. Sometimes called the ISSN. ISSN contains not publisher
   * information.
   * http://www.bl.uk/bibliographic/issn.html
   * @type {string}
   */
  this.isbn10 = o.isbn10 || '';

  /**
   * The 13-digit ISBN (the standard ISBN). The prefix identifies the
   * publisher.
   * @type {string}
   */
  this.isbn13 = o.isbn13 || '';

  /**
   * URI Identifier.
   * @type {string}
   */
  this.uriId = o.uriId || 'http://github.com/Kashomon/gpub';

  /**
   * Language of the text.
   * https://idpf.github.io/a11y-guidelines/content/xhtml/lang.html
   * @type {string}
   */
  this.lang = o.lang || 'en';

  /**
   * Subject matter.
   * @type {string}
   */
  this.subject = o.subject || 'Go, Baduk, Wei-qi, Board Games, Strategy Games';

  /**
   * Description of the book. Generally a good idea to fill in.
   * @type {string}
   */
  this.description = o.description || '';

  /**
   * What should the copyright should be used? By default: all rights reserved.
   * @type {string}
   */
  this.rights = o.rights || 'All Rights Reserved.';

  /** @type {string} */
  this.publisher = o.publisher || '';

  var auth = o.authors
  if (auth && typeof auth == 'string') {
    auth = [auth];
  }
  /** @type {!Array<string>} */
  this.authors = auth || [];

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

  /**
   * Address lines. Generally for a copyright page.
   * @type {!Array<string>}
   */
  this.addressLines = o.addressLines || [];

  /**
   * Year this book was first published.
   * @type {number|undefined}
   */
  this.publishYear = o.publishYear || undefined;

  ///////////////////////////
  // Types used for print. //
  ///////////////////////////

  /**
   * The printing run of the book. Generally only applies to print-books and is
   * only for the copyright page.
   * @type {number|undefined}
   */
  this.printingRunNum = o.printingRunNum || undefined;

  /**
   * Permanence of paper marker. If true (the default), the symbol is displayed
   * (if the book-type supports the symbol).
   *
   * @type {boolean}
   */
  this.permanenceOfPaper = o.permanenceOfPaper !== undefined ?
      !!o.permanenceOfPaper : true;
};

/**
 * A simple guide function
 * @return {string} guid with the format
 */
gpub.book.Metadata.guid = function() {
  // From stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};
