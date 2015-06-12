#!/usr/bin/env node

var glift = require('./defs/glift.js');
var flagz = require('./defs/flagz.js');
var filez = require('./defs/filez.js');
var fs = require('fs');

var flags = flagz.init(
  'A script for converting Tygem files to SGF!',
  ['<json-book-definition>'],
  {
    directory: ['string', '', 'The directory from which to process SGFs.'],
  }).process();

var def = filez.readFromDirAndArgs(
    flags.processed.directory, flags.args, '', '\\.gib');

for (var fname in def.contents) {
  var outFname = fname.replace(/.gib$/, '.sgf');
  var sgf = glift.parse.fromString(def.contents[fname], 'TYGEM').toSgf();
  fs.open(outFname, 'w', function(err, fd) {
    fs.write(fd, sgf, function() {
      fs.close(fd);
    })
  });
}
