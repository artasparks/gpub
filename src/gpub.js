/**
 * @preserve GPub: A Go publishing platform, built on Glift
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * @version 0.3.28
 * --------------------------------------
 */
(function(w) {
var g;
if (typeof gpub !== 'undefined') {
  g = gpub;
} else if (typeof w.gpub !== 'undefined') {
  g = w.gpub
} else {
  g = {};
}

if (w) {
  // expose Glift as a global.
  w.gpub = g;
}
})(window);
