#!/usr/bin/env node

window = {}; // So it doesn't bomb out
gpub = {};
require('../../src/compiled/gpub_combined.js');

for (var key in gpub) {
  exports[key] = gpub[key]
}
