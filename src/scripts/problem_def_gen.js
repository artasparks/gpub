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
    ordering: ['string', null],
    namespace: ['string', null]
  }).process();

if (flags.processed.ordering && flags.processed.directory) {
  console.error('Both <ordering> and <directory> cannot be defined. pick one');
  return;
}

var sgfs = [];
if (flags.processed.directory) {
  var fnames = fs.readdirSync(flags.processed.directory);
  console.log(fnames);
}

// var sgf = fs.readFileSync(flags.args[0], {encoding: 'utf8'});
