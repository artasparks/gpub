goog.provide('gpub.diagrams.BoardPoints');
goog.provide('gpub.diagrams.BoardPt');

/**
 * A collection of values indicating in intersection  on the board. The intPt
 * is the standard (0-18,0-18) point indexed from the upper left. The coordPt
 * is the float point in rendered space, mesaured in pt. Lastly, each
 * intersection on the board 'owns' an area of space, indicated by the bounding
 * box.
 *
 * To be clear, the coordPt is the center of the bbox (indicated by the star below).
 *
 * |-------|
 * |       |
 * |   *   |
 * |       |
 * |-------|
 *
 * @typedef {{
 *  intPt: !glift.Point,
 *  coordPt: !glift.Point,
 *  bbox: !glift.orientation.BoundingBox
 * }}
 */
gpub.diagrams.BoardPt;

/**
 * Points-helper for Board Creation for image-types. Based on
 * glift.displays.BoardPoints;
 *
 * @param {!Object<!glift.PtStr, !gpub.diagrams.BoardPt>} points
 * @param {!number} spacing Measures the side of a BoardPt bbox. Alternatively,
 * the distance between intersections.
 *
 * @struct @constructor @final
 */
gpub.diagrams.BoardPoints = function(points, spacing) {
  /** @const {!Object<!glift.PtStr, !gpub.diagrams.BoardPt>} */
  this.points = points;

  /**
   * How far apart should the intersections be? Assumption is that this is in
   * pt.
   * @const {number}
   */
  this.spacing = spacing;
};
