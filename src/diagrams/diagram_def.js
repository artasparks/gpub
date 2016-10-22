goog.provide('gpub.diagrams.Diagram');
goog.provide('gpub.diagrams.Rendered');
goog.provide('gpub.diagrams.DiagramRenderer');

/**
 * A single diagram. Note that the comment will be an empty string if there is
 * no comment.
 *
 * @typedef {{
 *  id: string,
 *  rendered: string,
 *  comment: string,
 * }}
 */
gpub.diagrams.Diagram;

/**
 * Rendered diagrams plus some metadata.
 *
 * @typedef{{
 *  diagrams: !Array<gpub.diagrams.Diagram>,
 *  init: !Object<gpub.OutputFormat, string>,
 *  type: gpub.diagrams.Type
 * }}
 */
gpub.diagrams.Rendered;


/**
 * The interface for the diagram-type-specific renderers.
 * @record
 */
gpub.diagrams.DiagramRenderer = function() {};

/**
 * @param {!glift.flattener.Flattened} f
 * @param {!gpub.api.DiagramOptions} o
 * @return {string} The rendered diagram
 */
gpub.diagrams.DiagramRenderer.prototype.render = function(f, o) {};

/**
 * @return {!Object<gpub.OutputFormat, string>} Diagram-type specific
 * initialization info.
 */
gpub.diagrams.DiagramRenderer.prototype.init = function() {};
