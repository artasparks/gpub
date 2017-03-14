goog.provide('gpub.templates.Templater');
goog.provide('gpub.templates.Input');
goog.provide('gpub.templates.Output');

/**
 * Input options to a Templater function.
 * @typedef {(!gpub.Options|!gpub.spec.Spec)}
 */
gpub.templates.Input;

/**
 * Output options to a templater function
 * @typedef {{
 *  files: !Array<!gpub.book.File>,
 *  spec: gpub.spec.Spec
 * }}
 */
gpub.templates.Output;

/**
 * @typedef {function(gpub.templates.Input):!gpub.templates.Output}
 */
gpub.templates.Templater;
