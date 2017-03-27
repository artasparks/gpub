goog.provide('gpub.templates.Templater');
goog.provide('gpub.templates.BookInput');

/**
 * Input options to the Templater function.
 *
 * @typedef {(!gpub.Options|!gpub.spec.Spec)}
 */
gpub.templates.BookInput;

/**
 * @typedef {function(gpub.templates.BookInput):!gpub.templates.BookOutput}
 */
gpub.templates.Templater;
