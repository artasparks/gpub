goog.provide('gpub.book.MarkdownFormat');
goog.provide('gpub.book.ProcessedText');
goog.provide('gpub.book.FormatterFn');
goog.provide('gpub.book.formatter');


goog.scope(function() {

/**
 * Processed text. This could be markdown that's processed into a
 * format-specific type (but it's not required to be).
 *
 * Note: The text-field is always populated, but the preamble might be an empty
 * string.
 *
 * @typedef {{
 *   preamble: string,
 *   text: string
 * }}
 */
gpub.book.ProcessedText;


/**
 * A function that formats text into processed-text
 * First param: string text.
 * Second param: Optional params to the renderer.
 * @typedef {function(string, !Object=): !gpub.book.ProcessedText}
 */
gpub.book.FormatterFn;


/**
 * An enum representing the available formats. This is largely useful for
 * rendering frontmatter.
 * @enum {string}
 */
gpub.book.MarkdownFormat = {
  /**
   * LaTeX formats. Used to generate PDFs.
   */
  LATEX: 'LATEX',
  XELATEX: 'XELATEX', // Maybe should be the same as LATEX

  // Ebook formats. //

  /*
   * Used to generate Epub, which can be used to generate other
   * ebook formats.
   */
  EPUB: 'EPUB',
  /**
   * AZW is the newer Kindle version (AKA KF8).
   * Sometimes, it's worth targetting AZW3 directly for style ereasons.
   */
  AZW3: 'AZW3',

  /**
   * Nothing special: just pass the text on through (to the text field)
   * unprocessed.
   */
  DEFAULT: 'DEFAULT',
};


gpub.book.formatter = {
  /**
   * Gets a formatter function from a MarkdownFormat type.
   * @param {!gpub.book.MarkdownFormat} fmt
   * @return {!gpub.book.FormatterFn}
   */
  get: function(fmt) {
    fmt = fmt || gpub.book.MarkdownFormat.DEFAULT;
    if (!gpub.book.formatter.registry[fmt]) {
      fmt = gpub.book.MarkdownFormat.DEFAULT
    }
    // Should always be defined at this point
    return gpub.book.formatter.registry[fmt];
  },

  /**
   * Gets a formatter function from a diagram type
   * @param {!gpub.diagrams.Type} diagramType
   * @return {!gpub.book.FormatterFn}
   */
  fromDiagramType: function(diagramType) {
    var mdType = gpub.book.MarkdownFormat.DEFAULT;
    switch(diagramType) {
      case 'GOOE':
      case 'GNOS':
      case 'IGO':
        mdType = gpub.book.MarkdownFormat.LATEX;
        break;
      case 'SVG':
        mdType = gpub.book.MarkdownFormat.EPUB;
        break;
      default:
        mdType = gpub.book.MarkdownFormat.DEFAULT;
    }
    return gpub.book.formatter.get(mdType);
  },

  /**
   * Simple join function to turn processed text into one text blob.
   * @param {!gpub.book.ProcessedText} proc
   * @return {string}
   */
  joinProcessed: function(proc) {
    var elems = []
    if (proc.preamble) {
      elems.push(proc.preamble);
    }
    if (proc.text) {
      elems.push(proc.text);
    }
    return elems.join('\n');
  },

  /**
   * A registry of formatters
   * @type {!Object<!gpub.book.MarkdownFormat, !gpub.book.FormatterFn>}
   */
  registry: {},
};

//
// Populate the registry
//

/** @type {!gpub.book.FormatterFn} */
var defaultFmt = function(str, opt) {
  return /** @type {!gpub.book.ProcessedText} */ ({
    preamble: '',
    text: str,
  });
}
gpub.book.formatter.registry[gpub.book.MarkdownFormat.DEFAULT] = defaultFmt;

/** @type {!gpub.book.FormatterFn} */
var htmlFmt = function(str, opt) {
  return /** @type {!gpub.book.ProcessedText} */ ({
    preamble: '',
    text: glift.marked(str, {
      silent: true,
    })
  });
};
gpub.book.formatter.registry[gpub.book.MarkdownFormat.EPUB] = htmlFmt;
gpub.book.formatter.registry[gpub.book.MarkdownFormat.AZW3] = htmlFmt;

});  // goog.scope
