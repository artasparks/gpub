/**
 * Create the star points.  See boardPoints.starpoints() for details about which
 * points are used
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} bps
 * @param {!glift.flattener.BoardPt} bpt
 */
gpub.diagrams.svg.starpoint = function(svg, bps, bpt) {
  var size = 0.15 * bps.spacing;
  var coordPt = bpt.coordPt;
  svg.append(glift.svg.circle()
    .setAttr('cx', coordPt.x())
    .setAttr('cy', coordPt.y())
    .setAttr('r', size)
    .setAttr('fill', 'black'));
};
