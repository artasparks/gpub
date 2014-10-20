#!/usr/bin/env node

var glift = require('../glift.js');
var gpub = require('../gpub.js');
var flagz = require('../flagz.js')

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

var out = gpub.gen.collection.fromGames(files);

console.log(JSON.stringify(gpub.gen.collection.fromGames(files)));
