goog.provide('gpub.book.frontmatter');


/**
 * @namespace
 */
gpub.book.frontmatter = {
  /**
   * @param {gpub.book.MarkdownFormat} format
   * @param {!gpub.opts.Frontmatter} opts frontmatter options
   * @return {!gpub.opts.Frontmatter} formatted frontmatter.
   */
  format: function(format, opts) {
    var fmt = gpub.book.formatter.get(format);
    var construct = function(section) {
      if (!section) {
        // Return empty string as default case.
        return '';
      }
      return gpub.book.formatter.joinProcessed(fmt(section));
    }
    var foreword = construct(opts.foreword);
    var preface = construct(opts.preface);
    var acknowledgements = construct(opts.acknowledgements);
    var introduction = construct(opts.introduction);
    return new gpub.opts.Frontmatter({
      foreword: foreword,
      preface: preface,
      acknowledgements: acknowledgements,
      introduction: introduction,
      generateToc: opts.generateToc,
    });
  }
};
