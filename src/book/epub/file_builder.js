goog.provide('gpub.book.epub.Builder');


/**
 * Helper for building an ebook.
 * @param {!gpub.book.Metadata} opts
 * @constructor @struct @final
 */
gpub.book.epub.Builder = function(opts) {
  /** @type {!gpub.book.Metadata} */
  this.opts = opts;

  /**
   * @type {!Array<!gpub.book.File>}
   */
  this.allFiles = [
    gpub.book.epub.mimetypeFile(),
    gpub.book.epub.containerFile(),
  ];

  /** @type {!Array<!gpub.book.File>} */
  this.manifestFiles = [];

  /** @type {!Array<!gpub.book.File>} */
  this.navFiles = [];

  /** @type {!Array<string>} spineIds */
  this.spineIds = [];
};

gpub.book.epub.Builder.prototype = {
  /**
   * Return the files necessary for a book.
   * @return {!Array<!gpub.book.File>}
   */
  build: function() {
    var nav = gpub.book.epub.nav(this.navFiles);
    this.allFiles.push(nav);
    this.manifestFiles.push(nav);

    var opfFile = gpub.book.epub.opf.content(
        this.opts, this.manifestFiles, this.spineIds);

    this.allFiles.push(opfFile);
    return this.allFiles;
  },

  /**
   * Add a content file, which also adds the file to spine, manifest, and nav.
   * @param {!gpub.book.File} file
   * @return {!gpub.book.epub.Builder} this
   */
  addContentFile: function(file) {
    this.allFiles.push(file);
    this.navFiles.push(file);
    this.spineIds.push(file.id);
    this.manifestFiles.push(file);
    return this;
  },

  /**
   * Add a file to the manifest.
   * @param {!gpub.book.File} file
   * @return {!gpub.book.epub.Builder} this
   */
  addManifestFile: function(file) {
    this.allFiles.push(file);
    this.manifestFiles.push(file);
    return this;
  },
};
