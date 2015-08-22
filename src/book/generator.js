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

  return gen._initOptions(options);
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
   * Returns:
   * {
   *  content: ...
   *  diagrams:...
   * }
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

    var defaultView = this.defaultOptions ?
        this.defaultOptions().bookOptions || {} : {};

    var globalMetadata = mt.metadata();

    // Prefer options in the following order:
    //  1. explicitly passed in options (already done)
    //  2. metadata in the SGF
    //  3. default view options
    var globalBookDefaults = gpub.defaultOptions.bookOptions;
    if (globalMetadata) {
      for (var key in globalMetadata) {
        if (globalMetadata[key] !== undefined && (
            view[key] === undefined ||
                JSON.stringify(view[key]) ===
                JSON.stringify(globalBookDefaults[key]))) {
          view[key] = globalMetadata[key];
        }
      }
    }

    if (defaultView) {
      for (var key in defaultView) {
        if (defaultView[key] !== undefined && view[key] === undefined) {
          view[key] = defaultView[key];
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
   * The function fn should expect five params:
   *  - the index
   *  - The movetree.
   *  - The 'flattened' object.
   *  - The context
   *  - A unique name for the SGF (usually the sgf alias).
   */
  forEachSgf: function(spec, fn) {
    var mgr = this.manager(spec);
    var opts = this.options();
    // 1 million diagrams should be enough for anybody ;). Users can override if
    // they really must, but millions of diagrams would imply hundreds of
    // thousands of pages.
    var max = opts.maxDiagrams ? opts.maxDiagrams : 1000000;
    var regionRestrictions = opts.regionRestrictions;
    for (var i = opts.skipDiagrams;
        i < mgr.sgfCollection.length && i < max; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var nextMoves = glift.rules.treepath.parseFragment(sgfObj.nextMovesPath);
      var sgfId = this.getSgfId(sgfObj);
      var mt = this.getMovetree(sgfObj, sgfId);
      var autoVarCrop = this._shouldPerformAutoCropOnVar(mt, nextMoves)

      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: nextMoves,
          boardRegion: sgfObj.boardRegion,
          autoBoxCropOnNextMoves: autoVarCrop,
          regionRestrictions: regionRestrictions
      });

      var debugCtx = this._getDebugCtx(
          mt, nextMoves, sgfObj.boardRegion, autoVarCrop, regionRestrictions);
      var ctx = gpub.book.getDiagramContext(mt, flattened, sgfObj, debugCtx);

      fn(i, mt, flattened, ctx, sgfId);
    }
  },

  /**
   * Returns the debug context. This info typically gets put directly into the
   * book for, well, debugging.
   */
  _getDebugCtx: function(
      mt, nextMoves, boardRegion, autoBoxCrop, regRestrict) {
    if (!gpub.global.debug) {
      return {};
    }
    var base = {
      initialPosition:
          glift.rules.treepath.toInitPathString(mt.treepathToHere()),
      nextMoves: glift.rules.treepath.toFragmentString(nextMoves),
      boardRegion: boardRegion,
      autoBoxCrop: autoBoxCrop,
      regionRestrictions: regRestrict
    };
    return base;
  },

  /**
   * Whether autocropping on variations should be performed.
   */
  _shouldPerformAutoCropOnVar: function(mt, nextMoves) {
    var performAutoCrop = this.options().autoBoxCropOnVariation;
    nextMoves = nextMoves || [];
    if (performAutoCrop && mt.onMainline()) {
      if (nextMoves.length == 0) {
        performAutoCrop = false;
      } else {
        // It's possible that the next moves path continues on the mainline for
        // a while and then diverts to a branch, but this doesn't currently
        // happen due to the way specs are generated. Thus, we only check the
        // first move in the nextMoves path.
        performAutoCrop = nextMoves[0] > 0;
      }
    }
    return performAutoCrop;
  },

  /**
   * Given an SGF Object, returns the SGF ID. If the alias exists, just use the
   * alias as the ID. Otherwise, use parts of the SGF String as the ID.
   */
  getSgfId: function(sgfObj) {
    var alias = sgfObj.alias;
    if (alias) {
      return alias;
    }
    var signature = this._sgfSignature(sgfObj.sgfString);
    if (signature) {
      return signature
    }
    throw new Error('SGF Object contains neither alias nor an SGF String. ' + 
        'Cannot generate an SGF Id.');
  },

  /**
   * Get a movetree. SGF Parsing is cached for efficiency.
   */
  getMovetree: function(sgfObj, id) {
    if (!this._parseCache[id]) {
      this._parseCache[id] =
          glift.rules.movetree.getFromSgf(sgfObj.sgfString);
    }
    var initPos = glift.rules.treepath.parsePath(sgfObj.initialPosition);
    return this._parseCache[id].getTreeFromRoot(initPos);
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
  _initOptions: function(opts) {
    if (!opts) { throw new Error('Opts not defined'); }
    this._opts = glift.util.simpleClone(opts || {});

    var defaultOpts = {};
    if (this.defaultOptions) {
      defaultOpts = this.defaultOptions();
    }

    if (!defaultOpts) { throw new Error('Default options not defined'); }

    for (var gkey in defaultOpts) {
      if (defaultOpts[gkey] && !this._opts[gkey]) {
        this._opts[gkey] = defaultOpts[gkey];
      }
    }

    // Note: We explicitly don't drill down into the bookOptions / view so that
    // the passed-in bookOptions have the ability to take precedence.
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
    if (sgf === undefined) {
      throw new Error('Cannot create signature. SGF is undefined!');
    }
    if (typeof sgf !== 'string') {
      throw new Error('Improper type for SGF: ' + sgf);
    }
    if (sgf.length <= 100) {
      return sgf;
    }
    return sgf.substring(0, 50) + sgf.substring(sgf.length - 50, sgf.length);
  }
};
