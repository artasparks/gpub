/**
 * Package for creating the 'books'! A book, in this context, is simply defined
 * as a generated string that contains rendered SGF data.
 */
gpub.book = {
  /** Creates a book! */
  create: function(spec, options) {
    this._validate(spec);
    var generator = this._getGenerator(options);
    return package.generator().generate(spec, options);
  },

  _validate: function(spec) {
    if (spec.sgfCollection.length < 1) {
      throw new Error('sgfCollection must be non-empty');
    }
  },

  _getGenerator: function(options) {
    var outputFormat = options.outputFormat;
    if (!outputFormat) {
      throw new Error('No output format defined');
    }
    var package = gpub.book[outputFormat.toLowerCase()];
    if (!package) {
      throw new Error('No package defined for: ' + outputFormat);
    }
    return package.generator();
  }
};
