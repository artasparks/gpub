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
    var base = '::fig' // Default to fig types.
    // TODO(kashomon): Use flattener box
    var cropping = 'vw:'; // + coords
    return '';

    // TODO(kashomon): Consider the labels on the diagram?
  },

  /**
   * Converts a normal Glift point into Smartgo coordinate.
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
   * As with Igo, I is skipped. Also, a strange property of SmartGo points is
   * that they are concatenated together: A1M10O4. This is 3 points: A1,M10,O4.
   *
   * @param {!glift.Point} pt
   * @param {number} size
   * @return string
   */
  toSGCoord: function(pt, size) {
    if (!pt) { throw new Error('No point'); }
    if (!size) { throw new Error('No board size'); }
    if (pt.x() < 0 || pt.y() < 0 || pt.x() > size-1 || pt.y() > size-1) {
      throw new Error('Pt out of bounds: ' + pt.toString());
    }
    var letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    var x = letters.charAt(pt.x());
    var y = size - pt.y();
    return x+y;
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

