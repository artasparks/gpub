var gpub = require('../../index.js')

var create = function(bookMaker) {
  var epub = gpub.book.epub;

  var outfiles = []
  outfiles.push(epub.mimetypeFile());
  outfiles.push(epub.containerFile());

  var manifestFiles = [];
  var spineIds = [];

  var contentFile = epub.contentDoc('chap1.xhtml', '');
  outfiles.push(contentFile);
  manifestFiles.push(contentFile);
  spineIds.push(contentFile.id);


  var contents =
      '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
      '    xmlns:epub="http://www.idpf.org/2007/ops"\n' +
      '    xmlns:ev="http://www.w3.org/2001/xml-events">\n' +
      '  <head></head>\n' +
      '  <body>\n' +
      '    <h1> Book!! </h1>';

  var indent = '    ';
  var problems = '';
  var answers = '';
  bookMaker.forEachDiagram((idx, config) => {
    if (config.basePosIndex > 6) {
      return;
    }
    var m = config.metadata;
    var filename = 'svg/' + gpub.nodeutils.createId(m.id)
        + '.' + m.extension;

    var d = '';
    var svgFile = {
      contents: config.diagram,
      path: 'OEBPS/' + filename,
      id: config.id,
      mimetype: 'image/svg+xml',
    };
    outfiles.push(svgFile);
    manifestFiles.push(svgFile);

    d += indent + '<p>Problem: ' + config.basePosIndex + '</p>\n';
    d += indent + '<img src="./' + filename + '" />\n';
    if (m.comment) {
      d += indent + '<p>' + m.comment + '</p>\n';
    }
    d += '\n';
    if (config.hasLabel('PROBLEM_ROOT')) {
      problems += d;
    } else {
      answers += d;
    }
  });

  contents += 
      '    <h2> Problems </h2>\n' +
      problems +
      '    <h2> Answers </h2>\n' +
      answers;

  contents +=
      '  </body>\n' +
      '</html>';

  contentFile.contents = contents;

  var opfOptions = new epub.EpubOptions({
    id: 'my-book',
    title: 'My Go Book!',
    author: 'kashomon',
  });

  var nav = gpub.book.epub.nav([contentFile]);
  manifestFiles.push(nav);
  outfiles.push(nav);

  var opfFile = epub.opf.content(opfOptions, manifestFiles, spineIds, nav);
  outfiles.push(opfFile);

  return outfiles;
};

module.exports = {
  create: create
}
