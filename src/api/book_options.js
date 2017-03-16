goog.provide('gpub.api.BookOptions');
goog.provide('gpub.api.Frontmatter');

/**
 * @param {!gpub.api.BookOptions=} opt_options
 *
 * @constructor @struct @final
 */
gpub.api.BookOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * The type of template to use.
   *
   * @const {gpub.templates.Style}
   */
  this.template = o.template ||
      gpub.templates.Style.RELENTLESS_COMMENTARY_LATEX;

  /**
   * @const {!gpub.book.Metadata}
   */
  this.metadata = o.metadata ?
      new gpub.book.Metadata(o.metadata) :
      new gpub.book.Metadata({
        id: gpub.book.Metadata.guid(),
        title: 'My Go Book!',
      });

  /**
   * Frontmatter is text supporting the bulk of the the work that comes
   * before/after the mainmatter of the book.
   *
   * Note: It's expected that the frontmatter (except for the copyright page)
   * will be specified as a markdown-string.
   *
   * Not all of these will be supported by all the book-generators. For those
   * that do support the relevant sections, the frontmatter and backmatter are
   * dumped into the book options.
   *
   * @type {!gpub.api.Frontmatter}
   */
  this.frontmatter = new gpub.api.Frontmatter(o.frontmatter);

  /**
   * Appendices. E.g., Glossary, index, etc.
   * @const {!Object<string, string>}
   */
  // TODO(kashomon): Give a real options constructor to the appendices.
  this.appendices = o.appendices || {};
};

/**
 * @param {!gpub.api.Frontmatter} options
 *
 * @constructor @struct @final
 */
gpub.api.Frontmatter = function(options) {
  var o = options || {};

  // epigraph: null, // AKA Quote Page

  /** @type {?string} */
  this.foreword = o.foreword || null;  // Author or unrelated person

  /** @type {?string} */
  this.preface = o.foreword || null; // Author

  /** @type {?string} */
  this.acknowledgements = o.acknowledgements || null;

  /** @type {?string} */
  this.introduction = o.introduction || null;

  /**
   * Generate the Table of Contents or just 'Contents'.
   * @type {boolean}
   */
  this.generateToc = !!o.generateToc;

  /**
   * Generates the copyright page. Copyright should be an object with the
   * format listed below:
   *
   *  {
   *     "publisher": "Foo Publisher",
   *     "license": "All rights reserved.",
   *     "publishYear": 2015,
   *     "firstEditionYear": 2015,
   *     "isbn": "1-1-123-123456-1",
   *     "issn": "1-123-12345-1",
   *     "addressLines": [
   *        "PO #1111",
   *        "1111 Mainville Road Rd, Ste 120",
   *        "Fooville",
   *        "CA 90001",
   *        "www.fooblar.com"
   *     ],
   *     "showPermanenceOfPaper": true,
   *     "printingRunNum": 1
   *  }
   * @type {!Object}
   */
  // TODO(kashomon): Make a proper type.
  this.copyright = o.copyright || null;

  /////////////////////
  // Special Options //
  /////////////////////

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (latex).
   *
   * Most printers will require this option to be set.
   *
   * @const {boolean}
   */
  this.pdfx1a = o.pdfx1a || false;

  /**
   * An option only for PDF/X-1a. For this spceification, you must specify a
   * color profile file (e.g., ISOcoated_v2_300_eci.icc).
   *
   * @const {?string}
   */
  this.colorProfileFilePath = o.colorProfileFilePath || null;
};
