goog.provide('gpub.diagrams')


gpub.diagrams = {
  /**
   * The new method for generating diagrams. Note that this no longer generates
   * the diagram context -- that is left up to the relevant book generator.
   */
  create: function(flattened, diagramType, options) {
    // TODO(kashomon): Remove optional options obj. We should only do options
    // processing in api land.
    options = options || {};
    return gpub.diagrams._getPackage(diagramType).create(flattened, options);
  },

  /** Renders go stones that exist in a block of text. */
  renderInline: function(diagramType, text) {
    return gpub.diagrams._getPackage(diagramType).renderInline(text);
  },

  /** Gets a diagram type package */
  _getPackage: function(diagramType) {
    if (!diagramType || !gpub.diagrams.Type[diagramType]) {
      throw new Error('Unknown diagram type: ' + diagramType);
    }
    var pkgName = glift.enums.toCamelCase(diagramType);
    var pkg = gpub.diagrams[pkgName];

    if (!pkg) {
      throw new Error('No package for diagram type: ' + diagramType);
    }
    if (!pkg.create) {
      throw new Error('No create method for diagram type: ' + diagramType);
    }
    return pkg
  },

  /** Gets the initialization data for a diagramType. */
  getInit: function(diagramType, outputFormat) {
    var pkg = gpub.diagrams._getPackage(diagramType);
    if (!pkg.init || typeof pkg.init != 'object') {
      throw new Error('No init obj');
    }
    var init = pkg.init[outputFormat];
    if (!init) {
      return ''
    } else if (typeof init === 'function') {
      return init();
    } else if (typeof init === 'string') {
      return init;
    } else {
      return '';
    }
  },

  /**
   * A flattener helper.  Returns a glift Flattened object, which is key for
   * generating diagrams.
   */
  // TODO(kashomon): Consider deleting this. It's really not doing much at all.
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  },

  /**
   * Regex for determining if a text should be considered an inline label.
   *
   * Roughly we look for Black or White followed by a valid label. Then, we
   * check to make sure the next character is one of:
   * 1. The end of the line
   * 2. Whitespace
   * 3. Some form of punctuation
   *
   * Valid labels
   * - Black A blah
   * - White 32
   * - Black (A)
   * - White (126)
   * - Black (x)
   *
   * @type {!RegExp}
   */
  inlineLabelRegex: new RegExp(
      '(Black|White) ' +
      '([A-Z]|([0-9]{1,3})|(\\(([A-Za-z]|[0-9]{1,3})\\)))' +
      '(?=($|\\n|\\r|\\s|["\',:;.$?~`<>{}\\[\\]()!@_-]))',
      ''),

  /**
   * Supply a fn to replace stones found within text.
   *
   * Functions passed to inlineReplacer should have the form:
   * - Fullmatch,
   * - Black/White
   * - Label
   *
   * Returns new text with the relevant replacements.
   */
  inlineLabelRegexGlobal_: null,
  replaceInline: function(text, fn) {
    if (!gpub.diagrams.inlineLabelRegexGlobal_) {
      gpub.diagrams.inlineLabelRegexGlobal_ = new RegExp(
          gpub.diagrams.inlineLabelRegex.source, 'g');
    }
    var reg = gpub.diagrams.inlineLabelRegexGlobal_;
    return text.replace(reg, function(full, player, label) {
      if (/^\(.\)$/.test(label)) {
        label = label.replace(/^\(|\)$/g, '');
      }
      return fn(full, player, label);
    });
  },

  /**
   * Construct the label based on the flattened object. From the flattened
   * object, we must extract the collisions and the move numbers.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @return {string}
   */
  createLabel: function(flattened) {
    return glift.flattener.labels.createFullLabel(flattened);
  },
};
