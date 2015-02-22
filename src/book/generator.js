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

  var defOpts = gen.defaultOptions();
  if (defOpts) {
    for (var key in defOpts) {
      if (!gen._opts[key]) {
        gen._opts[key] = defOpts[key];
      }
    }
  }

  return gen;
};

/**
 * Generator interface.  All these metheds must be defined by the book-generator
 * implementations.
 */
gpub.book.Gen = {
  /**
   * Generates a 'book', whatever that means in the relevant context.
   *
   * Arguments:
   *  spec: The glift spec.
   *  options: The gpub options.
   *
   * Returns a string: the completed book.
   */
  generate: function(spec) {},

  /**
   * Returns the default template string for the specific book processor.
   */
  defaultTemplate: function() {},

  /**
   * Returns the default options for the specific book processor.
   */
  defaultOptions: function() {},
};

/**
 * Abstract book generator. Provides default methods and constructor.
 */
gpub.book._Generator = function(options) {
  this._opts = glift.util.simpleClone(options || {});
};

gpub.book._Generator.prototype = {
  /**
   * Shared options-getter method.
   */
  options: function() {
    return this._opts;
  },

  /**
   * Helper function for looping over each SGF in the SGF collection.
   */
  forEachSgf: function(spec, fn) {
    var mgr = glift.widgets.createNoDraw(spec);
  },

  /**
   * Returns the template to use. Use the user provided template if it exists;
   * otherwise, default to the default template for the output format.
   */
  template: function() {
    var opts = this.options();
    if (opts.template) {
      return opts.template;
    } else {
      return this.defaultTemplate();
    }
  }
};
