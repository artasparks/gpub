goog.provide('gpub.diagrams.smartgo.Renderer');

/**
 * Spec: http://www.smartgo.com/pdf/gobookformat.pdf
 *
 *
 * Some notes:
 * -   All books must start with something like:
 *     ::book(#mahbook) title="Example Title" author="Somebody"
 * -   Each file contains one book -- the file extension should be .gobook.
 *
 * Note: smart go diagrams are indexed from the bottom left:
 * 19
 * 18
 * ..
 * 3
 * 2
 * 1
 *   A B C D E F G H J K ...
 *
 * As with Igo, I is skipped
 *
 * @constructor @final @struct
 */
gpub.diagrams.smartgo.Renderer = function() {
};

gpub.diagrams.smartgo.Renderer.prototype = {
  /**
   * The create method for smartgo
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return '';
  },

  /**
   * Render-inline the
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return '';
  }
};
