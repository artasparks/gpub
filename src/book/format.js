goog.provide('gpub.book.MarkdownFormat');

/**
 * An enum representing the available formats. This is largely useful for
 * rendering frontmatter.
 * @enum {string}
 */
gpub.book.MarkdownFormat = {
  /**
   * LaTeX formats. Used to generate PDFs.
   */
  'LATEX': 'LATEX',
  'XELATEX': 'XELATEX', // Maybe should be the same as LATEX

  // Ebook formats. //

  /*
   * Used to generate Epub, which can be used to generate other
   * ebook formats.
   */
  'EPUB': 'EPUB',
  /**
   * AZW is the newer Kindle version (AKA KF8).
   * Sometimes, it's worth targetting AZW3 directly for style ereasons.
   */
  'AZW3': 'AZW3',
};
