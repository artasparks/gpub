#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')
var filez = require('./defs/filez.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating single go diagrams.',
  ['<sgf-filenames>'],
  {
    directory: ['string', ''],
    spec_type: ['gpub.spec.specType', 'GAME_BOOK'],
    region: ['glift.enums.boardRegion', ''],
    collection: ['filename', ''],
    js_namespace: ['string', 'gliftspec'],
    as_javascript: ['boolean', false]
  }).process();

var collection = flags.processed.collection || null;

var fileDef = filez.readFromDirAndArgs(
    flags.processed.directory, flags.args, collection);

var options = {};
if (flags.processed.region) {
  options.region = flags.processed.region;
}

var out = gpub.spec.fromSgfs(
    fileDef.collection,
    fileDef.contents,
    flags.processed.spec_type,
    flags.processed.region);

if (flags.processed.as_javascript) {
  console.log(flags.processed.js_namespace + ' = ');
  console.log(out);
} else {
  // Log as JSON
  console.log(JSON.stringify(out));
}
