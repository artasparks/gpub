/**
 * Creates the table of contents.
 * @param {!Array<!gpub.book.File>} files
 * @return {!gpub.book.File} The TOC file
 */
gpub.book.epub.nav = function(files) {
  var contents =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<html xmlns="http://www.w3.org/1999/xhtml" ' +
          'xmlns:epub="http://www.idpf.org/2007/ops">\n' +
      '  <head>\n' +
      '    <title>TODO TITLE</title>\n' +
      '    <meta charset="utf-8" />\n' +
      // '    <link href="../css/default.css" rel="stylesheet" type="text/css" />
      '  </head>\n' +
      '  <body>\n' +
      '    <nav epub:type="toc" id="toc">\n' +
      '      <ol>\n';
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    if (!f.path) {
      throw new Error('All files in the TOC must have a path. Error file: '
          + JSON.stringify(f));
    }
    var path = gpub.book.epub.oebpsPath(f.path);
    var title = f.title || path;
    contents +=
      '      <li>\n' +
      '        <a href="' + path + '">' + title + '</a>\n' +
      '      </li>\n';
  }
  contents +=
      '      </ol>\n' +
      '    </nav>\n' +
      '  </body>\n' +
      '</html>\n';
  return {
    id: 'nav',
    path: 'OEBPS/nav.xhtml',
    mimetype: 'application/xhtml+xml',
    title: 'Table of Contents',
    contents: contents,
  };
};
