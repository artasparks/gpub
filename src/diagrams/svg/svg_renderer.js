goog.provide('gpub.diagrams.svg.Renderer');

/**
 * The diagrams-specific renderer for svg.
 * @constructor @final @struct
 */
gpub.diagrams.svg.Renderer = function() {};

gpub.diagrams.svg.Renderer.prototype = {
  /**
   * Create an SVG diagarm from a flattened object.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    var svgOptions = this.getSvgOptions(opt);

    var spz = opt.goIntersectionSize || 20;
    var spacing = gpub.util.size.parseSizeToPt(spz);
    var bps = glift.flattener.BoardPoints.fromFlattened(flat, spacing);
    var data = bps.data();
    var board = flat.board();
    var sym = glift.flattener.symbols;

    var svg = glift.svg.svg()
      .setStyle(gpub.diagrams.svg.style(flat))
      // TODO(kashomon): Add the ability to specify width/height
      // .setAttr('width', '10em')
      .setViewBox(0, 0,
          bps.coordBbox.botRight().x(), bps.coordBbox.botRight().y());

    for (var i = 0; i < data.length; i++) {
      var bpt = data[i];
      var ion = board.getIntBoardPt(bpt.intPt);
      // For marks, a white stone is equivalent to an empty stone.
      var stoneCol = glift.enums.states.WHITE;
      if (ion.stone()) {
        if (ion.stone() === sym.BSTONE) {
          stoneCol = glift.enums.states.BLACK;
        }
        gpub.diagrams.svg.stone(svg, bps, bpt, stoneCol);
      } else if (!ion.textLabel()) {
        // Render lines/starpoints if there's no stone && no text-label intersection
        gpub.diagrams.svg.lines(svg, bps, bpt);
        if (ion.base() == sym.CENTER_STARPOINT) {
          gpub.diagrams.svg.starpoint(svg, bps, bpt);
        }
      }

      if (ion.mark()) {
        var label = ion.textLabel() || '';
        var gmark = glift.flattener.symbolMarkToMark[ion.mark()];
        gpub.diagrams.svg.mark(svg, bps, bpt, gmark, label, stoneCol);
      }
    }
    return svg.render();
  },

  /**
   * This isn't really possible with SVG, but it might be possible to rely on a
   * font for inline-rendering. Note that inline-rendering is overloaded here
   * because for SVG, this means raw inclusion in HTML, and here I mean
   * processing text like 'Black 6' into stone-images within the text.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return text;
  },

  /**
   * Gets the SVG options from a diagram options object.
   * @param {!gpub.api.DiagramOptions} opt
   * @return {!gpub.diagrams.svg.Options}
   */
  getSvgOptions: function(opt) {
    // Probably shouldn't default this...
    var typeOptions = opt.typeOptions || {};
    return new gpub.diagrams.svg.Options(
        /** @type {!gpub.diagrams.svg.Options} */ (typeOptions[gpub.diagrams.Type.SVG]))
  }
};

// Enabled the Renderer.
gpub.diagrams.enabledRenderers['SVG'] = function() {
  return new gpub.diagrams.svg.Renderer();
};
