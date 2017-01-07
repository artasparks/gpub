/**
 * Create the star points.  See boardPoints.starpoints() for details about which
 * points are used
 *
 * @param {!glift.flattener.Flattened} flat
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints Board points object.
 */
gpub.diagrams.svg.starpoints = function(flat, svg, boardPoints) {
  var size = 0.15 * boardPoints.spacing;
  var starPointData = boardPoints.starPoints();
  for (var i = 0, ii = starPointData.length; i < ii; i++) {
    var pt = starPointData[i];
    var coordPt = boardPoints.getCoord(pt).coordPt;
    svg.append(glift.svg.circle()
      .setAttr('cx', coordPt.x())
      .setAttr('cy', coordPt.y())
      .setAttr('r', size)
      .setAttr('fill', 'black'));
  }
};
