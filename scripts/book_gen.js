#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')
var filez = require('./defs/filez.js')

var fs = require('fs');
var path = require('path')
var child_process = require('child_process')

var flags = flagz.init(
  'A script for generating books from book specs!',
  ['<json-book-definition>'],
  {
    outputFormat: ['string', 'LATEX', 'The output format for the book.'],
    directory: ['string', '', 'The directory from which to process SGFs.'],
    pageSize: ['gpub.book.page.type', 'LETTER',
        'Size of the output page (stock/trim size).'],
    gnosFontSize: ['gpub.diagrams.gnos.sizes', '12', 'Size of gnos diagram.'],
    autoCompile: ['boolean', 'true',
        'Automatically compile books with the relevant external programs. ' +
        'For example, compile LaTeX with pdflatex. Note: Only works ' +
        'for logical combinations'],

    // Extra book parts
    foreward: ['file name (must be in markdown)', 'foreward.md', 
        'The foreward, rendered as markdown.'],
    preface: ['file name (must be in markdown)', 'preface.md', 
        'The preface, rendered as markdown.'],
    acknowledgements: ['file name (must be in markdown)', 'acknowledgements.md',
        'The acknowledgements, rendered as markdown.'],
    introduction: ['file name (must be in markdown)', 'introduction.md',
        'The introduction, rendered as markdown.'],

    copyright: ['Copyright file name (must be in JSON)', 'copyright.json',
        'The copyright file, specified as JSON.']
  }).process();

var workingDir = process.cwd();
if (flags.processed.directory) {
  // Both directory was unset and the args were empty. Assume that the user
  // wants to work from the current directory.
  workingDir = path.resolve(flags.processed.directory);
}

var def = filez.readFromDirAndArgs(
    workingDir, flags.args, '', '\\.sgf');

// Create an array of SGFs to process.
var sgfArr = [] ;
for (var i = 0; i < def.collection.length; i++) {
  sgfArr.push(def.contents[def.collection[i]]);
}

var options = {
  sgfs: sgfArr,
  pageSize: flags.processed.pageSize,
  gnosFontSize: flags.processed.gnosFontSize,
  bookOptions: {
    frontmatter: {}
  }
};

// Process frontmatter into the book options.
var bookPartsKeys = [
  'foreward', 'preface', 'acknowledgements', 'introduction', 'copyright',
];

for (var i = 0; i < bookPartsKeys.length; i++) {
  var key = bookPartsKeys[i];
  var fname = flags.processed[key];
  var fpath = path.join(workingDir, fname);
  if (fs.existsSync(fpath)) {
    var content = fs.readFileSync(fpath, {encoding: 'utf8'});
    if (key === 'copyright') {
      content = JSON.parse(content);
    }
    if (content) {
      // Note: The text still needs to be converted from mardown to LaTeX.
      options.bookOptions.frontmatter[key] = content;
    }
  }
}

var book = gpub.create(options);

if (workingDir) {
  var parts = workingDir.split(path.sep)
  var lastPart = parts[parts.length -1];
  if (flags.processed.outputFormat === 'LATEX') {
    var fname = path.join(workingDir, lastPart) + '.tex';
    fs.writeFileSync(fname, book);
    if (flags.processed.autoCompile) {
      console.log('Compiling with pdflatex');
      child_process.execSync('cd ' + workingDir + ' && which pdflatex && pdflatex ' + fname);
    }
  } else {
    console.log(book);
  }
} else {
  console.log(book);
}
