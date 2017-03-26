goog.provide('gpub.api.TemplateOptions');
goog.provide('gpub.api.TemplateOptionsDef');
goog.provide('gpub.api.Frontmatter');


/**
 * @typedef {{
 *  template: (gpub.templates.Style|undefined),
 *  metadata: (!gpub.book.Metadata|!gpub.book.MetadataDef|undefined),
 *  frontmatter: (!gpub.api.Frontmatter|undefined),
 *  appendices: (!gpub.api.TemplateOptionsDef|undefined),
 * }}
 */
gpub.api.TemplateOptionsDef;


/**
 * @param {(!gpub.api.TemplateOptions|!gpub.api.TemplateOptionsDef)=} opt_options
 *
 * @constructor @struct @final
 */
gpub.api.TemplateOptions = function(opt_options) {
  var o = opt_options || {};

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
 * @param {!gpub.api.Frontmatter=} options
 *
 * @constructor @struct @final
 */
gpub.api.Frontmatter = function(options) {
  var o = options || {};

  // epigraph: null, // AKA Quote Page

  /** @type {string|undefined} */
  this.foreword = o.foreword || undefined;  // Author or unrelated person

  /** @type {string|undefined} */
  this.preface = o.foreword || undefined; // Author

  /** @type {string|undefined} */
  this.acknowledgements = o.acknowledgements || undefined;

  /** @type {string|undefined} */
  this.introduction = o.introduction || undefined;

  /**
   * Generate the Table of Contents or just 'Contents'. Defaults to true.
   * @type {boolean}
   */
  this.generateToc = o.generateToc !== undefined ? !!o.generateToc : true;

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
   * @const {string|undefined}
   */
  this.colorProfileFilePath = o.colorProfileFilePath || undefined;
};

/**
 * Merge a new options object into this object
 * @param {!gpub.api.TemplateOptions} opt
 * @return {!gpub.api.TemplateOptions}
 */
gpub.api.TemplateOptions.prototype.merge = function(opt) {
  return new gpub.api.TemplateOptions();
};
