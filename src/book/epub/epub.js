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
 * - EPub Specs: http://idpf.org/epub
 * - EPub SVG Spec: http://www.idpf.org/epub/301/spec/epub-contentdocs.html#sec-svg
 * - EPub Standard: http://idpf.org/epub
 * - EPub 3.0.1 standard: http://idpf.org/epub/301
 * - EPub 2.0 OPF Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
 * - EPUb 3.0 OPF http://www.idpf.org/epub/301/spec/epub-ocf.html
 *
 * Notes:
 * - currently no sanitization is done on inputs, so you must trust your inputs.
 * - it will generally be preferable to control page breaks for go
 * diagrams directly with directly with CSS:
 * .group {
 *   page-break-inside: {avoid|always}
 *   page-break-before: {avoid|always}
 *   page-break-after: {avoid|always}
 * } 
 */
gpub.book.epub = {
  /**
   * Returns the mimetype file. Static. Must be the first file in the epub-zip
   * file.
   * @return {!gpub.book.File}
   */
  mimetypeFile: function() {
    return {
      contents: 'application/epub+zip',
      path: 'mimetype',
    };
  },

  /**
   * Returns the XML container file. Static. A reference to the OPF file.
   * @return {!gpub.book.File}
   */
  containerFile: function() {
    var contents =
      '<?xml version="1.0" encoding="UTF-8" ?>\n' +
      '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n' +
      '  <rootfiles>\n' +
      '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n' +
      '  </rootfiles>\n' +
      '</container>';

    return {
      contents: contents,
      path: 'META-INF/container.xml',
    }
  },


  /** @private {!RegExp} */
  oebpsRex_: /OEBPS\/(.*)/,

  /**
   * Strips the OEBPS from file path, for the purposes of being used in manifests / navigation.
   * I.e.,
   *
   * @param {string} fpath
   * @return {string}
   */
  oebpsPath: function(fpath) {
    if (gpub.book.epub.oebpsRex_.test(fpath)) {
      fpath = fpath.replace(gpub.book.epub.oebpsRex_, function(match, p1) {
        return p1;
      });
    }
    return fpath;
  },
};
