goog.provide('gpub.book.BookMaker');
goog.provide('gpub.book.PositionConfig');


/**
 * Position config for an ID. Really, this is a convenince helper so have
 * several things to store in our ID map.
 *
 * @param {!gpub.spec.Position} pos
 * @param {!gpub.diagrams.Metadata} meta
 * @param {!string} diagram
 * @param {!Object<string, boolean>} labelSet
 * @param {number} index The base position index.
 *
 * @struct @final @constructor
 */
gpub.book.PositionConfig = function(pos, meta, diagram, labelSet, index) {
  /** @const {string} */
  this.id = pos.id;

  /**
   * The position object that generated this position. Sometimes useful for
   * debugging, but not usually useful for rendering.
   * @const {!gpub.spec.Position}
   */
  this.position = pos;

  /**
   * Diagram metadata configuration for this position.
   * @const {!gpub.diagrams.Metadata}
   */
  this.metadata = meta;

  /**
   * Optional diagram. This will be an empty string if streaming-rendering was
   * used.
   * @const {string}
   */
  this.diagram = diagram;

  /** @const {!Object<string, boolean>} */
  this.labelSet = labelSet;

  /**
   * The index of the base position; I.e., this is a way to track the index of
   * the non-generated positions. Practically, this should be the index of the
   * original SGF that this position came from.
   * @const {number}
   */
  this.basePosIndex = index;
};


gpub.book.PositionConfig.prototype = {
  /**
   * Creates a full move + collision caption from the diagram metadata.
   * If on the main path, has the form:
   *    (Moves 1-3)
   *    Black 10, White 13 at a
   *    Black 14 at 5
   *
   * Otherwise, just an ordinary collision annotation
   *    Black 10, White 13 at a
   *    Black 14 at 5
   * unless there are no collisions, in which case empty string is returned.
   * @return {string}
   */
  fullAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.fullLabelFromCollisions(
      m.collisions,
      m.isOnMainPath,
      m.startingMoveNum,
      m.endingMoveNum);
  },

  /**
   * Creates a collision annotation. Has the form
   *    Black 10, White 13 at a
   *    Black 14 at 5
   * unless there are no collisions, in which case empty string is returned.
   * @return {string}
   */
  collisionAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.labelFromCollisions(m.collisions);
  },

  /**
   * Creates a move-number annotation. Has the form:
   *    (Moves 1-3)
   * @return {string}
   */
  moveNumberAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.constructMoveLabel(
        m.startingMoveNum, m.endingMoveNum);
  },

  /**
   * Returns true/false whether this position has a label.
   * @param {string} label
   * @return {boolean}
   */
  hasLabel: function(label) {
    return !!this.labelSet[label];
  },
};


/**
 * Book maker helper. Contains helpful methods for making books.
 *
 * @param {!gpub.spec.Grouping} rootGrouping The root position grouping
 * @param {!gpub.diagrams.Rendered} rendered The diagram wrapper
 * @param {!gpub.api.TemplateOptions} opts Options for template rendering.
 *
 * @struct @final @constructor
 */
gpub.book.BookMaker = function(rootGrouping, rendered, opts) {
  /**
   * Options for templatizing a book.
   * @const @private {!gpub.api.TemplateOptions}
   */
  this.tmplOpts_ = opts;

  /** @private {number} */
  this.seenPos_ = 0;

  /** @const @private {!Object<string, !gpub.book.PositionConfig>} */
  this.idToConfig_ = {};

  /** @const @private {!Object<string, string>} */
  this.diagrams_ = {};

  /** @const @private {!Object<string, !gpub.diagrams.Metadata>} */
  this.diagramMeta_ = {};

  /**
   * An ordered list of all the position ids.
   * @private {!Array<string>}
   */
  this.posIds_ = [];

  this.initLookupsFromRendered_(rendered);
  this.initFromGrouping_(rootGrouping);
};


