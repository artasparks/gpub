goog.provide('gpub.templates.ProblemEbook');

/**
 * Namespace for ebooky things.
 */
gpub.templates.ProblemEbook = {};

/**
 * Create an ebook.
 * @param {!Array<string>} contents Raw SGF contents
 * @param {!Array<string>} ids ids for the SGFs.
 */
gpub.templates.ProblemEbook.create = function(contents, ids) {
  // TODO(kashomon): Fix these;
  var obj = {
    id: 'my-id',
    title: 'My Go Book Title',
    authors: ['Bob', 'Bib'],
  };

  var bookMaker = gpub.init(/** @type {!gpub.Options} */ ({
      sgfs: contents,
      ids: ids,
      specOptions: {
        positionType: 'PROBLEM',
        autoRotateCropPrefs: {
          corner: 'BOTTOM_LEFT',
          preferFlips: true,
        }
      },
      diagramOptions: {
        diagramType: 'SVG',
        clearMarks: true,
      }
    }))
    .createSpec()
    .processSpec()
    .renderDiagrams()
    .bookMaker()

  return gpub.templates.ProblemEbook.bookin(bookMaker, obj);
};

gpub.templates.ProblemEbook.bookin = function(bookMaker, obj) {
  var epub = gpub.book.epub;

  var options = new gpub.book.Metadata({
    id: obj.id,
    title: obj.title,
    authors: obj.authors,
  });

  var builder = new epub.Builder(options);

  // List of support for tags:
  // https://www.amazon.com/gp/feature.html?docId=1000729901

  var cssContent = ''
      // Diagram Group.
      + '.hd {\n'
      + '  font-family: sans-serif;\n'
      + '}\n'
      + '.p-break {\n'
      + '  page-break-after:always;\n'
      + '}\n'
      + '.d-gp {\n'
      + '  page-break-inside: avoid;\n'
      + '  page-break-before: always;\n'
      + '  background-color: #EEE;\n'
      + '}\n'
      + '.pidx {\n'
      + '  font-size: 1.5em;\n'
      + '  text-align: center;\n'
      // + '  padding-bottom: 1em;\n'
      // Hackery
      + '  position: absolute;\n'
      // + '  float: left\n'
      // + '  left: 50%;\n'
      + '  left: 0;\n'
      + '  right: 0;\n'
      + '  margin-left: auto;\n'
      + '  margin-right: auto;\n'
      // + '  position: relative;\n'
      // + '  left: -50%;\n'
      // + '  font-family: sans-serif;\n'
      + '}\n'
      + '.pspan {\n'
      + '  padding-left: 2em;\n'
      + '  padding-right: 2em;\n'
      + '  border-bottom: 1px solid black;\n'
      + '}\n'
      + '.s-img {\n'
      // + '  margin-top: 2em;\n'
      + '  background-color: #DDD;\n'
      // An attempt to center
      // + '  margin-right: auto;\n'
      // + '  margin-left: auto;\n'
      + '}\n';

  var cssFile = {
    contents: cssContent,
    path: 'OEBPS/css/epub.css',
    id: 'style-css',
    mimetype: 'text/css',
  };

  builder.addManifestFile(cssFile);

  var contentFile = epub.contentDoc('chap1.xhtml', '');

  var contents =
      '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
      '    xmlns:epub="http://www.idpf.org/2007/ops"\n' +
      '    xmlns:ev="http://www.w3.org/2001/xml-events">\n' +
      '  <head>\n' +
      '    <meta charset="utf-8" />\n' +
      '    <link rel="stylesheet" type="text/css" href="css/epub.css"/>\n' +
      '  </head>\n' +
      '  <body>\n' +
      '    <h1 class="hd"> ' + obj.title + '</h1>\n' +
      '    <h2 class="hd"> Volume 1</h2>\n';

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

  builder.addContentFile(contentFile);

  return builder.build();
};
