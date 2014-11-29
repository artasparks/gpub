#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating books from book specs!',
  ['<json-book-definition>'],
  {
    diagram_type: ['string', 'GNOS'],

    // These are currently unused
    book_title: ['string', 'My Book'],
    output_dir: ['string', 'gpub-book'],
    book_type: ['string', 'LATEX'],
    template: ['string', 'templates/html_book_templates.html'],
  }).process();

var bookDef = JSON.parse(fs.readFileSync(flags.args[0], {encoding: 'utf8'}));

var def = gpub.book.latex.generate(
    bookDef,
    null, // template string
    flags.processed.diagram_type,
    null  // optionsb
);

console.log(def);
