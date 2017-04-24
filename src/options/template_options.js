goog.provide('gpub.opts.TemplateOptions');
goog.provide('gpub.opts.TemplateOptionsDef');


/**
 * @typedef {{
 *  template: (gpub.templates.Style|undefined),
 *  metadata: (!gpub.opts.Metadata|!gpub.opts.MetadataDef|undefined),
 *  frontmatter: (!gpub.opts.Frontmatter|undefined),
 *  appendices: (!gpub.opts.TemplateOptionsDef|undefined),
 *  pdfx1a: (boolean|undefined),
 *  colorProfileFilePath: (string|undefined),
 * }}
 */
gpub.opts.TemplateOptionsDef;


/**
 * @param {(!gpub.opts.TemplateOptions|!gpub.opts.TemplateOptionsDef)=} opt_options
 *
 * @constructor @struct @final
 */
gpub.opts.TemplateOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * @const {!gpub.opts.Metadata}
   */
  this.metadata = o.metadata ?
      new gpub.opts.Metadata(o.metadata) :
      new gpub.opts.Metadata({
        id: gpub.opts.Metadata.guid(),
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
   * @type {!gpub.opts.Frontmatter}
   */
  this.frontmatter = new gpub.opts.Frontmatter(o.frontmatter);

  /**
   * Appendices. E.g., Glossary, index, etc.
   * @const {!Object<string, string>}
   */
  // TODO(kashomon): Give a real options constructor to the appendices.
  this.appendices = o.appendices || {};

  /**
   * Number of diagrams or positions to a chapter (if chapters aren't already
   * defined).
   *
   * Templates are free to implement this as appropriate. For a problem book,
   * it might make sense for this to be the number of problems per chapter. For
   * a commentary book, it might make more sense for this to be the number of
   * main-variation diagrams.
   *
   * @const {number}
   */
  this.chapterSize = o.chapterSize || -1;

  /////////////////////
  // Special Options //
  /////////////////////

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (LaTeX/XeLaTeX).
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
 * Apply default options to raw template options. It's unlikely that
 * template-option-overrides would be provided, but it's here for completeness.
 *
 * @param {!gpub.opts.TemplateOptionsDef} opts
 * @param {!gpub.opts.TemplateOptionsDef} defaults
 * @return {!gpub.opts.TemplateOptionsDef}
 */
gpub.opts.TemplateOptions.applyDefaults = function(opts, defaults) {
  for (var key in defaults) {
    if (opts[key] === undefined && defaults[key] !== undefined) {
      opts[key] = defaults[key];
    }
  }
  return opts;
};
