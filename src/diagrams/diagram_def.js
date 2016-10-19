goog.provide('gpub.diagrams.Diagram');

/**
 * @typedef {{
 *  id: string,
 *  rendered: string,
 *  comment: (string|undefined),
 * }}
 */
gpub.diagrams.Diagram;

/**
 * @typedef{{
 *  diagrams: !Array<gpub.diagrams.Diagram>,
 *  init: string
 * }}
 */
gpub.diagrams.DiagramCollection;
