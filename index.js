#!/usr/bin/env node

var preprocess = require('./cmd/files.js')

/**
 * Some base globals, that are relied upon by gpub
 */
window = {};
goog = {
  require: function(ns) {},
  scope: function(fn) { fn(); },
  provide: function(ns) { ns; },
};
gpub = {};
glift = {};

// This dumps alll the gpub stuff into the globals above.
require('./gpub-node/gpub-concat.js');

for (var key in gpub) {
  module.exports[key] = gpub[key];
}

// Note: Glift is still exposed as a horrible global. Yuck.

module.exports.glift = {}
for (var key in glift) {
  module.exports.glift[key] = glift[key];
}

// TODO(kashomon): Get rid of this eventually
module.exports.preprocess = preprocess;
