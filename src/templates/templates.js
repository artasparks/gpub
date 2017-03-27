goog.provide('gpub.templates');
goog.provide('gpub.templates.Style');
goog.provide('gpub.templates.BookOutput');


/**
 * Namespace for templates library.
 * @namespace
 */
gpub.templates = {};


/**
 * Built-in Styles.
 *
 * @enum {string}
 */
gpub.templates.Style = {
  /**
   * A Commentary-style template used to create the Relentless.
   */
  RELENTLESS_COMMENTARY_LATEX: 'RELENTLESS_COMMENTARY_LATEX',

  /**
   * A template designed to make problem PDFs.
   */
  PROBLEM_LATEX: 'PROBLEM_LATEX',

  /**
   * A template designed to make problem Ebooks.
   */
  PROBLEM_EBOOK: 'PROBLEM_EBOOK',
};


/**
 * Output of the create method.
 *
 * @typedef {{
 *  files: !Array<!gpub.book.File>,
 *  spec: gpub.spec.Spec
 * }}
 */
gpub.templates.BookOutput;


/**
 * Decides which templater method to use based on the style.
 *
 * @param {gpub.templates.Style} style The template style
 * @param {!gpub.OptionsDef|!gpub.Options} opt Options to process.
 * @return {!gpub.templates.BookOutput} output.
 */
gpub.templates.muxer = function(style, opt) {
  switch(style) {
    case 'RELENTLESS_COMMENTARY_LATEX':
      return /** @type {!gpub.templates.BookOutput} */ ({});
    default:
      throw new Error('Unknown or unsupported style: ' + style);
  }
};
