/**
 * Markdown for Gpub. Note that Glift comes pre-packaged with markdown.
 *
 * Most output formats will want to defined a custom renderer.
 */
gpub.markdown = {
  /** For reference, here are the relevant methods */
  rendererMethods: {
    //////////////////////////////////
    // Block level renderer methods //
    //////////////////////////////////

    /** code: string, language: string */
    code: function(code, language) {},
    /** quote: string */
    blockquote: function(quote) {},
    /** html: string */
    html: function(html) {},
    /** text: string, level: number  */
    heading: function(text, level) {},
    /** No args */
    hr: function() {},
    /** body: string, ordered: boolean */
    list: function(body, ordered) {},
    /** text: string */
    listitem: function(text) {},
    /** text: string */
    paragraph: function(text) {},
    /** header: string, body: string*/
    table: function(header, body) {},
    /** content: string */
    tablerow: function(content) {},
    /** content: string, flags: object */
    tablecell: function(content, flags) {}

    ///////////////////////////////////
    // Inline level renderer methods //
    ///////////////////////////////////
  }
};
