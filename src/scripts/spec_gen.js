#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating single go diagrams.',
  ['<sgf-filenames>'],
  {
    directory: ['string', ''],
    spec_type: ['gpub.spec.specType', 'GAME_BOOK'],
    region: ['glift.enums.boardRegion', ''],
    js_namespace: ['string', 'gliftspec'],
    as_javascript: ['boolean', false]
  }).process();

var sgfregex = /.*\.sgf$/;
var sgfs = [];
var fnames = [];

// It's not clear if we should process files from both the command line and from
// a directory argument.
for (var i = 0; i < flags.args.length; i++) {
  if (sgfregex.test(flags.args[i])) {
    fnames.push(frags.args[i]);
  }
}

if (flags.processed.directory) {
  var dir = flags.processed.directory;
  var tmpfnames = fs.readdirSync(flags.processed.directory);
  for (var i = 0; i < tmpfnames.length; i++) {
    if (sgfregex.test(tmpfnames[i])) {
      fnames.push(path.join(dir, tmpfnames[i]));
    }
  }
}

for (var i = 0; i < fnames.length; i++) {
  sgfs.push(fs.readFileSync(fnames[i], {encoding: 'utf8'}));
}

var options = {};
if (flags.processed.region) {
  options.region = flags.processed.region;
}

var out = gpub.spec.fromSgfs(
    sgfs,
    flags.processed.spec_type,
    flags.processed.region);

if (flags.processed.as_javascript) {
  console.log(flags.processed.js_namespace + ' = ');
  console.log(out);
} else {
  // Log as JSON
  console.log(JSON.stringify(out));
}
