#!/usr/bin/env node

var glift = require('../defs/glift.js');
var gpub = require('../defs/gpub.js');
var flagz = require('../defs/flagz.js')
var filez = require('../defs/filez.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for autonumbering SGFs',
  ['<sgf-filenames>'],
  {
    directory: ['string', ''],
  }).process();

var def = filez.readFromDirAndArgs(
    flags.directory, flags.args, '\\.sgf');
