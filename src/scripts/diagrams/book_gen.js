#!/usr/bin/env node

var glift = require('../glift.js');
var gpub = require('../gpub.js');
var flagz = require('../flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating books!  Note: A lot of tertiary stuff gets created! ' +
  'Thus, you may want to manually set the --outputDir flag.'
  ['<json-book-definition>'],
  {
    book_title: ['string', 'My Book'],
    output_dir: ['string', 'gpub-book'],
    book_type: ['string', 'HTML'],
    template: ['string', 'templates/html_book_templates.html'],
  }).process();

var bookDef = fs.readFileSync(flags.args[0], {encoding: 'utf8'});

console.log(JSON.parse(out));
