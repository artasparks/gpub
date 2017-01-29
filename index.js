#!/usr/bin/env node

var nodeutils = require('./nodeutils/nodeutils.js')

/**
 * Some base globals, so it doesn't bomb out.
 */
window = {};
goog = {
  require: function(ns) {},
  scope: function(fn) { fn(); },
  provide: function(ns) { ns; },
};
gpub = {};
glift = {};

require('./gpub-node/gpub-concat.js');

for (var key in gpub) {
  module.exports[key] = gpub[key];
}

module.exports.nodeutils = nodeutils;
