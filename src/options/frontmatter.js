goog.provide('gpub.opts.Frontmatter');
goog.provide('gpub.opts.FrontmatterDef');

/**
 * @typedef {{
 *  foreword: (string|undefined),
 *  preface: (string|undefined),
 *  acknowledgements: (string|undefined),
 *  introduction: (string|undefined),
 *  generateToc: (boolean|undefined),
 * }}
 */
gpub.opts.FrontmatterDef;

/**
 * @param {!(gpub.opts.Frontmatter|gpub.opts.FrontmatterDef)=} options
 *
 * @constructor @struct @final
 */
gpub.opts.Frontmatter = function(options) {
  var o = options || {};

  // Note! If this is changed, then src/book/frontmatter.js must also be changed.

  /** @const {string|undefined} */
  this.foreword = o.foreword || undefined;  // Author or unrelated person

  /** @const {string|undefined} */
  this.preface = o.foreword || undefined; // Author

  /** @const {string|undefined} */
  this.acknowledgements = o.acknowledgements || undefined;

  /** @const {string|undefined} */
  this.introduction = o.introduction || undefined;

  /**
   * Generate the Table of Contents or just 'Contents'. Defaults to true.
   * @type {boolean}
   */
  this.generateToc = o.generateToc !== undefined ? !!o.generateToc : true;
};

