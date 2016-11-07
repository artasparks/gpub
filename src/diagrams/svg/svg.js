goog.provide('gpub.diagrams.svg');

/**
 * Generate SVG go diagrams.
 *
 * The primary reason we support SVG is so that we can support images in EPub
 * books. As of writing this (2015-9-12), eReaders usually disable JavaScript,
 * so that precludes the use of Canvas and Glift directly. However, Glift relies
 * on SVG, so we can piggyback on the existing SVG generation.
 *
 * Notes about generation:
 * It's usually useful to print a viewbox:
 *
 * <svg xmlns="http://www.w3.org/2000/svg"
 *      version="1.1" width="100%" height="100%"
 *      viewBox="0 0 844 1200">
 *    …
 * </svg>
 *
 * Restrictions:
 * - SVG for Ebooks must be static SVG -- no animation.
 * - svg:foreignObject element must contain either [HTML5] flow content or
 *   exactly one [HTML5] body element.
 * - The [SVG] svg:title element must contain only valid XHTML.
 *
 * Some Resources:
 * - EPub SVG Spec: http://www.idpf.org/epub/301/spec/epub-contentdocs.html#sec-svg
 * - EPub Standard: http://idpf.org/epub
 * - EPub 3.0.1 standard: http://idpf.org/epub/301
 * - http://svgmagazine.com/oct2014/Adventures%20With%20SVG%20In%20ePub.html
 * - http://svgpocketguide.com/
 */
gpub.diagrams.svg = {
  /**
   * @param {!glift.flattener.Flattened} flattened
   * @param {!gpub.api.DiagramOptions} options
   * @return {string} The rendered text
   */
  create: function(flattened, options) {
  },

  /**
   * Render go stones that exist in a block of text.
   * @param {string} text Inline text to render.
   * @param {!gpub.api.DiagramOptions} opt
   */
  renderInline: function(text, opt) {
    // We probably don't want to modifify inline go stones for SVG rendering.
    return text;
  }
};
