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
 * - EPub OPF Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
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

  /**
   * Creates the content.opf file, which has all the interesting metadata.
   *
   * See the following for more info:
   * - Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @param {!Array<!gpub.book.File>} files
   * @param {!Array<string>} spineIds
   * @return {!gpub.book.File}
   */
  opfContent: function(opt, files, spineIds) {
    if (!opt) {
      throw new Error('Options must be defined');
    }
    if (!files || !files.length > 0) {
      throw new Error('Files must be defined and > 0. Was: '
          + JSON.stringify(files));
    }
    if (!spineIds || !spineIds.length > 0) {
      throw new Error('Spine IDs must be defined and > 0. Was: '
          + JSON.stringify(spineIds));
    }

    var buffer = '<?xml version="1.0"?>\n' +
      '\n' +
      '<package xmlns="http://www.idpf.org/2007/opf" ' +
          'unique-identifier="' + opt.id + '" version="2.0">"\n' +
      '\n';

    buffer += gpub.book.epub.opfMetadata(opt)
     + '\n'
     + gpub.book.epub.opfManifest(files)
     + '\n'
     + gpub.book.epub.opfSpine(files, spineIds)
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
    if (opt.author) {
      content +=
      '    <dc:creator>' + opt.author + '</dc:author>\n';
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
   * @param {!Array<!gpub.book.File>} files
   * @return {string}
   */
  opfManifest:  function(files) {
    var out = '  <manifest>\n'
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (!f.path || !f.mimetype || !f.id) {
        throw new Error('EPub Manifest files must hava a path, mimetype, and ID. ' +
            'File [' + i + '] was: ' + JSON.stringify(f));
      }
      out += '    <item id="' + f.id + '" href="' + f.path
        + '" media-type="' + f.mimetype + '" />\n'
    }
    out += '  </manifest>\n';
    return out;
  },

  /**
   * Generates the OPF Spine.
   *
   * An arrangement of documents providing a linear reading order.
   * @param {!Array<!gpub.book.File>} files
   * @param {!Array<string>} spineIds
   * @return {string}
   */
  opfSpine: function(files, spineIds) {
    var out = '  <spine toc="ncx">\n';
    var fmap = {};
    for (var i = 0; i < files.length; i++) {
      fmap[files[i].id] = files[i];
    }
    for (var i = 0; i < spineIds.length; i++) {
      var id = spineIds[i];
      var file = fmap[id];
      if (!file) {
        throw new Error('For every spineId, there must exist a file in the manifest. '
            + 'Files: ' + JSON.stringify(files) + ' SpineIDs: ' + JSON.stringify(spineIds));
      }
      if (!(file.mimetype === 'application/xhtml+xml' ||
          file.mimetype === 'application/x-dtbook+xml')) {
        throw new Error('File mimetype must be application/xhtml+xml ' +
            'or application/x-dtbook+xml. Was: ' + file.mimetype);
      }
      // TODO(kashomon): Should this support non-linear readings? Might be
      // useful for problem-answers.
      out += '    <itemref idref="' + id + '" />\n';
    }
    out += '  </spine>\n';
    return out;
  },

  /**
   * Generates the OPF Guide. The guide is optional.
   *
   * A set of references to fundamental structural features of the publication,
   * such as table of contents, foreword, bibliography, etc.
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string}
   */
  opfGuide: function(opt) {
    return '<!-- OPF Guide would be here -->';
  },
};
