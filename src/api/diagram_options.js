goog.provide('gpub.api.DiagramOptions');
goog.provide('gpub.api.DiagramOptionsDef');


/**
 * @typedef {{
 *  diagramType: (gpub.diagrams.Type|undefined),
 *  boardRegion: (glift.enums.boardRegions|undefined),
 *  skipDiagrams: (number|undefined),
 *  maxDiagrams: (number|undefined),
 *  autoBoxCropOnVariation: (boolean|undefined),
 *  regionRestrictions: (!Array<glift.enums.boardRegions>|undefined),
 *  goIntersectionSize: (number|string|undefined),
 *  clearMarks: (boolean|undefined),
 *  typeOptions: (!Object<gpub.diagrams.Type, !Object>|undefined),
 * }}
 *
 */
gpub.api.DiagramOptionsDef;


/**
 * Options for diagram generation.
 *
 * Defaults are only applied.
 *
 * @param {(!gpub.api.DiagramOptions|!gpub.api.DiagramOptionsDef)=} opt_options
 *
 * @constructor @struct @final
 */
gpub.api.DiagramOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * The type of diagrams produced by GPub.
   *
   * Ideally you would be able to use any diagramType in an outputFormat, but
   * that is not currently the case.  Moreover, some output formats (e.g.,
   * glift, smartgo) take charge of generating the diagrams.
   *
   * However, there are some types that are output format independent:
   *  - ASCII,
   *  - PDF,
   *  - EPS
   *  - SVG
   *
   * @const {gpub.diagrams.Type}
   */
  this.diagramType = o.diagramType || gpub.diagrams.Type.GNOS;

  /**
   * Optional board region specifying cropping. By default, Gpub does cropping, but
   * this can be overridden with gpub.enums.boardRegions.ALL;
   *
   * @const {glift.enums.boardRegions|undefined}
   */
  this.boardRegion = o.boardRegion || glift.enums.boardRegions.AUTO;

  /**
   * Skip the first N diagrams. Allows users to generate parts of a book. 0 or
   * undefined will generate cause the generator not to skip diagrams.
   *
   * @const {number|undefined}
   */
  this.skipDiagrams = o.skipDiagrams || undefined;

  /**
   * Maximum diagrams generated -- allows users to specify a section of the
   * book. 0 or undefined undindicate that all subsequent diagrams are generated.
   *
   * @const {number|undefined}
   */
  this.maxDiagrams = o.maxDiagrams || undefined;

  /**
   * Whether or not to perform box-cropping on variations.
   * @const {boolean}
   */
  this.autoBoxCropOnVariation = o.autoBoxCropOnVariation || false;

  /**
   * List of autocropping preferences. Each element in the array should be a
   * member of glift.enums.boardRegions.
   *
   * Note: this may change if we ever support minimal/close-cropping.
   *
   * @const {!Array<glift.enums.boardRegions>|undefined}
   */
  this.regionRestrictions = o.regionRestrictions || undefined;

  /**
   * What size should the intersections be? Defaults to undefined since
   * different diagram types may have a different idea of what a good default
   * is, and if it's undefined, the particular diagram type will pick the
   * default.
   *
   * Note: If this is a number, we assume the size is in pt for .tex diagrams
   * and pixels for rendered diagrams. Otherwise units are required: 12pt,
   * 12mm, 1.2in, etc.
   * @const {number|string|undefined}
   */
  this.goIntersectionSize = o.goIntersectionSize || undefined;

  /**
   * Whether or not to clear the marks from the diagram. Note: this just
   * affects marks that exist as part of the movetree.
   * @const {boolean|undefined}
   */
  this.clearMarks = o.clearMarks || undefined;

  /**
   * Option-overrides for specific diagram types.
   * @const {!Object<gpub.diagrams.Type, !Object>}
   */
  this.typeOptions = o.typeOptions || {};
};
