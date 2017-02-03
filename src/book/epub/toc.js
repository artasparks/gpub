/**
 * Creates the table of contents.
 * @param {!Array<!gpub.book.File>} files
 * @return {!gpub.book.File} The TOC file
 */
gpub.book.epub.toc = function(files) {
  var contents =
      '<nav epub:type="toc" id="toc">\n' +
      '  <ol>\n';
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    if (!f.path) {
      throw new Error('All files in the TOC must have a path. Error file: '
          + JSON.stringify(f));
    }
    var path = gpub.book.epub.oebpsPath(f.path);
    var title = f.title || path;
    contents +=
      '    <li>\n' +
      '      <a href="' + path + '">' + title + '</a>\n' +
      '    </li>\n';
  }
  contents +=
      '  </ol>\n' +
      '</nav>'
  return {
    id: 'ncx',
    path: 'OEBPS/toc.ncx',
    mimetype: 'application/x-dtbncx+xml',
    title: 'Table of Contents',
    contents: contents,
  };
};
