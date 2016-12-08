goog.provide('gpub.book.BookMaker');
goog.provide('gpub.book.PosConfig');


/**
 * Position config for an ID. Really, this is a convenince helper so have
 * several things to store in our ID map.
 * @param {string} id Position id
 *
 * @struct @final @constructor
 */
gpub.book.PosConfig = function(id) {
  /** @const {string} */
  this.id = id;

  /** @private @const {!Object<string, boolean>} */
  this.labelSet = {};

  /**
   * The index of the base position (the generator position). 1-indexed if set.
   * @private {number}
   */
  this.basePosIndex = -1;

  /**
   * Diagram metadata configuration for this position
   * @private {!gpub.digarams.Metadata}
   */
  this.metadata = {};

  /**
   * Optional diagram. This will be an empty string if streaming-rendering was used.
   * @private {string}
   */
  this.diagram = '';

  /**
   * The position object that generated this position. Sometimes useful for
   * debugging, but not usually useful for rendering.
   */
  this.positionSpec = {};
};


gpub.book.PosConfig.prototype = {
};


/**
 * Book maker helper. Contains helpful methods for making books.
 *
 * @param {!gpub.spec.Spec} spec The spec object
 * @param {!gpub.diagrams.Rendered} rendered The diagram wrapper
 *
 * @struct @final @constructor
 */
gpub.book.BookMaker = function(spec, rendered) {
  /** @private {number} */
  this.seenPos_ = 0;

  /**
   * Map from position
   * @private {!Object<string, !gpub.book.PosConfig>}
   */
  this.idToConfig_ = {};

  /**
   * An ordered list of all the position ids.
   * @private {!Array<string>}
   */
  this.posIds_ = [];

  this.initFromGrouping_(spec.rootGrouping);
  this.initFromRendered_(rendered);
};


gpub.book.BookMaker.prototype = {
  /**
   * Looping functionality. Loop over each Position ID and Position Config.
   * @param {function(number, !gpub.book.PosConfig} fn Processing
   * function that has the form:
   *  - Diagram index
   *  - Position config
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
   * Gets the position id from an index. Returns an empty string if no ID can be found.
   * @param {number} num
   * @return {string} the position ID
   */
  idFromIdx: function(num) {
    return this.posIds_[num] || '';
  },

  /**
   * Gets the position config for an ID.
   * @param {string} id
   * @return {?gpub.book.PosConfig} The relevant position config or null if none was found.
   */
  getConfig: function(id) {
    return this.idToConfig_[id] || null;
  },

  /**
   * Professional printing often requires that PDFs be compliant with PDF/X-1a
   * (or a similar standard). Here, we provide some headers for LaTeX that
   * should make this a bit easier
   * @return {string}
   */
  pdfx1aHeader: function() {
  },

  /////////////////////
  // Private helpers //
  /////////////////////

  /**
   * Gets a PosConfig for a given ID. If the PosConfig doesn't exist, create it.
   * @param {string} id
   * @return {!gpub.book.PosConfig}
   * @private
   */
  getOrInitConfig_: function(id) {
    var pos = this.idToConfig_[id];
    if (!pos) {
      pos = new gpub.book.PosConfig(id);
      this.idToConfig_[id] = pos;
    }
    return pos;
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
        var config = this.getOrInitConfig_(p.id);
        config.position = p;
        this.posIds_.push(p.id);
        config.basePosIndex = index;
        for (var k = 0; k < p.labels.length; k++) {
          config.labelSet[p.labels[k]] = true;
        }
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
      for (var i = 0; i < group.groupings.length; i++) {
        this.initFromGrouping_(group.groupings[i]);
      }
    }
  },

  /**
   * Initialize the position config from the rendered data.
   * @param {!gpub.spec.Rendered} ren Rendered wrapper
   * @private
   */
  initFromRendered_: function(ren) {
    for (var i = 0; i < ren.metadata.length; i++) {
      var m = ren.metadata[i];
      var config = this.getOrInitConfig_(m.id);
      config.metadata = m;
    }
    for (var i = 0; i < ren.diagrams.length; i++) {
      var m = ren.diagrams[i];
      var config = this.getOrInitConfig_(m.id);
      if (m.rendered) {
        config.diagram = m.rendered;
      }
    }
  }
};
