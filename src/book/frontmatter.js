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
    var fmt = function(str) {
      return /** @type {!gpub.book.ProcessedMarkdown} */ ({
        preamble: '',
        text: str,
      });
    }
    switch(format) {
      case 'LATEX':
      case 'XELATEX':
        fmt = gpub.book.latex.renderMarkdown;
        break;
      default:
        // formatter stays the same
    }
    var construct = function(content) {
      var proc = fmt(content);
      if (proc.preamble) {
        return proc.preamble + '\n' + proc.text;
      } else {
        return proc.text;
      }
    }
    var foreword = opts.foreword;
    if (opts.foreword) {
      foreword = construct(opts.foreword)
    }
    return new gpub.opts.Frontmatter({
      foreword: foreword,
      generateToc: opts.generateToc,
    });
  }
};
