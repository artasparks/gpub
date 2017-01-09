/**
 * Create the Go stones.  They are initially invisible to the user, but they
 * all exist at the time of GoBoard creation.
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} bps
 * @param {!glift.flattener.BoardPt} pt
 * @param {!glift.enums.states} color the color of the stone
 */
gpub.diagrams.svg.stone = function(svg, bps, pt, color) {
  var circ = glift.svg.circle()
    .setAttr('cx', pt.coordPt.x())
    .setAttr('cy', pt.coordPt.y())
    .setAttr('fill', color.toLowerCase());
  if (color === glift.enums.states.WHITE) {
    circ.setAttr('stroke', 'black')
        .setAttr('r', bps.radius - .4); // subtract for stroke
  } else {
    circ.setAttr('r', bps.radius);
  }
  svg.append(circ);
};
