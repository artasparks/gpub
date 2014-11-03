#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating single go diagrams.',
  ['<sgf-filenames>'],
  {}).process();

var files = [];
for (var i = 0; i < flags.args.length; i++) {
  files.push(fs.readFileSync(flags.args[i], {encoding: 'utf8'}));
}

var out = gpub.spec.fromSgfs(files);
var outstr = JSON.stringify(out);
console.log(outstr);

// console.log(gpub.gen.collection.fromGames(files));
