#!/usr/bin/env node

var glift = require('../glift.js');
var gpub = require('../gpub.js');
var flagz = require('../flagz.js')

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

var sgf = fs.readFileSync(flags.args[0]);

console.log(gpub.diagrams.create(
    '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])',
    gpub.diagrams.types.GOOE));
