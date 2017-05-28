/**
 * Generate new ebook nonsense.
 * @param {gpub.book.BookMaker} bookMaker
 * @return {!Array<!gpub.book.File>} files
 */
gpub.templates.GameCommentaryEbook.templater = function(bookMaker) {
  var epub = gpub.book.epub;
  var meta = bookMaker.templateMetadata();

  // Create css file
  var cssFile = gpub.templates.GameCommentaryEbook.cssFile(
      bookMaker.templateOptions());
  var cssPath = /** @type {string} */ (cssFile.path);

  // Initialize the epub builder.
  var builder = new epub.Builder(meta)
      .addManifestFile(cssFile);

  return builder.build();
};
