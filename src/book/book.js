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
  },

  /**
   * Gets the book options from the SGF.
   */
  _getBookOptions: function(sgf) {
    var startTag = "<METADATA>";
    var endTag = "</END_METADATA>";
    var mgr = glift.widgets.createNoDraw(spec);
    var sgfObj = mgr.loadSgfStringSync(mgf.getSgfObj(0));
    return '';
  }
};
