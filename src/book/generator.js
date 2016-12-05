goog.provide('gpub.book.Generator');

/**
 * Book generator helper.
 *
 * @param {!gpub.spec.Spec} spec The spec object
 * @param {!gpub.diagrams.Rendered} rendered The diagram wrapper
 *
 * @struct @final @constructor
 */
gpub.book.Generator = function(spec, rendered) {
  /**
   * @private {!Object<string, !Object<string, boolean>>}
   */
  this.idToLabelSet_ = {};

  var rootg = spec.rootGrouping;
  for (var i = 0; i < rootg.positions.length; i++) {
    var pos = rootg.positions[i];
    var gen = rootg.generated[pos.id];
    if (!gen) { return; }
    for (var j = 0; j < gen.positions.length; j++) {
      var g = gen.positions[j];
      var labels = g.labels;
      for (var k = 0; k < labels.length; k++) {
        if (!this.idToLabelSet_[g.id]) {
          this.idToLabelSet_[g.id] = {};
        }
        this.idToLabelSet_[g.id] = labels[k];
      }
    }
  }
};


gpub.book.Generator.prototype = {
  /**
   * Looping functionality
   */
  forEachDiagram: function(fn) {
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
};
