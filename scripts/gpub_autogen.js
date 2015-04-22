#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')
var filez = require('./defs/filez.js')

var fs = require('fs');
var path = require('path')

var flags = flagz.init(
  'A script for generating books from book specs!',
  ['<json-book-definition>'],
  {
    optionsName: ['string', 'LATEX', 'The output format for the book.'],
    directory: ['string', '', 'The directory from which to process SGFs.']
  }).process();

var def = filez.readFromDirAndArgs(
    flags.processed.directory, flags.args, '', '\\.sgf');

var sgfArr = [] ;
for (var i = 0; i < def.collection.length; i++) {
  sgfArr.push(def.contents[def.collection[i]]);
}


var book = gpub.create({
  sgfs: sgfArr
});

console.log(book);
