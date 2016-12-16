goog.provide('gpub.diagrams.smartgo');

/**
 * Package for Smartgo-book rendering.
 */
gpub.diagrams.smartgo = {
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
  toSmartGoCoord: function(pt, size) {
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
};
