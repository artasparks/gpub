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

  /**
   * Another LaTeX font / LaTeX style package. Note that IGO has a limited
   * character set available.
   */
  IGO: 'IGO',


  /**
   * Diagrams for the SmartGo book (GoBook) format.
   */
  SMARTGO: 'SMARTGO',

  /**
   * Generate SVG Diagrams.
   */
  SVG: 'SVG'

  /////////////////////////////
  // Morass of planned types //
  /////////////////////////////

  /**
   * Native PDF generation
   * >> Not Currently Supported, but here for illustration.
   */
  //PDF: 'PDF',

  //EPS: 'EPS',

  /**
   * Sensei's library ASCII variant.
   */
  //SENSEIS_ASCII: 'SENSEIS_ASCII',

  /**
   * GPUB's ASCII variant.
   */
  //GPUB_ASCII: 'GPUB_ASCII',
};

/**
 * Map from diagram type to file suffix.
 * @type {!Object<gpub.diagrams.Type, string>}
 */
gpub.diagrams.fileSuffix = {};
gpub.diagrams.fileSuffix[gpub.diagrams.Type.GOOE] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.GNOS] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.IGO] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.SMARTGO] = 'gobook';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.SVG] = 'svg';
