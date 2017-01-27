/**
 * Genenerate epub content.
 *
 * For more details, see:
 * - http://www.idpf.org/epub/301/spec/epub-contentdocs.html
 * @param {string} filename
 * @return {!gpub.book.File}
 */
gpub.book.epub.content = function(filename) {
  return {
    contents: '',
    path: 'OEBPS/' + filename + '.html',
  };
}
