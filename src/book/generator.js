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

  if (!gen.defaultOptions) {
    throw new Error('No default options defined for type: ' + outputFormat);
  }

  var defOpts = gen.defaultOptions();
  if (defOpts) {
    for (var key in defOpts) {
      if (defOpts[key] && !gen._opts[key]) {
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

  /** Map from first 50 bytes + last 50 bytes of the SGF to the full SGF */
  this._parseCache = {};
};

gpub.book._Generator.prototype = {
  /** Returns the 'view' for filling out a template. */
  view: function(spec) {
    if (!spec) { throw new Error('Spec must be defined. Was: ' + spec) };

    var view = glift.util.simpleClone(this._opts.bookOptions);
    var mgr = this.manager(spec);
    var firstSgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(0));
    var mt = this.getMovetree(firstSgfObj);
    var globalMetadata = mt.metadata();
    // Should we defer to the book options or the data defined in the SGF? Here,
    // we've made the decision to defer to the book options, since, in some
    // sense, the book options as an argument are more explicit.
    if (globalMetadata) {
      for (var key in globalMetadata) {
        if (globalMetadata[key] && !view[key]) {
          view[key] = globalMetadata[key];
        }
      }
    }
    return view
  },

  /** Returns a Glift SGF Manager instance. */
  manager: function(spec) {
    return glift.widgets.createNoDraw(spec);
  },

  /**
   * Helper function for looping over each SGF in the SGF collection.
   *
   * The function fn should expect two params:
   *  - the index
   *  - The movetree.
   *  - The 'flattened' object.
   */
  forEachSgf: function(spec, fn) {
    var mgr = this.manager();
    for (var i = 0; i < mgr.sgfCollection.length; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var mt = this.getMovetree(sgfObj);
      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: sgfObj.nextMovesPath,
          boardRegion: sgfObj.boardRegion
      });
      fn(i, mt, flattened);
    }
  },

  /**
   * Get a movetree. SGF Parsing is cached for efficiency.
   */
  getMovetree: function(sgfObj) {
    var signature = this._sgfSignature(sgfObj.sgfString);
    if (!this._parseCache[signature]) {
      this._parseCache[signature] =
          glift.rules.movetree.getFromSgf(sgfObj.sgfString);
    }
    var initPos = glift.rules.treepath.parsePath(sgfObj.initialPosition);
    return this._parseCache[signature].getTreeFromRoot(initPos);
  },

  /**
   * Returns the template to use. Use the user provided template if it exists;
   * otherwise, default to the default template for the output format.
   */
  template: function() {
    var opts = this._opts;
    if (opts.template) {
      return opts.template;
    } else {
      return this.defaultTemplate();
    }
  },

  /**
   * Returns a signature that for the SGF that can be used in a map.
   * Method: if sgf < 100 bytes, use SGF. Otherwise, use first 50 bytes + last
   * 50 bytes.
   */
  _sgfSignature: function(sgf) {
    if (typeof sgf !== 'string') {
      throw new Error('Improper type for SGF: ' + sgf);
    }
    if (sgf.length <= 100) {
      return sgf;
    }
    return sgf.substring(0, 50) + sgf.substring(sgf.length - 50, sgf.length);
  },
};
