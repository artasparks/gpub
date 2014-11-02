#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating single go diagrams.',
  ['<sgf-filename>'],
  {
    'init_position': ['string', ''],
    'next_moves_path': ['string', ''],
    'board_region': ['glift.enums.boardRegions', 'AUTO'],
  }).process();

var sgf = fs.readFileSync(flags.args[0], {encoding: 'utf8'});

console.log(gpub.diagrams.create(
    sgf,
    gpub.diagrams.types.GOOE,
    flags.processed.init_position,
    flags.processed.next_moves_path,
    flags.processed.board_region));
