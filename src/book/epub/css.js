goog.provide('gpub.book.epub.CssOpts');

/**
 * Options for constructing a CSS file
 *
 * path: defaults to OEPBS/css/epub.css
 * id: defaults to style-css
 *
 * @typedef{{
 *  classes: (!Object<string, !Object<string, string>>|undefined),
 *  tags: (!Object<string, !Object<string, string>>|undefined),
 *  path: (string|undefined),
 *  id: (string|undefined),
 * }}
 */
gpub.book.epub.CssOpts;

/**
 * Constructs a CSS file based on key-pars.
 *
 * List of supported tags for KF8/AZW3
 *   https://www.amazon.com/gp/feature.html?docId=1000729901
 *
 * @param {!gpub.book.epub.CssOpts} opts
 * @return {!gpub.book.File}
 */
gpub.book.epub.css = function(opts) {
  var contents = '';
  var process = function(tags, isClass) {
    for (var cat in tags) {
      var block = tags[cat];
      if (isClass) {
        contents += '.';
      }
      contents += cat + ' {\n';
      for (var prop in block) {
        contents += '  ' + prop + ': ' + block[prop] + ';\n';
      }
      contents += '}\n';
    }
  }

  var classes = opts.classes || {};
  process(classes, true);
  var tagz = opts.tags || {};
  process(tagz, false);

  var id = opts.id || 'style-css';
  var path = opts.path || 'OEBPS/css/epub.css';
  return {
    contents: contents,
    path: path,
    id: id,
    mimetype: 'text/css',
  };
};
