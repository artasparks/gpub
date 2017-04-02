/**
 * Templatizes a book and produces a series of book files.
 * @param {gpub.book.BookMaker} bookMaker
 * @return {!Array<!gpub.book.File>} files
 */
gpub.templates.ProblemEbook.templater = function(bookMaker) {
  var epub = gpub.book.epub;
  var meta = bookMaker.templateMetadata();
  var cssFile = gpub.templates.ProblemEbook.cssFile();
  var cssPath = '';
  if (cssFile.path) {
    // cssPath must be defined, b
    cssPath = cssFile.path
  } else {
    throw new Error('CSS path was net defined!');
  }

  var builder = new epub.Builder(meta)
      .addManifestFile(cssFile);

  var contentFile = epub.contentDoc('chap1.xhtml', '');
  var contents =
      '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
      '    xmlns:epub="http://www.idpf.org/2007/ops"\n' +
      '    xmlns:ev="http://www.w3.org/2001/xml-events">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <link rel="stylesheet" ' +
          'type="' + cssFile.mimetype + '" ' +
          'href="' + gpub.book.epub.oebpsPath(cssPath) + '"/>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <h1 class="hd"> ' + meta.title + '</h1>\n';
  if (meta.subtitle) {
    contents += '    <h2 class="hd"> ' + meta.subtitle + ' </h2>\n';
  }

  var indent = '    ';
  var problems = '';
  var answers = '';
  bookMaker.forEachDiagram(function(idx, config) {
    var m = config.metadata;

    // TODO(kashomon): Note: this assumes IDs can reasonably be used for
    // filenames, which isn't yet checked
    var filename = 'svg/' +
        m.id.replace(/\.sgf$/, '').replace('\.', '_')
        + '.' + m.extension;

    var d = '';
    var svgFile = {
      contents: config.diagram,
      path: 'OEBPS/' + filename,
      id: config.id,
      mimetype: 'image/svg+xml',
    };

    d += indent + '<div class="d-gp">\n'
      + indent + '  <div class="pidx"><span class="pspan">' 
          + config.basePosIndex + '</span></div>\n'
      + indent + '  <img class="s-img" src="./' + filename + '" />\n';

    // if (m.comment) {
      // The comments aren't helpful at the moment.
      // d += indent + '  <p>' + m.comment + '</p>\n';
    // }

    d += indent + '</div>\n';
    d += '\n';

    if (config.hasLabel('PROBLEM_ROOT')) {
      builder.addManifestFile(svgFile);
      problems += d;
    } else {
      // builder.addManifestFile(svgFile);
      answers += d;
    }
  });

  contents +=
      '    <p></p>\n' +
      '    <h2 class="hd"> Problems </h2>\n' +
      '    <div class="p-break"></div>\n' +
      problems;
      // '    <h2> Answers </h2>\n' +
      // answers;

  contents +=
      '  </body>\n' +
      '</html>';

  contentFile.contents = contents;

  return builder.addContentFile(contentFile).build();
};
