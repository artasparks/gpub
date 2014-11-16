#!/usr/bin/env node

var glift = require('../defs/glift.js');
var gpub = require('../defs/gpub.js');
var flagz = require('../defs/flagz.js')
var filez = require('../defs/filez.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for automagically converting files of various types to SGFs.\n' +
  'Currently supports\n' +
  '  Pandanet/IGS\n' +
  '  Tygem',
  ['<sgf-filenames>'],
  {
    directory: ['string', ''],
  }).process();

var filedef = filez.readFromDirAndArgs(
    flags.processed.directory, flags.args, '.*');

var outSgf = [];
for (var i = 0; i < filedef.contents.length; i++) {
  var fname = filedef.fnames[i];
  var contents = filedef.contents[i];
  var mt = glift.parse.fromFileName(contents, fname);
  var outSgf = mt.toSgf();
  filez.writeSgf(fname, outSgf);
}