gpub.book.BookMaker.prototype = {
  /**
   * Looping functionality. Loop over each Position ID and Position Config.
   * @param {function(number, !gpub.book.PositionConfig)} fn Processing
   *  Function that has the form:
   *    - Diagram index
   *    - Position config
   */
  forEachDiagram: function(fn) {
    for (var i = 0; i < this.posIds_.length; i++) {
      var id = this.posIds_[i];
      var config = this.getConfig(id);
      if (!config) {
        throw new Error('Null config when looping! Should be impossible.');
      }
      fn(i, config);
    }
  },

  /**
   * Gets the position id from an index. Returns an empty string if no ID can
   * be found.
   * @param {number} num
   * @return {string} the position ID
   */
  idFromIdx: function(num) {
    return this.posIds_[num] || '';
  },

  /**
   * Gets the position config for an ID.
   * @param {string} id
   * @return {?gpub.book.PositionConfig} The relevant position config or null if
   * none was found.
   */
  getConfig: function(id) {
    return this.idToConfig_[id] || null;
  },

  /** @return {!gpub.api.TemplateOptions} Returns the template options. */
  templateOptions: function() {
    return this.tmplOpts_;
  },

  /** @return {!gpub.book.Metadata} Returns the book metadata. */
  templateMetadata: function() {
    return this.tmplOpts_.metadata;
  },

  /**
   * Replace some text with inline go stones (possibly). This doesn't work for
   * all rendering types, but is a nice addition especially for commentary.
   * @param {gpub.diagrams.Type} dtype
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt_diagramOpts
   * @return {string} The rendered text
   */
  renderInline: function(dtype, text, opt_diagramOpts) {
    var opt = opt_diagramOpts || {};
    return gpub.diagrams.Renderer.typeRenderer(dtype).renderInline(text, opt);
  },

  /**
   * Create a new latex helper.
   * @return {!gpub.book.latex.LatexHelper}
   */
  latexHelper: function() {
    return new gpub.book.latex.LatexHelper();
  },

  /////////////////////
  // Private helpers //
  /////////////////////

  /**
   * Initialize the position config from the rendered data.
   * @param {!gpub.diagrams.Rendered} ren Rendered wrapper
   * @private
   */
  initLookupsFromRendered_: function(ren) {
    for (var i = 0; i < ren.metadata.length; i++) {
      var m = ren.metadata[i];
      this.diagramMeta_[m.id] = m;
    }
    for (var i = 0; i < ren.diagrams.length; i++) {
      var d = ren.diagrams[i];
      if (d.rendered) {
        this.diagrams_[d.id] = d.rendered;
      }
    }
  },

  /**
   * Initialization function called in the book-maker constructor.
   * @param {!gpub.spec.Grouping} group
   * @private
   */
  initFromGrouping_: function(group) {
    for (var i = 0; i < group.positions.length; i++) {
      this.seenPos_++;
      var index = this.seenPos_;
      var pos = group.positions[i];
      var gen = group.generated[pos.id];

      /**
       * @param {!gpub.spec.Position} p
       */
      var processPos = function(p) {
        var meta = this.diagramMeta_[p.id];
        if (!meta) {
          throw new Error('Couldn\'t find diagram metadata for ID ' + p.id);
        }
        var labelSet = {};
        for (var k = 0; k < p.labels.length; k++) {
          labelSet[p.labels[k]] = true;
        }
        var diagramStr = this.diagrams_[p.id] || '';

        var config = new gpub.book.PositionConfig(
          p, meta, diagramStr, labelSet, index);
        this.idToConfig_[p.id] = config;
        this.posIds_.push(p.id);
      }.bind(this);

      if (!gen) {
        // There are no generated positions. Consider just the non-generated position.
        processPos(pos);
      } else {
        for (var j = 0; j < gen.positions.length; j++) {
          processPos(gen.positions[j]);
        }
      }

      // Hopefully the user hasn't created a data structure with loops.
      for (var m = 0; m < group.groupings.length; m++) {
        this.initFromGrouping_(group.groupings[m]);
      }
    }
  },
};
