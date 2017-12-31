goog.provide('gpub.book.latex.MarkdownBase');

/**
 * Creates a marked-Markdown renderer for LaTe, which relies on the Marked
 * library provided in the Glift functionality.
 * @param {!Object=} opt_overrides Optional object containing renderer-method
 *    overrides.
 * @return {!glift.markdown.Renderer}
 * @private
 */
gpub.book.latex.renderer_ = function(opt_overrides) {
  var renderer = new glift.marked.Renderer();
  for (var key in gpub.book.latex.MarkdownBase.prototype) {
    if (opt_overrides
        && opt_overrides[key]
        && typeof opt_overrides[key] === 'function') {
      renderer[key] = opt_overrides[key];
    } else {
      renderer[key] = gpub.book.latex.MarkdownBase.prototype[key].bind(renderer);
    }
  }
  renderer.preamble_ = [];
  return /** @type {!glift.markdown.Renderer} */ (renderer);
};

/**
 * Transforms markdown into LaTeX.
 * @param {string} str The text to process.
 * @param {!Object=} opt_overrides Optional object containing renderer-method
 *    overrides.
 * @return {!gpub.book.ProcessedText}
 */
gpub.book.latex.renderMarkdown = function(str, opt_overrides) {
  var renderer = gpub.book.latex.renderer_(opt_overrides)
  str = gpub.book.latex.sanitize(str);
  var opts = /** @type {!glift.marked.Options} */ ({
    renderer: renderer,
    silent: true
  });

  var extractPreamble = function(r) {
    return r.preamble_.join('\n');
  };

  var text = glift.marked(str, opts);
  // Now we need to post-process and escape #
  text = text.replace(/#/g, '\\#');
  return /** @type {!gpub.book.ProcessedText} */ ({
    preamble: extractPreamble(renderer),
    text: text
  });
};


/**
 * A constructor type to satify the compiler
 * @struct @constructor
 * @private
 */
gpub.book.latex.MarkdownBase = function() {
  this.preamble_ = [];
};

/** Set of markdown methods for the renderer */
gpub.book.latex.MarkdownBase.prototype = {
  //////////////////////////////////
  // Block level renderer methods //
  //////////////////////////////////

  /**
   * Note: this assumes the memoir class.
   *
   * # Level 1: Book
   * ## Level 2: Part
   * ### Level 3: Chapter
   * ####+ Level 4+: Chapter*
   * text: string, level: number
   * @param {string} text
   * @param {number} level
   * @return string
   */
  heading: function(text, level) {
    if (level === 1) {
      // this.preamble_.push('\\book{' + text + '}'); -- memoir only.
      this.preamble_.push('\\part{' + text + '}');
    } else if (level === 2) {
      this.preamble_.push('\\chapter{' + text + '}');
    } else if (level === 3) {
      this.preamble_.push('\\section{' + text + '}');
    } else if (level === 4) {
      this.preamble_.push('\\subsection{' + text + '}');
    } else {
      // A chapter heading without
      this.preamble_.push('\\subsection*{' + text + '}');
    }
    return ''; // Don't return anything. Header should be part of the preamble.
    // TODO(kashomon): Should \\section{...} go here?
  },

  /** @return {string} */
  hr: function() {
    return '\\hrule';
  },

  /**
   * @param {string} body
   * @param {boolean} ordered
   * @return string}
   */
  list: function(body, ordered) {
    if (ordered) {
      return [
        '\\begin{enumerate}',
        body,
        '\\end{enumerate}'].join('\n');
    } else {
      return [
        '\\begin{itemize}',
        body,
        '\\end{itemize}'].join('\n');
    }
  },

  /**
   * @param {string} text
   * @return {string}
   */
  listitem: function(text) {
    return '\\item ' + text;
  },

  /**
   * @param {string} text
   * @return {string}
   */
  paragraph: function(text) {
    // Nothing special for paragraphs. Blank lines separate paragraphs in
    // LaTeX.
    return text + '\n\n';
  },

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /**
   * @param {string} text
   * @return {string}
   */
  strong: function(text) {
    return '\\textbf{' +  text + '}';
  },

  /**
   * @param {string} text
   * @return {string}
   */
  em: function(text) {
    return '\\textit{' +  text + '}';
  },

  /**
   * @return {string}
   */
  br: function() {
    // TODO(kashomon): Should this be \\\\?
    return '\\newline{}';
  },

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   * @return {string}
   */
  // requires: \usepackage{hyperref}. Which can't be used with PDF/X-1a:2001
  link: function(href, title, text) {
    // For new, we just return the url.
    return href;
  },

  /** image: string, title: string, text: string */
  // might not be necessary
  // image: function(href, title, text) {}

  ///////////////////
  // Not Supported //
  ///////////////////
  /**
   * @param {string} code
   * @param {string} language
   * @return {string}
   */
  code: function(code, language) { return code; },
  /**
   * @param {string} quote
   * @return {string}
   */
  blockquote: function(quote) { return quote; },
  /**
   * @param {string} html
   * @return {string}
   */
  html: function(html) { return html; },
  // table: function(header, body) {return table},
  // tablerow: function(content) {},
  // tablecell: function(content, flags) {},
  /**
   * @param {string} code
   * @return {string}
   */
  codespan: function(code) { return code; },
  /**
   * @param {string} text
   * @return {string}
   */
  del: function(text) { return text; }
};

// Register this formatter as an optional type;
gpub.book.formatter.registry[gpub.book.MarkdownFormat.LATEX] =
    gpub.book.latex.renderMarkdown;
gpub.book.formatter.registry[gpub.book.MarkdownFormat.XELATEX] =
    gpub.book.latex.renderMarkdown;

