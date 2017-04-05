goog.provide('gpub.templates');
goog.provide('gpub.templates.Style');
goog.provide('gpub.templates.BookOutput');
goog.provide('gpub.templates.Templater');


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
 * Registry of templater classes.
 * @private {!Object<gpub.templates.Style, !gpub.templates.Templater>}
 */
gpub.templates.registry_ = {}


/**
 * Registers a templater.
 * @param {!gpub.templates.Style} style
 * @param {!gpub.templates.Templater} tpl
 */
gpub.templates.register = function(style, tpl) {
  if (gpub.templates.registry_[style]) {
    throw new Error('Templater already defined for style: ' + style);
  }
  gpub.templates.registry_[style] = tpl;
};


/**
 * A templater takes options and returns files and a completed spec.
 * @record
 */
gpub.templates.Templater = function() {}


/**
 * Creates a book!
 * @param {!gpub.OptionsDef} opts
 * @return {!gpub.templates.BookOutput}
 */
gpub.templates.Templater.prototype.create = function(opts) {}


/**
 * Decides which templater method to use based on the style.
 *
 * @param {gpub.templates.Style} style The template style
 * @param {!gpub.OptionsDef} opts Options to process.
 * @return {!gpub.templates.BookOutput} output.
 */
gpub.templates.muxer = function(style, opts) {
  if (!style) {
    throw new Error('Style was not defined. Was: ' + style);
  }
  var templater = gpub.templates.registry_[style];
  if (!templater) {
    throw new Error('No templater defined for type: ' + style);
  }
  return templater.create(opts);
};
