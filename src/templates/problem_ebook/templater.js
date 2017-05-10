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

  var titleContents =
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
    titleContents += '    <h2 class="hd"> ' + meta.subtitle + ' </h2>\n';
  }
  titleContents +=
      '  </body>\n' +
      '</html>';

  var titleFile = epub.contentDoc('chap_title.xhtml', titleContents, 'Title');
  builder.addContentFile(titleFile)

  var problemContent = function(sectionNum, start, end, type, content) {
    var fname = 'chapter_' + sectionNum + '_' + type.toLowerCase() + '.xhtml';
    var pcon = '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
    '    xmlns:epub="http://www.idpf.org/2007/ops"\n' +
    '    xmlns:ev="http://www.w3.org/2001/xml-events">\n' +
    '  <head>\n' +
    '    <meta charset="utf-8" />\n' +
    '    <link rel="stylesheet" ' +
        'type="' + cssFile.mimetype + '" ' +
        'href="' + gpub.book.epub.oebpsPath(cssPath) + '"/>\n' +
    '  </head>\n' +
    '  <body>\n' +
    '    <h2 class="hd"> Chapter ' + sectionNum + ': ' +
        type + ' ' + start + '-' + end + '</h2>\n' +
    '    <div class="p-break"></div>\n' +
    content +
    '  </body>\n' +
    '</html>\n';
    return epub.contentDoc(fname, pcon,
      'Chapter ' + sectionNum + ': Problems ' + start + '-' + end);
  };


  var indent = '    ';
  var problems = '';
  var answers = '';

  var chapSize = bookMaker.templateOptions().chapterSize;
  var numProblems = 0;
  var sNum = 1;

  // TODO(kashomon): Add realistic start/end numbs
  var pStart = 1;
  var pEnd = 0;
  bookMaker.forEachDiagram(function(idx, config) {
    if (config.hasLabel('PROBLEM_ROOT')) {
      numProblems++;
      pEnd++;
    }
    if (chapSize > 0 && numProblems == chapSize) {
      builder.addContentFile(problemContent(sNum, pStart, pEnd, 'Problem', problems));
      // builder.addManifestFile(problemContent(sNum, pStart, pEnd, 'Answers', problems));
      sNum++;
      pStart = pEnd+1;
      problems = '';
      answers = '';
    }

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

  return builder.build();
};
