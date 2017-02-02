/**
 * Genenerate epub content.
 *
 * For more details, see:
 * - http://www.idpf.org/epub/301/spec/epub-contentdocs.html
 * - http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html
 * @param {string} filename
 * @param {string} contents
 * @return {!gpub.book.File}
 */
gpub.book.epub.contentDoc = function(filename, contents) {
  var id = filename.replace(/\..*$/, '');
  if (!/.(xhtml|html|xml)$/.test(filename)) {
    throw new Error('Extension must be xhtml, html, or xml. ' +
        'Filename was: ' + filename);
  }
  return {
    contents: contents,
    id: id,
    mimetype: 'application/xhtml+xml',
    // Path is relative to the OEBPS directory.
    path: 'OEBPS/' + filename,
  };
}

gpub.book.epub.contentDocHeader = function() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"\n' +
    '   "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n' +
    '<html xmlns="http://www.w3.org/1999/xhtml">\n';
};

gpub.book.epub.contentDocFooter = function() {
  return '</html>\n';
};
