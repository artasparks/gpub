goog.provide('gpub.templates');
goog.provide('gpub.templates.Style');


/**
 * Namespace for templates library.
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
 * Gets a templater function.
 * @param {gpub.templates.Style} style
 * @return {!gpub.templates.Templater} template function
 */
gpub.templates.getTemplater = function(style) {
  switch(style) {
    default:
      throw new Error('Unknown or unsupported style: ' + style);
  }
};
