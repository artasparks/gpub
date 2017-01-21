/**
 * Genenerate epub content.
 * @param {string} filename
 * @return {!gpub.book.File}
 */
gpub.book.epub.content = function(filename) {
  return {
    contents: '',
    path: 'OEBPS/' + filename + '.html',
  };
}
