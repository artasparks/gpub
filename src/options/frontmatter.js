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

  /** @type {string|undefined} */
  this.foreword = o.foreword || undefined;  // Author or unrelated person

  /** @type {string|undefined} */
  this.preface = o.foreword || undefined; // Author

  /** @type {string|undefined} */
  this.acknowledgements = o.acknowledgements || undefined;

  /** @type {string|undefined} */
  this.introduction = o.introduction || undefined;

  /**
   * Generate the Table of Contents or just 'Contents'. Defaults to true.
   * @type {boolean}
   */
  this.generateToc = o.generateToc !== undefined ? !!o.generateToc : true;
};

