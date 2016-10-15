goog.provide('gpub.api');
goog.provide('gpub.create');

/**
 * Api Namespace. Some of the methods are attached at the top level for clarity.
 * @const
 */
gpub.api = {
  /**
   * Create a 'book' output from SGFs.
   *
   * @param {!gpub.Options} options
   * @return {string}
   */
  create: function(options) {
    gpub.init(options)
        .createSpec()
        .processSpec();

    // TODO(Kashomon): Finish phase 3 & 4.
    return 'foo';
  },
};

/** @export */
gpub.create = gpub.api.create;

////////////////////////
// Methods in the API //
////////////////////////



/////////////
// Private //
/////////////

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

