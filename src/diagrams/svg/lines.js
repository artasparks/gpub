/**
 * Create the background lines. These are create at each individual intersection
 * rather than as a whole so that we can clear theme out when we to draw marks
 * on the raw board (rather than on stones).
 *
 * @param {!glift.flattener.Flattened} flat
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints Board points object.
 */
gpub.diagrams.svg.lines = function(flat, svg, boardPoints) {
  var data = boardPoints.data();
  for (var i = 0; i < data.length; i++) {
    svg.append(glift.svg.path()
      .setAttr('d', gpub.diagrams.svg.intersectionLine(
          data[i],
          boardPoints.radius,
          boardPoints.numIntersections)));

      // .setAttr('stroke', theme.lines.stroke)
      // .setAttr('stroke-width', theme.lines['stroke-width'])
      // .setAttr('stroke-linecap', 'round'));
  }
};

/**
 * @param {!glift.flattener.BoardPt} boardPt
 * @param {!number} radius Size of the space between the lines
 * @param {!number} numIntersections Number of intersecitons on the board.
 */
gpub.diagrams.svg.intersectionLine = function(
    boardPt, radius, numIntersections) {
  // minIntersects: 0 indexed,
  // maxIntersects: 0 indexed,
  // numIntersections: 1 indexed (it's the number of intersections)
  var minIntersects = 0,
      maxIntersects = numIntersections - 1,
      coordinate = boardPt.coordPt,
      intersection = boardPt.intPt,
      svgpath = glift.svg.pathutils;
  var top = intersection.y() === minIntersects ?
      coordinate.y() : coordinate.y() - radius;
  var bottom = intersection.y() === maxIntersects ?
      coordinate.y() : coordinate.y() + radius;
  var left = intersection.x() === minIntersects ?
      coordinate.x() : coordinate.x() - radius;
  var right = intersection.x() === maxIntersects ?
      coordinate.x() : coordinate.x() + radius;
  var line =
      // Vertical Line
      svgpath.move(coordinate.x(), top) + ' '
      + svgpath.lineAbs(coordinate.x(), bottom) + ' '
      // Horizontal Line
      + svgpath.move(left, coordinate.y()) + ' '
      + svgpath.lineAbs(right, coordinate.y());
  return line;
};
