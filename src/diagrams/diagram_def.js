goog.provide('gpub.diagrams.Diagram');
goog.provide('gpub.diagrams.DiagramRenderer');
goog.provide('gpub.diagrams.Metadata');
goog.provide('gpub.diagrams.Rendered');

/**
 * A single rendered diagram.
 * @typedef {{
 *  id: string,
 *  rendered: string,
 * }}
 */
gpub.diagrams.Diagram;

/**
 * Metadata for a diagram. Includes information useful for placement in a page
 * or other medium. Some notes about parameters:
 * - Comment will be an empty string if none exists, but it will never be
 *   undefined.
 * - collisions, isOnMainPath, startingMoveNum, and endingMoveNum are useful
 *   for figure-labels (move-number labeling, collision labeling).
 *
 * @typedef {{
 *  id: string,
 *  labels: (!Array<string>|undefined),
 *  comment: string,
 *  collisions: !Array<!glift.flattener.Collision>,
 *  isOnMainPath: boolean,
 *  startingMoveNum: number,
 *  endingMoveNum: number,
 * }}
 */
gpub.diagrams.Metadata;

/**
 * Rendered diagrams plus some metadata. For streamed rendering, the diagrams
 * array will be empty. Otherwise, the metadata and diagrams arrays should be
 * equal.
 *
 * @typedef{{
 *  diagrams: !Array<gpub.diagrams.Diagram>,
 *  metadata: !Array<gpub.diagrams.Metadata>,
 *  type: gpub.diagrams.Type
 * }}
 */
gpub.diagrams.Rendered;


/** @typedef {function(!gpub.diagrams.Diagram, !gpub.diagrams.Metadata)} */
gpub.diagrams.DiagramCallback;

/**
 * The interface for the diagram-type-specific renderers.
 * @record
 */
gpub.diagrams.DiagramRenderer = function() {};

/**
 * Render one diagram.
 * @param {!glift.flattener.Flattened} f
 * @param {!gpub.api.DiagramOptions} o
 * @return {string} The rendered diagram
 */
gpub.diagrams.DiagramRenderer.prototype.render = function(f, o) {};

/**
 * Render inline text with stone images.
 * @param {string} text
 * @param {!gpub.api.DiagramOptions} opt
 * @return {string}
 */
gpub.diagrams.DiagramRenderer.prototype.renderInline = function(text, opt) {};
