goog.provide('gpub.book.epub.opf');

/**
 * The OPF file
 * EPUb 3.0 OPF http://www.idpf.org/epub/301/spec/epub-ocf.html
 */
gpub.book.epub.opf = {
  /**
   * Creates the content.opf file, which has all the interesting metadata.
   *
   * See the following for more info:
   * - Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
   *
   * @param {!gpub.book.Metadata} opt
   * @param {!Array<!gpub.book.File>} files
   * @param {!Array<string>} spineIds
   * @return {!gpub.book.File}
   */
  // TODO(kashomon): Probably needs to a be a more complex builder or similar.
  content: function(opt, files, spineIds) {
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
          'unique-identifier="' + opt.idName + '" version="3.0">\n' +
      '\n';

    buffer += gpub.book.epub.opf.metadata(opt)
     + '\n'
     + gpub.book.epub.opf.manifest(files)
     + '\n'
     + gpub.book.epub.opf.spine(files, spineIds)
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
   * @param {!gpub.book.Metadata} opt
   * @return {string} The metadata block.
   */
  metadata: function(opt) {
    var content =
      '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"\n' +
      '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '      xmlns:dcterms="http://purl.org/dc/terms/"\n' +
      '      xmlns:opf="http://www.idpf.org/2007/opf">\n' +
      '    <dc:title>' + opt.title + '</dc:title>\n' +
      '    <dc:language>' + opt.lang + '</dc:language>\n' +
      '    <dc:subject>' + opt.subject + '</dc:subject>\n' +
      '    <dc:rights>' + opt.rights + '</dc:rights>\n' +
      // '    <dc:date event="generation">' + opt.generationDate + '</dc:date>\n';
      '    <meta property="dcterms:modified">' + opt.generationDate + '</meta>\n';

    if (opt.description) {
      content +=
      '    <dc:description>' + opt.description + '</dc:description>\n';
    }

    if (opt.id) {
      content +=
      '    <dc:identifier id="' + opt.idName + '">' + opt.id + '</dc:identifier>\n' +
      '    <meta refines="#' + opt.idName + '"\n' +
      '        property="identifier-type"\n' +
      '        scheme="xsd:string">' + opt.idType + '</meta>\n';
    }
    if (opt.isbn10) {
      content +=
      '    <dc:identifier' +
      '        id="isbn10">urn:isbn:' + opt.isbn10 + '</dc:identifier>' +
      '    <meta refines="#isbn10"\n' +
      '        property="identifier-type"\n' +
      '        scheme="onix:codelist5">2</meta>\n';
    }
    if (opt.isbn13) {
      content +=
      '    <dc:identifier' +
      '        id="isbn13">urn:isbn:' + opt.isbn13 + '</dc:identifier>' +
      '    <meta refines="#isbn13"\n' +
      '        property="identifier-type"\n' +
      '        scheme="onix:codelist5">15</meta>\n';
    }

    if (opt.publisher) {
      content +=
      '    <dc:publisher>' + opt.publisher + '</dc:publisher>\n';
    }
    if (opt.authors && opt.authors.length) {
      for (var i = 0; i < opt.authors.length; i++) {
        var a = opt.authors[i];
        content +=
        '    <dc:creator>' + a + '</dc:creator>\n';
      }
    }
    if (opt.publicationDate) {
      content +=
      '    <dc:date>' + opt.publicationDate + '</dc:date>\n';
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
  manifest:  function(files) {
    var out = '  <manifest>\n'
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (!f.path) { 
        throw new Error('EPub Manifest files must hava a path. ' +
            'File path [' + i + '] was: ' + f.path);
      }
      if (!f.mimetype) {
        throw new Error('EPub Manifest files must hava a mimetype. ' +
            'File mimetype [' + i + '] was: ' + f.mimetype);
      }
      if (!f.id) {
        throw new Error('EPub Manifest files must hava an ID.' +
            'File ID [' + i + '] was: ' + f.id);
      }
      out += '    <item id="' + f.id
        + '" href="' + gpub.book.epub.oebpsPath(f.path)
        + '" media-type="' + f.mimetype + '" ';
      if (f.id == 'nav') {
        out += 'properties="nav "';
      }

      out += '/>\n';
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
  spine: function(files, spineIds) {
    var out = '  <spine ';
    // Could insert a TOC ncx id here.
    out += '>\n';

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
      out += '    <itemref idref="' + id + '" />\n';
    }
    out += '  </spine>\n';
    return out;
  },
};
