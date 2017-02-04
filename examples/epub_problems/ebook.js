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


  contentFile.contents =
      '<html xmlns="http://www.w3.org/1999/xhtml"\n' +
      '    xmlns:epub="http://www.idpf.org/2007/ops"\n' +
      '    xmlns:ev="http://www.w3.org/2001/xml-events">\n' +
      '  <head></head>\n' +
      '  <body>\n' +
      '    <p>Hello Ebook!</p>\n' +
      '  </body>\n' +
      '</html>';

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
