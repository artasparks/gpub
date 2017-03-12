goog.provide('gpub.templates');
goog.provide('gpub.templates.Style');
goog.provide('gpub.templates.Templater');


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
 * @private {!Object<gpub.templates.Style, gpub.templates.Templater>}
 */
gpub.templates.registry_ = {};


/**
 * @typedef {function()}
 */
gpub.templates.Templater;
