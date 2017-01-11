/**
 * Create the background lines. These are create at each individual intersection
 * rather than as a whole so that we can clear theme out when we to draw marks
 * on the raw board (rather than on stones).
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints Board points object.
 * @param {!glift.flattener.BoardPt} bpt
 */
gpub.diagrams.svg.lines = function(svg, boardPoints, bpt) {
  gpub.diagrams.svg.intersectionLine(
    svg, bpt, boardPoints.radius, boardPoints.numIntersections);
};

/**
 * @param {!glift.flattener.BoardPt} boardPt
 * @param {!number} radius Size of the space between the lines
 * @param {!number} numIntersections Number of intersections on the board.
 */
gpub.diagrams.svg.intersectionLine = function(
    svg, boardPt, radius, numIntersections) {
  // minIntersects: 0 indexed,
  // maxIntersects: 0 indexed,
  // numIntersections: 1 indexed (it's the number of intersections)
  var minIntersects = 0,
      maxIntersects = numIntersections - 1,
      coordinate = boardPt.coordPt,
      intPt = boardPt.intPt,
      svgpath = glift.svg.pathutils;
  var top = intPt.y() === minIntersects ?
      coordinate.y() : coordinate.y() - radius;
  var bottom = intPt.y() === maxIntersects ?
      coordinate.y() : coordinate.y() + radius;
  var left = intPt.x() === minIntersects ?
      coordinate.x() : coordinate.x() - radius;
  var right = intPt.x() === maxIntersects ?
      coordinate.x() : coordinate.x() + radius;

  var vline =
      // Vertical Line
      svgpath.move(coordinate.x(), top) + ' '
      + svgpath.lineAbs(coordinate.x(), bottom);

  var hline =
      // Horizontal Line
      svgpath.move(left, coordinate.y()) + ' '
      + svgpath.lineAbs(right, coordinate.y());

  if ((intPt.x() === minIntersects || intPt.x() === maxIntersects) &&
      (intPt.y() === minIntersects || intPt.y() === maxIntersects)) {
    // both are edge-lines (corner)
    svg.append(glift.svg.path()
      .setAttr('class', 'nl')
      .setAttr('d', vline + ' ' + hline));
  } else if (intPt.x() === minIntersects || intPt.x() === maxIntersects)  {
    // v-line is an edge
    svg.append(glift.svg.path()
      .setAttr('class', 'el')
      .setAttr('d', vline));
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', hline));
  } else if (intPt.y() === minIntersects || intPt.y() === maxIntersects) {
    // h-line is an edge
    svg.append(glift.svg.path()
      .setAttr('class', 'el')
      .setAttr('d', hline));
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', vline));
  } else {
    // both are center-lines
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', vline + ' ' + hline));
  }
};
