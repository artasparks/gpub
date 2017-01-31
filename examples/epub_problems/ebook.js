var gpub = require('../../index.js')

var create = function(bookMaker) {
  var epub = gpub.book.epub;

  var outfiles = []
  outfiles.push(epub.mimetypeFile());
  outfiles.push(epub.containerFile());

  var allFiles = [];
  var spineIds = [];

  var contentFile = epub.contentDoc('chap1.xhtml', '');
  outfiles.push(contentFile);
  allFiles.push(contentFile);
  spineIds.push(contentFile.id);

  contentFile.contents =
      epub.contentDocHeader() +
      'Ebook!\n' +
      epub.contentDocFooter();

  var opfOptions = new epub.EpubOptions({
    id: 'my-book',
    title: 'My Go Book!',
    author: 'kashomon',
  })

  var opfFile = epub.opfContent(opfOptions, allFiles, spineIds);
  outfiles.push(opfFile);

  return outfiles;
};

module.exports = {
  create: create
}
