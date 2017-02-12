/**
 * Add a mark of a particular type to the GoBoard
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints
 * @param {!glift.flattener.BoardPt} bpt
 * @param {!glift.enums.marks} mark
 * @param {string} label
 * @param {!glift.enums.states} stoneColor
 */
gpub.diagrams.svg.mark = function(
    svg, boardPoints, bpt, mark, label, stoneColor) {
  var svgpath = glift.svg.pathutils;
  var rootTwo = 1.41421356237;
  var rootThree = 1.73205080757;
  var marks = glift.enums.marks;
  var coordPt = bpt.coordPt;
  var fudge = boardPoints.radius / 8;

  var clazz = '';
  if (stoneColor == glift.enums.states.BLACK) {
    // Implies white labels, since
    if (label) {
      clazz = 'wl';
    } else {
      clazz = 'wm';
    }
  } else {
    // Default to black, since it's used for stones and empty intersections.
    if (label) {
      clazz = 'bl';
    } else {
      clazz = 'bm';
    }
  }

  // TODO(kashomon): Make these configurable ?
  var strokeWidth = 1;
  var fontSizeMultip = 0.7; // Really, a multiplier.
  var fill = 'black';
  var stroke = 'black';

  if (stoneColor === glift.enums.states.BLACK) {
    strokeWidth = strokeWidth * 0.4;
  }

  if (mark === marks.LABEL
      || mark === marks.VARIATION_MARKER
      || mark === marks.CORRECT_VARIATION
      || mark === marks.LABEL_ALPHA
      || mark === marks.LABEL_NUMERIC) {

    // If the labels are 3 digits, we make them a bit smaller to fit on the
    // stones.
    var threeDigitMod = label.length >= 3 ? 0.75 : 1;
    var textmark = glift.svg.text()
        .setText(label)
        .setAttr('class', clazz)
        .setAttr('dy', '.33em') // for vertical centering
        .setAttr('x', coordPt.x()) // x and y are the anchor points.
        .setAttr('y', coordPt.y())
        .setAttr('font-size',
            threeDigitMod * boardPoints.spacing * fontSizeMultip);
    if (strokeWidth != 1) {
      textmark.setAttr('stroke-width', strokeWidth)
    }
    svg.append(textmark);

  } else if (mark === marks.SQUARE) {
    var baseDelta = boardPoints.radius / rootTwo;
    // If the square is right next to the stone edge, it doesn't look as nice
    // as if it's offset by a little bit.
    var halfWidth = baseDelta - fudge;
    svg.append(glift.svg.rect()
        .setAttr('class', clazz)
        .setAttr('x', coordPt.x() - halfWidth)
        .setAttr('y', coordPt.y() - halfWidth)
        .setAttr('width', 2 * halfWidth)
        .setAttr('height', 2 * halfWidth));

  } else if (mark === marks.XMARK) {
    var baseDelta = boardPoints.radius / rootTwo;
    var halfDelta = baseDelta - fudge;
    var topLeft = coordPt.translate(-1 * halfDelta, -1 * halfDelta);
    var topRight = coordPt.translate(halfDelta, -1 * halfDelta);
    var botLeft = coordPt.translate(-1 * halfDelta, halfDelta);
    var botRight = coordPt.translate(halfDelta, halfDelta);
    svg.append(glift.svg.path()
        .setAttr('class', clazz)
        .setAttr('d',
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(topLeft) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(topRight) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(botLeft) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(botRight)));
  } else if (mark === marks.CIRCLE) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 2));
  } else if (mark === marks.STONE_MARKER) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 3)
        .setAttr('fill', fill));
  } else if (mark === marks.TRIANGLE) {
    var r = boardPoints.radius - boardPoints.radius / 5;
    var rightNode = coordPt.translate(r * (rootThree / 2), r * (1 / 2));
    var leftNode  = coordPt.translate(r * (-1 * rootThree / 2), r * (1 / 2));
    var topNode = coordPt.translate(0, -1 * r);
    svg.append(glift.svg.path()
        .setAttr('class', clazz)
        .setAttr('d',
            svgpath.movePt(topNode) + ' ' +
            svgpath.lineAbsPt(leftNode) + ' ' +
            svgpath.lineAbsPt(rightNode) + ' ' +
            svgpath.lineAbsPt(topNode) + ' ' +
            'Z')) // Connect up the paths
  } else if (mark === marks.KO_LOCATION) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 2)
        .setAttr('opacity', 0.5)
        .setAttr('fill', 'none')
        .setAttr('stroke', stroke));
  } else {
    // do nothing.  I suppose we could throw an exception here.
  }
};
