goog.provide('gpub.Options');

/**
 * Default options for GPub API. Recall that GPub has 4 tasks:
 *
 * - Create a spec (a serialized book prototype).
 * - Flatten the spec into an example spec.
 * - Create diagrams
 * - Assemble the diagrams into a book.
 *
 * These are the set of options for all 4 phases.
 *
 * @param {!gpub.Options} options
 *
 * @constructor @struct @final
 */
gpub.Options = function(options) {
  var o = options || {};

  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   *
   * @const {!Array<string>}
   */
  this.sgfs = o.sgfs || [];

  /**
   * Optionally, the user can pass in defaults to apply to the SGFs. These are
   * the defaults applied to Phase 1: Spec generation.
   *
   * @const {!gpub.spec.SgfType}
   */
  this.defaultSgfType = o.defaultSgfType || gpub.spec.SgfType.GAME_COMMENTARY;

  /**
   * Optionally override the board regions. By default, Gpub does cropping, but
   * this can be overridden with gpub.enums.boardRegions.ALL;
   *
   * @const {glift.enums.boardRegions}
   */
  this.boardRegion = o.boardRegion || glift.enums.boardRegions.AUTO;

  /**
   * A Gpub Spec can be passed in, bypassing the first phase.
   *
   * @const {?gpub.spec.Spec}
   */
  this.spec = o.spec || null;

  /**
   * The format of the 'book' output that is produced by GPub.
   * See gpub.outputFormat.
   *
   * @const {gpub.OutputFormat}
   */
  this.outputFormat = o.outputFormat || gpub.OutputFormat.LATEX;

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
   *
   * @const {gpub.DiagramType}
   */
  this.diagramType = o.diagramType || gpub.DiagramType.GNOS;

  /**
   * The size of the page. Element of gpub.book.page.type.
   *
   * @const {gpub.PageSize}
   */
  this.pageSize = o.pageSize || gpub.PageSize.LETTER;

  /**
   * Size of the intersections in the diagrams. If no units are specified, the
   * number is assumed to be in pt. Can also be specified in 'in', 'mm', or
   * 'em'.
   *
   * @const {string}
   */
  this.goIntersectionSize = o.goIntersectionSize || '12pt';

  /**
   * Skip the first N diagrams. Allows users to generate parts of a book.
   *
   * @const {number}
   */
  this.skipDiagrams = o.skipDiagrams || 0;

  /**
   * Maximum diagrams generated -- allows users to specify a section of the
   * book. 0 indicates that all subsequent diagrams are generated.
   *
   * @const {number}
   */
  this.maxDiagrams = o.maxDiagrams ||  0;

  /**
   * Override the default template.
   * A false-y template will result in using the default template.
   *
   * @const {?string}
   */
  this.template = o.template || null;

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
   * @const {!Array<glift.enums.boardRegions>}
   */
  this.regionRestrictions = o.regionRestrictions || [];

  ////////////////////////////
  // DiagramSpecificOptions //
  ////////////////////////////

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (latex).
   *
   * Most printers will require this option to be set.
   *
   * @const {boolean}
   */
  this.pdfx1a = o.pdfx1a || false;

  /**
   * An option only for PDF/X-1a. For this spceification, you must specify a
   * color profile file (e.g., ISOcoated_v2_300_eci.icc).
   *
   * @const {?string}
   */
  this.colorProfileFilePath = o.colorProfileFilePath || null;

  //////////////////
  // Book Options //
  //////////////////

  /**
   * Options specifically for book processors.
   *
   * @const {!gpub.BookOptions}
   */
  this.bookOptions = new gpub.BookOptions(o.bookOptions);

  /**
   * Whether or not debug information should be displayed (initia
   *
   * @const {boolean}
   */
  this.debug = !!o.debug || false;
};


/**
 * Process the incoming options and set any missing values.
 *
 * @param {!gpub.Options} options
 * @return {!gpub.Options}
 */
gpub.processOptions = function(options) {
  var newo = new gpub.Options(options);

  if (newo.skipDiagrams < 0) {
    throw new Error('skipDiagrams cannot be less than 0');
  }

  if (newo.maxDiagrams < 0) {
    throw new Error('maxDiagrams cannot be less than 0');
  }

  return newo;
};
