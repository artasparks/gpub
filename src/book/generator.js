/**
 * Constructs a book generator.
 */
gpub.book.generator = function(outputFormat, options) {
  if (!outputFormat) {
    throw new Error('No output format defined');
  }

  var package = gpub.book[outputFormat.toLowerCase()];
  if (!package) {
    throw new Error('No package defined for: ' + outputFormat);
  }
  if (!package.generator) {
    throw new Error('No generator implementation for: ' + outputFormat);
  }
  var gen = new gpub.book._Generator(options);

  // Copy over the methods from the implementations;
  for (var key in package.generator) {
    if (key && package.generator[key]) {
      gen[key] = package.generator[key].bind(gen);
    }
  }
  return gen;
};

/**
 * Generator interface.  All these metheds must be defined by the book-generator
 * implementations.
 */
gpub.book.Generator = {
  /**
   * Generate a 'book', whatever that means in the relevant context.
   *
   * Arguments:
   *  spec: The glift spec.
   *  options: The gpub options.
   *
   * Returns a string: the completed book.
   */
  generate: function(spec) {},

  /**
   * Return the template string for the book processor.
   */
  template: function() {},
};

/**
 * Abstract book generator. Provides default methods and constructor.
 */
gpub.book._Generator = function(options) {
  this._opts = options;
}

gpub.book._Generator.prototype = {

  /**
   * Concrete options-getter method.
   */
  options: function() {
    return this._opts;
  }
};
