goog.provide('gpub.api');
goog.provide('gpub.create');
goog.provide('gpub.init');


/**
 * Api Namespace.
 * @namespace
 */
gpub.api = {};


/**
 * Init creates a fluent-api instance, which allows fine-grained control over
 * how a book is created.
 *
 * Intended usage:
 *    gpub.init({...options...})
 *      .createSpec()
 *      .processSpec()
 *      .createDiagrams()
 *      .bookMaker()
 *
 * @param {!gpub.Options|!gpub.OptionsDef} opt Options to process
 * @return {!gpub.Api} A fluent API wrapper.
 * @export
 */
gpub.init = function(opt) {
  if (!glift) {
    throw new Error('Gpub depends on Glift, but Glift was not defined');
  }
  return new gpub.Api(new gpub.Options(opt));
};

/**
 * Init creates a fluent-api instance, which allows fine-grained control over
 * how a book is created.
 *
 * Intended usage:
 *    gpub.initFromSpec(<spec>)
 *      [.processSpec() optional]
 *      .createDiagrams()
 *      .bookMaker()
 *
 * @param {!gpub.spec.Spec|!gpub.spec.SpecDef|string} spec Spec definition.
 *    Note: if the parameter is a string, it's assummed to be JSON and
 *    deserialized as such.
 * @return {!gpub.Api} A fluent API wrapper.
 * @export
 */
gpub.initFromSpec = function(spec) {
  if (!glift) {
    throw new Error('Gpub depends on Glift, but Glift was not defined');
  }
  return new gpub.Api(new gpub.Options()) // Use a dummy options
    .createSpec(spec);
}


/**
 * Creates a 'book' output from SGFs given a template. In other words,
 * auto-magic book creation.
 *
 * Under the covers, all the book 'templates' use the standard fluent-api to
 * create books.
 *
 * For this creation method, the template parameter *must* be defined. Thus, a
 * minimal options object looks like:
 *
 * {
 *  template: 'PROBLEM_EBOOK',
 *  sgfs: {
 *    <id>: <contents>
 *    ...
 *  }
 * }
 *
 * Note: If various option parameters are not defined in the Options-param,
 * then various defaults are set.
 * - First, we check to see if defaults are set by the template-style.
 * - Then, we any defaults given by the options constructor.
 *
 * @param {!gpub.OptionsDef|!gpub.Options} opt Options to process.
 * @return {gpub.templates.BookOutput}
 * @export
 */
gpub.create = function(opt) {
  if (!opt) {
    throw new Error('Options must be defined. Was: ' + opt);
  }
  var template = opt.template;
  if (!template) {
    throw new Error('Template style (options.template) must be defined.')
  }
  return gpub.templates.chooser(template, opt);
};
