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
   * file.
   * @return {!gpub.book.File}
   */
  mimetype: function() {
    return {
      contents: 'application/epub+zip',
      path: 'mimetype',
    };
  },

  /**
   * Returns the XML container file. Static. A reference to the OPF file.
   * @return {!gpub.book.File}
   */
  container: function() {
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

  /**
   * Creates the content.opf file, which has all the interesting metadata.
   *
   * See the following for more info:
   * - Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {!gpub.book.File}
   */
  opfContent: function(opt) {
    if (!opt) {
      throw new Error('Options must be defined');
    }
    var buffer = '<?xml version="1.0"?>\n' +
      '\n' +
      '<package xmlns="http://www.idpf.org/2007/opf" ' +
          'unique-identifier="' + opt.id + '" version="2.0">"\n' +
      '\n';

    buffer += gpub.book.epub.opfMetadata(opt)
     + '\n'
     + gpub.book.epub.opfManifest(opt)
     + '\n'
     + gpub.book.epub.opfSpine(opt)
     + '\n'
     + gpub.book.epub.opfGuide(opt)
     + '\n'
     + '</package>\n';

    return {
      contents: buffer,
      path: 'OEBPS/content.opf',
    }
  },

  /**
   * Generates the OPF Metadata.
   *
   * Publication metadata (title, author, publisher, etc.).
   *
   * For more details about the fields, see:
   * http://dublincore.org/documents/2004/12/20/dces/
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string} The metadata block.
   */
  opfMetadata: function(opt) {
    var content =
      '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" \n' +
      '    xmlns:dcterms="http://purl.org/dc/terms/"\n' +
      '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '    xmlns:opf="http://www.idpf.org/2007/opf">\n' +
      '    <dc:title>' + opt.title + '</dc:title>\n' +
      '    <dc:language xsi:type="dcterms:RFC3066">' + opt.lang + '</dc:language>\n' +
      '    <dc:subject>' + opt.subject + '</dc:subject>\n' +
      '    <dc:rights>' + opt.rights + '</dc:rights>\n' +
      '    <dc:date opf:event="generation">' + opt.generationDate + '</dc:date>\n';

    if (opt.description) {
      content +=
      '    <dc:description>' + opt.description + '</dc:description>\n';
    }

    if (opt.isbn) {
      content +=
      '    <dc:identifier id="' + opt.id + '" opf:scheme="ISBN">\n' +
          opt.isbn + '</dc:identifier>\n';
    } else {
      content +=
      '    <dc:identifier id="' + opt.id + '" opf:scheme="URI">' + opt.uriId +
          '</dc:identifier>\n';
    }

    if (opt.relation) {
      content +=
      '    <dc:relation>' + opt.relation + '</dc:relation>\n';
    }
    if (opt.publisher) {
      content +=
      '    <dc:publisher>' + opt.publisher + '</dc:publisher>\n';
    }
    if (opt.creator) {
      content +=
      '    <dc:creator>' + opt.creator + '</dc:creator>\n';
    }
    if (opt.publicationDate) {
      content +=
      '    <dc:date opf:event="publication">' + opt.publicationDate + '</dc:date>\n';
    }
    content +=
      '  </metadata>\n';

    return content;
  },

  /**
   * Generates the OPF Manifest.
   *
   * A list of files (documents, images, style sheets, etc.) that make up the
   * publication. The manifest also includes fallback declarations for files of
   * types not supported by this specification.
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string}
   */
  opfManifest:  function(opt) {
    return '';
  },

  /**
   * Generates the OPF Spine.
   *
   * An arrangement of documents providing a linear reading order.
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string}
   */
  opfSpine: function(opt) {
    return '';
  },

  /**
   * Generates the OPF Guide.
   *
   * A set of references to fundamental structural features of the publication,
   * such as table of contents, foreword, bibliography, etc.
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string}
   */
  opfGuide: function(opt) {
    return '';
  },
};
