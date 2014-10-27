#!/usr/bin/env node

var glift = require('../glift.js');
var gpub = require('../gpub.js');
var flagz = require('../flagz.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating books from book specs!',
  ['<json-book-definition>'],
  {
    book_title: ['string', 'My Book'],
    output_dir: ['string', 'gpub-book'],
    book_type: ['string', 'HTML'],
    template: ['string', 'templates/html_book_templates.html'],
  }).process();

var bookDef = JSON.parse(fs.readFileSync(flags.args[0], {encoding: 'utf8'}));

console.log(gpub.book.latex.generate(bookDef))
