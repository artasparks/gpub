goog.provide('gpub.templates.Templater');
goog.provide('gpub.templates.BookInput');
goog.provide('gpub.templates.BookOutput');

/**
 * Input options to a Templater function.
 * @typedef {(!gpub.Options|!gpub.spec.Spec)}
 */
gpub.templates.BookInput;

/**
 * Output options to a templater function
 * @typedef {{
 *  files: !Array<!gpub.book.File>,
 *  spec: gpub.spec.Spec
 * }}
 */
gpub.templates.BookOutput;

/**
 * @typedef {function(gpub.templates.BookInput):!gpub.templates.BookOutput}
 */
gpub.templates.Templater;
