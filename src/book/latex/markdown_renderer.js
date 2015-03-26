/** Creates a marked-Markdown renderer for LaEeX */
gpub.book.latex.renderer = function() {
  if (gpub.book.latex._rendererInstance) {
    return gpub.book.latex._rendererInstance;
  }
  var renderer = new glift.marked.Renderer();
  for (var key in gpub.book.latex.markdown) {
    renderer[key] = gpub.book.latex.markdown[key];
  }

  gpub.book.latex._rendererInstance = renderer;
  return gpub.book.latex._rendererInstance;
};

gpub.book.latex._rendererInstance = null;

gpub.book.latex.renderMarkdown = function(str) {
  return glift.marked(str, {
    renderer:  gpub.book.latex.renderer()
  });
};

/** Set of markdown methods for the renderer */
gpub.book.latex.markdown = {
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
   */
  heading: function(text, level) {
    if (level === 1) {
      return '\\book{' + text + '}';
    } else if (level === 2) {
      return '\\part{' + text + '}';
    } else if (level === 3) {
      return '\\chapter{' + text + '}';
    } else {
      // A chapter heading without
      return '\\chapter*{' + text + '}';
    }
    // TODO(kashomon): Should \\section{...} go here?
  },

  /** No args */
  hr: function() {
    return '\\hrule';
  },

  /** body: string, ordered: boolean */
  list: function(body, ordered) {
    if (ordererd) {
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

  /** text: string */
  listitem: function(text) {
    return '\\item ' + text;
  },

  /** text: string */
  paragraph: function(text) {
    // Nothing special for paragraphs.
    return text;
  },

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /** text: string */
  strong: function(text) {
    return '\\textbf{' +  text + '}';
  },

  /** text: string */
  em: function(text) {
    return '\\textit{' +  text + '}';
  },

  /** code: string */
  br: function() {
    return '\\newline'
  },

  /** href: string, title: string, text: string */
  // requires: \usepackage{hyperref}
  // link: function(href, title, text) {},

  /** image: string, title: string, text: string */
  // might not be necessary
  // image: function(href, title, text) {}

  ///////////////////
  // Not Supported //
  ///////////////////
  code: function(code, language) { return code; },
  blockquote: function(quote) { return quote; },
  html: function(html) { return html; },
  // table: function(header, body) {return table},
  // tablerow: function(content) {},
  // tablecell: function(content, flags) {},

  codespan: function(code) { return code; },
  del: function(text) { return text; },
};
