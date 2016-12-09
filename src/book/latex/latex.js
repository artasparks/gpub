goog.provide('gpub.book.latex');
goog.provide('gpub.book.latex.LatexHelper');

/*
 * LaTeX helper utilities.
 */
gpub.book.latex = {
  /**
   * Sanitizes latex input. This isn't particularly robust, but it is meant to
   * protect us against accidental problematic characters rather than malicious
   * user input.
   * @param {string} text LaTeX text to process.
   * @return {string} processed text
   * @package
   */
  sanitize: function(text) {
    return text
      .replace(/\\/g, '\\textbackslash')
      .replace(/[$}{%&]/g, function(match) {
        return '\\' + match;
      });
  },
};

/**
 * A Latex Helper to make rendering LaTeX books a bit easier.
 * @struct @final @constructor
 */
gpub.book.latex.LatexHelper = function() {};

gpub.book.latex.LatexHelper.prototype = {
  /**
   * Professional printing often requires that PDFs be compliant with PDF/X-1a
   * (or a similar standard). Here, we provide some headers for LaTeX that
   * should make this a bit easier. Note that this provides some goo to make a
   * document compliant, but it's still easy to screw up. In particular, adding
   * hyperlinks breaks PDF/X-1a compliance.
   *
   * @param {!gpub.book.latex.PdfxOptions} options for rendering the
   *    PDF/X-1a:2001 header.
   * @return {string}
   */
  pdfx1aHeader: function(options) {
    return gpub.book.latex.pdfx.header(options);
  },

  /**
   * Sanitizes latex input by transforming control characters into their escaped form.
   * @param {string} text LaTeX text to process.
   * @return {string} processed text
   */
  sanitize: function(text) {
    return gpub.book.latex.sanitize(text);
  },

  /**
   * Render some markdown as latex.
   * @param {string} text Markdown text to process
   * @param {!Object=} opt_overrides Optional object containing renderer-method
   *    overrides.
   * @return {gpub.book.latex.ProcMarkdown} rendered latex, split into the
   *    pramble (headers) and the body text.
   */
  renderMarkdown: function(text, opt_overrides) {
    return gpub.book.latex.renderMarkdown(text, opt_overrides);
  },
};
