var gpub = require('../../index.js')

var create = function(bookMaker) {
  var epub = gpub.book.epub;

  var opfOptions = new epub.EpubOptions({
    id: 'my-book',
    title: 'My Go Book!',
    author: 'kashomon',
  });

  var builder = new epub.Builder(opfOptions);

  var contentFile = epub.contentDoc('chap1.xhtml', '');

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
    builder.addManifestFile(svgFile);

    d += indent + '<img src="./' + filename + '" />\n';
    d += indent + '<p>Problem: ' + config.basePosIndex + '</p>\n';
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

  builder.addContentFile(contentFile);

  return builder.build();
};

module.exports = {
  create: create
}
