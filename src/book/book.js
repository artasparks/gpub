/**
 * Package for creating the 'books'! A book, in this context, is simply defined
 * as a generated string that contains rendered SGF data.
 */
gpub.book = {
  /** Creates a book! */
  create: function(spec, options) {
    this._validate(spec);
    var gen = this.generator(options.outputFormat, options);
    return gen.generate(spec, options);
  },

  _validate: function(spec) {
    if (spec.sgfCollection.length < 1) {
      throw new Error('sgfCollection must be non-empty');
    }
  }
};
