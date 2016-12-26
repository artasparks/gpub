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
 * }}
 */
gpub.diagrams.BoardPt;

/**
 * Points-helper for Board Creation for image-types. Based on
 * glift.displays.BoardPoints;
 *
 * @param {!Array<!gpub.diagrams.BoardPt>} points
 * @param {!number} spacing Measures the side of a BoardPt bbox. Alternatively,
 * the distance between intersections.
 * @param {!glift.orientation.BoundingBox} bbox Intersection bounding bbox.
 *
 * @struct @constructor @final
 */
gpub.diagrams.BoardPoints = function(points, spacing, bbox) {
  /** @const {!Array<!gpub.diagrams.BoardPt>} */
  this.points = points;

  /**
   * How far apart should the intersections be? Assumption is that this is in
   * pt.
   * @const {number}
   */
  this.spacing = spacing;

  /**
   * Half the amount of spacing.
   * @const {number}
   */
  this.radius = spacing / 2;

  /**
   * Intersection bbox.
   * @const {!glift.orientation.BoundingBox}
   */
  this.bbox = bbox;
};


/**
 * Creates a beard points wrapper from a flattened object.
 *
 * @param {!glift.flattener.Flattened} flat
 * @param {number} spacing In pt.
 */
gpub.diagrams.BoardPoints.fromFlattened = function(flat, spacing) {
  return gpub.diagrams.BoardPoints.fromBbox(
      flat.board().boundingBox(), spacing);
};

/**
 * Creates a board points wrapper.
 *
 * @param {glift.orientation.BoundingBox} bbox In intersections
 * @param {number} spacing Of the intersections. In pt.
 * @return {!gpub.diagrams.BoardPoints}
 */
gpub.diagrams.BoardPoints.fromBbox = function(bbox, spacing) {
  var tl = bbox.topLeft();
  var br = bbox.botRight();
  var half = spacing / 2;
  /** @type {!Array<!gpub.diagrams.BoardPt>} */
  var bpts = [];
  for (var x = tl.x(); x < bbox.width(); x++) {
    for (var y = tl.y(); y < bbox.height(); y++) {
      var i = x - tl.x();
      var j = y - tl.y();
      var b = {
        intPt: new glift.Point(x, y),
        coordPt: new glift.Point(x + half + i*spacing, y + half + j*spacing),
      };
    }
  }
  return new gpub.diagrams.BoardPoints(bpts, spacing, bbox);
};
