/**
 * Create a smartgo diagram
 *
 * Spec: http://www.smartgo.com/pdf/gobookformat.pdf
 */
gpub.smartgo = {
  /**
   * Note: smart go diagrams are indexed from the bottom left:
   *
   * 19
   * 18
   * ..
   * 3
   * 2
   * 1
   *   A B C D E F G H I J K
   *
   * Moves are spcefied
   *
   */
  create: function(flattened, options) {

  },

  renderInline: function(text) {
    return text;
  }
};
