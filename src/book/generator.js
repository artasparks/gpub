/**
 * Constructs a book generator.
 */
gpub.book.generator = function(outputFormat, options) {
  if (!outputFormat) { throw new Error('No output format defined'); }
  if (!options) { throw new Error('Options not defined'); }

  var pkg = gpub.book[outputFormat.toLowerCase()];
  if (!pkg) {
    throw new Error('No package defined for: ' + outputFormat);
  }
  if (!pkg.generator) {
    throw new Error('No generator impl for: ' + outputFormat);
  }

  var gen = new gpub.book._Generator();

  // Copy over the methods from the implementations;
  for (var gkey in pkg.generator) {
    if (gkey && pkg.generator[gkey]) {
      gen[gkey] = pkg.generator[gkey].bind(gen);
    }
  }

  if (!gen.defaultOptions ||
      glift.util.typeOf(gen.defaultOptions) !== 'function' ) {
    throw new Error('No default options-function defined for type: ' +
        outputFormat);
  }

  return gen.initOptions(options);
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
  defaultOptions: function() {}
};

/**
 * Abstract book generator. Provides default methods and constructor.
 */
gpub.book._Generator = function() {
  this._opts = {};

  /**
   * Map from first 50 bytes + last 50 bytes of the SGF to the movetree. To
   * prevent-reparsing unnecessarily over and over.
   */
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
    if (!spec) { throw new Error('Spec not defined'); }
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
    var mgr = this.manager(spec);
    var opts = this.options();
    // 1 million diagrams should be enough for anybody ;)
    var max = opts.maxDiagrams ? opts.maxDiagrams : 1000000;
    for (var i = opts.skipDiagrams;
        i < mgr.sgfCollection.length && i < max; i++) {
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
   * Set the options for the Generator. Note: The generator defensively makes
   * a copy of the options.
   */
  initOptions: function(opts) {
    if (!opts) { throw new Error('Opts not defined'); }
    this._opts = glift.util.simpleClone(opts || {});

    var defOpts = {};
    if (this.defaultOptions) {
      defOpts = this.defaultOptions();
    }

    if (!defOpts) { throw new Error('Default options not defined'); }

    // TODO(kashomon): Should this be recursive? It's not clear to me.  Do you
    // usually want to copy over top level objects as they are?
    for (var gkey in defOpts) {
      if (defOpts[gkey] && !this._opts[gkey]) {
        this._opts[gkey] = defOpts[gkey];
      }
      // Step one level deeper into book options and copy the keys there.
      if (gkey === 'bookOptions') {
        var bookOptions = defOpts[gkey];
        for (var bkey in bookOptions) {
          if (bookOptions[bkey] && !this._opts.bookOptions[bkey]) {
            this._opts.bookOptions[bkey] = bookOptions[bkey];
          }
        }
      }
    }
    return this;
  },

  /** Returns the current options */
  options: function() {
    return this._opts;
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
  }
};
