goog.provide('gpub.diagrams.smartgo.Renderer');

/**
 * Spec: http://www.smartgo.com/pdf/gobookformat.pdf
 *
 * Some notes:
 * -   All books must start with something like:
 *     ::book(#mahbook) title="Example Title" author="Somebody"
 * -   Each file contains one book -- the file extension should be .gobook.
 *
 *
 * More details on figure/diagram types: from the doc:
 *
 * fig: Main figures of a game, based on a Go game given as Go data, with move
 * numbers reflecting the moves in the game, and the move numbers listed below
 * the figure. Shown at full size.
 *
 * dia: Diagrams showing alternative move sequences. Move numbering starts at
 * 1.  Usually shown at a slightly smaller scale than the figures. (This
 * default setting can be changed with the fullWidth attribute.)
 *
 * prb: Diagrams showing a problem diagram. Problems are shown at full width,
 * and move input will react differently, giving feedback on correct or wrong
 * solutions.
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
   * Render-inline some inline text with smartgo
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return '';
  }
};

