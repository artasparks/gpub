goog.provide('gpub.diagrams.Diagram');
goog.provide('gpub.diagrams.DiagramTypedef');

/**
 * @typedef {{
 *  id: (string),
 *  rendered: (string|undefined),
 *  comment: (string|undefined),
 * }}
 */
gpub.diagrams.DiagramTypedef;

/**
 * A single diagram.
 * @param {(!gpub.diagrams.Diagram|!gpub.diagrams.DiagramTypedef)=} opt_d
 * @constructor @stuct @final
 */
gpub.diagrams.Diagram = function(opt_d) {
  var o = opt_d || {};
  if (!o.id) {
    throw new Error('Id required to be specified, but was: ' + o.id);
  }

  /** @const {string} ID corresponding to the Position ID */
  this.id = o.id;

  /** @const {string} Rendered diagram. */
  this.rendered = o.rendered || '';

  /** @const {string} Diagram comment. */
  this.comment = o.comment || '';
};
