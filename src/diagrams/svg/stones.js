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
  svg.append(glift.svg.circle()
    .setAttr('cx', pt.coordPt.x())
    .setAttr('cy', pt.coordPt.y())
    .setAttr('r', bps.radius - .4) // subtract for stroke
    .setAttr('fill', color.toLowerCase()))
};
