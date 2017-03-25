goog.provide('gpub.api');
goog.provide('gpub.create');
goog.provide('gpub.init');

/**
 * Api Namespace. Some of the methods are attached at the top level for clarity.
 * @const
 */
gpub.api = {};


/**
 * Intended usage:
 *    gpub.init({...options...})
 *      .createSpec()
 *      .processSpec()
 *      .createDiagrams()
 *      .createBook()
 *
 * Equivalent to:
 *    gpub.create({...})
 *
 * @param {!gpub.Options|!gpub.OptionsDef} options to process
 * @return {!gpub.Api} A fluent API wrapper.
 * @export
 */
gpub.init = function(options) {
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
  return new gpub.Api(new gpub.Options(options));
};


/**
 * Create a 'book' output from SGFs.
 *
 * @param {!gpub.Options|!gpub.OptionsDef} options
 * @return {string}
 * @export
 */
gpub.create = function(options) {
  gpub.init(options)
      .createSpec()
      .processSpec()
      .renderDiagrams();

  // TODO(kashomon): Finish phase 4.
  return 'foo';
};
