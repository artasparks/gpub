goog.provide('gpub.book.epub');

/**
 * Tools for generating EPub ebooks.
 *
 * Some tools:
 * - Kindle-gen tool: https://www.amazon.com/gp/feature.html?docId=1000765211
 * - Epub-checking tool: https://github.com/IDPF/epubcheck
 *
 * Some resources:
 * - Kindle format: https://www.amazon.com/gp/feature.html?docId=1000729511
 * - Epub wikipedia: https://en.wikipedia.org/wiki/EPUB
 * - Worked Epub example: http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html
 *
 * Specs:
 * - EPub SVG Spec: http://www.idpf.org/epub/301/spec/epub-contentdocs.html#sec-svg
 * - EPub Standard: http://idpf.org/epub
 * - EPub 3.0.1 standard: http://idpf.org/epub/301
 * - EPub OPF Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
 *
 * Note: currently no sanitization is done on inputs, so you must trust your inputs.
 */
gpub.book.epub = {
  /**
   * Returns the mimetype file. Static. Must be the first file in the epub-zip
   * file
   *
   * @return {!gpub.book.File}
   */
  mimetype: function() {
    return {
      contents: 'application/epub+zip',
      path: 'mimetype',
    };
  }
};
