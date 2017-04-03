goog.provide('gpub.diagrams')


gpub.diagrams = {
  /**
   * General diagram renderer.
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @return {!gpub.diagrams.Rendered} The rendered diagrams.
   */
  render: function(spec, cache) {
    return new gpub.diagrams.Renderer(spec, spec.diagramOptions, cache)
        .render();
  },

  /**
   * Streaming-process the diagrams.
   *
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @param {!gpub.diagrams.DiagramCallback} fn
   */
  renderStream: function(spec, cache, fn) {
    return new gpub.diagrams.Renderer(spec, spec.diagramOptions, cache)
        .renderStream(fn);
  },

  /**
   * Renders go stones that exist in a block of text.
   * @param {!gpub.diagrams.Type} diagramType
   * @param {!string} text To process
   * @param {!gpub.opts.DiagramOptions} opt
   * @return {string}
   */
  renderInline: function(diagramType, text, opt) {
    return gpub.diagrams.Renderer
        .typeRenderer(diagramType)
        .renderInline(text, opt);
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
   * @type {?RegExp}
   */
  inlineLabelRegexGlobal_: null,

  /**
   * A replace-inline function.
   * @param {string} text The text to process.
   * @param {function(string, string, string): string} fn A processing function
   *    that takes as parameters 'full', 'player', 'label'.
   */
  replaceInline: function(text, fn) {
    if (!gpub.diagrams.inlineLabelRegexGlobal_) {
      gpub.diagrams.inlineLabelRegexGlobal_ = new RegExp(
          gpub.diagrams.inlineLabelRegex.source, 'g');
    }
    var reg = /** @type {!RegExp} */ (gpub.diagrams.inlineLabelRegexGlobal_);
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
