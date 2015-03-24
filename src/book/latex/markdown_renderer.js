/** Creates a marked-Markdown renderer for LaEeX */
gpub.book.latex.renderer = function() {
  var renderer = new glift.marked.Renderer();
  for (var key in gpub.book.latex.markdown) {
    renderer[key] = gpub.book.latex.markdown[key];
  }
  return renderer;
};

gpub.book.latex.markdown = {
  //////////////////////////////////
  // Block level renderer methods //
  //////////////////////////////////

  /** text: string, level: number  */
  heading: function(text, level) {},
  /** No args */
  hr: function() {},
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
    return text;
  },

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /** text: string */
  strong: function(text) {},
  /** text: string */
  em: function(text) {},
  /** code: string */
  codespan: function(code) {},
  br: function() {},
  /** text: string */
  del: function(text) {},
  /** href: string, title: string, text: string */
  link: function(href, title, text) {},
  /** image: string, title: string, text: string */
  image: function(href, title, text) {}

  ///////////////////
  // Not Supported //
  ///////////////////
  // code: function(code, language) {},
  // blockquote: function(quote) {},
  // html: function(html) {},
  // table: function(header, body) {},
  // tablerow: function(content) {},
  // tablecell: function(content, flags) {},
};
