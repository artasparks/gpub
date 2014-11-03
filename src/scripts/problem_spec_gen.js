#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating problem-set definitions!',
  [],
  {
    directory: ['string', './'],
    namespace: ['string', null]
  }).process();

if (flags.processed.ordering && flags.processed.directory) {
  console.error('Both <ordering> and <directory> cannot be defined. pick one');
  return;
}

var sgfs = [];
var fnames = [];
var sgfregex = /.*\.sgf$/;

if (flags.processed.directory) {
  var dir = flags.processed.directory;
  var tmpfnames = fs.readdirSync(flags.processed.directory);
  for (var i = 0; i < tmpfnames.length; i++) {
    if (sgfregex.test(tmpfnames[i])) {
      fnames.push(path.join(dir, tmpfnames[i]));
    }
  }
}

for (var i = 0; i < flags.args.length; i++) {
  if (sgfregex.test(flags.args[i])) {
    fnames.push(frags.args[i]);
  }
}

for (var i = 0; i < fnames.length; i++) {
  sgfs.push(fs.readFileSync(fnames[i], {encoding: 'utf8'}));
}

console.log(sgfs);
