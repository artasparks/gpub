goog.provide('gpub.api');
goog.provide('gpub.create');

/**
 * Api Namespace. Some of the methods are attached at the top level for clarity.
 * @const
 */
gpub.api = {
  /**
   * Intended usage:
   *    gpub.init({...})
   *      .createSpec()
   *      .processSpec()
   *      .createDiagrams()
   *      .createBook()
   *
   * Equivalent to:
   *    gpub.create({...})
   *
   * @param {!gpub.Options} options to process
   * @return {!gpub.Api} A fluent API wrapper.
   */
  init: function(options) {
    gpub.api.validateInputs(options);
    return new gpub.Api(new gpub.Options(options));
  },

  /**
   * Create a 'book' output from SGFs.
   *
   * @param {!gpub.Options} options
   * @return {string}
   */
  create: function(options) {
    gpub.init(options)
        .createSpec()
        .processSpec()
        .renderDiagrams();

    // TODO(kashomon): Finish phase 4.
    return 'foo';
  },
};

/** @export */
gpub.create = gpub.api.create;
/** @export */
gpub.init = gpub.api.init;

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 *
 * @param {!gpub.Options} options
 * @package
 */
gpub.api.validateInputs = function(options) {
  if (!options) {
    throw new Error('No options defined');
  }
  var sgfs = options.sgfs;
  if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || !sgfs.length) {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
};

