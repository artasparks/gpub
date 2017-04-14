goog.provide('gpub.book.frontmatter');
goog.provide('gpub.book.ProcessedMarkdown');


/**
 * Processed markdown.
 * @typedef {{
 *   preamble: string,
 *   text: string
 * }}
 */
gpub.book.ProcessedMarkdown;


/**
 * @namespace
 */
gpub.book.frontmatter = {
  /**
   * @param {gpub.book.Format} format
   * @param {!gpub.opts.Frontmatter} opts frontmatter options
   * @return {!gpub.opts.Frontmatter} formatted frontmatter.
   */
  format: function(format, opts) {
    var formatter = function(str) {
      return /** @type {!gpub.book.ProcessedMarkdown} */ ({
        preamble: '',
        text: str,
      });
    }
    switch(format) {
      case 'LATEX':
      case 'XELATEX':
        formatter = gpub.book.latex.renderMarkdown;
        break;
      default:
        // formatter stays the same
    }
    return opts;
  }
};
