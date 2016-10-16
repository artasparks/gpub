goog.provide('gpub.diagrams.Type');

/**
 * Types of diagram output.
 *
 * @enum {string}
 */
gpub.diagrams.Type = {
  /**
   * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
   */
  GOOE: 'GOOE',

  /**
   * Variant of Gooe series.
   */
  GNOS: 'GNOS',

  /////////////////////////////
  // Morass of planned types //
  /////////////////////////////

  /**
   * Another LaTeX font / LaTeX style package
   * >> Not Currently Supported
   */
  //IGO: 'IGO',

  /**
   * Native PDF generation
   * >> Not Currently Supported, but here for illustration.
   */
  //PDF: 'PDF',

  /**
   * Generate SVG Diagrams.
   */
  //SVG: 'SVG'
  //
  /**
   * Sensei's library ASCII variant.
   */
  //SENSEIS_ASCII: 'SENSEIS_ASCII',

  /**
   * GPUB's ASCII variant.
   */
  //GPUB_ASCII: 'GPUB_ASCII',
};
