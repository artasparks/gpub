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

  /** @const {!Object<string, boolean>} */
  this.labelSet = {};

  /**
   * The index of the base position (the generator position). 1-indexed if set.
   * @type {number}
   */
  this.basePosIndex = -1;
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
   * @private {!Object<string, !gpub.book.PosConfig>}
   */
  this.idToConfig_ = {};

  /**
   * This is essentially a map from position ID to string id.
   * @private {!Array<string>}
   */
  this.idxArr_ = [];

  this.initFromGrouping_(spec.rootGrouping);
  // this.initFromRendered_(rendered);
};


gpub.book.BookMaker.prototype = {
  /**
   * Looping functionality
   */
  forEachId: function(fn) {
  },

  /**
   * Gets the position id from an index. Returns an empty string if no ID can be found.
   * @param {number} num
   * @return {string} the position ID
   */
  idFromIdx: function(num) {
    return this.idxArr_[num] || '';
  },

  /**
   * @param {string} id A diagram ID.
   * @return {boolean} Whether the diagram has a particular label.
   */
  hasLabel: function(id) {
  },

  /**
   * Gets the labels for an ID.
   * @param {string} id A diagram ID.
   */
  diagramMetadata: function(id) {
  },

  /**
   * @param {string} id A diagram ID.
   */
  diagram: function(id) {
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
  getInitConfig_: function(id) {
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
        var config = this.getInitConfig_(p.id);
        this.idxArr_.push(p.id);
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
};
