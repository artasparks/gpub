#!/usr/bin/env node

var glift = require('./defs/glift.js');
var gpub = require('./defs/gpub.js');
var flagz = require('./defs/flagz.js')
var filez = require('./defs/filez.js')

var fs = require('fs');
var path = require('path')
var child_process = require('child_process')

var scriptDir = path.dirname(require.main.filename);
var resourcesDir = path.join(scriptDir, '..', 'resources');

var flags = flagz.init(
  'A script for generating books from book specs!',
  ['<json-book-definition or SGFs>'],
  {
    outputPhase: ['gpub.outputPhase', 'BOOK',
        'The terminating output phase -- either, SPEC, DIAGRAMS, or BOOK'],

    outputFormat: ['string', 'LATEX', 'The output format for the book.'],
    directory: ['string', '', 'The directory from which to process SGFs.'],
    outputFileName: ['string', '', 'Defaults to current directory name.'],
    pageSize: ['gpub.book.page.type', 'LETTER',
        'Size of the output page (stock/trim size).'],
    goIntersectionSize: ['(string) Qualified size', '12pt',
        'Size of rendered diagram intersection. Units must be specified. ' +
        'Examples: 12pt, 20px, 12mm, 1.2in'],
    autoBoxCropOnVariation: ['boolean', false,
        'Automatically perform box crop on the variation'],
    regionRestrictions: ['Array<glift.enums.boardRegions>', null,
        'Array of preferred boardregions for cropping purposes'],

    // Extra book parts
    foreword: ['file name (must be in markdown)', 'foreword.md', 
        'The foreword, rendered as markdown.'],
    preface: ['file name (must be in markdown)', 'preface.md', 
        'The preface, rendered as markdown.'],
    acknowledgements: ['file name (must be in markdown)', 'acknowledgements.md',
        'The acknowledgements, rendered as markdown.'],
    introduction: ['file name (must be in markdown)', 'introduction.md',
        'The introduction, rendered as markdown.'],
    copyright: ['file name (must be in JSON)', 'copyright.json',
        'The copyright file, specified as JSON.'],
    glossary: ['file name (must be in JSON)', 'glossary.md',
        'The glossary file, specified as markdown.'],

    pdfx1a: ['boolean', false, 'Whether or not to generate PDF/X-1a valid PDFs'],
    colorProfileFilePath: ['file name',
        path.join(resourcesDir, 'ISOcoated_v2_300_eci.icc'),
        'Color profile file. Defaults to ISOcoated_v2_300_eci.icc in ' +
        'GPub\'s resources. Only used for PDF/X-1a pdfs.'],
    debug: ['boolean', false, 'Whether or not debugging information is enabled.']
  }).process();

var workingDir = process.cwd();
if (flags.processed.directory) {
  // Both directory was unset and the args were empty. Assume that the user
  // wants to work from the current directory.
  workingDir = path.resolve(flags.processed.directory);
}

var workingDirForFilez = workingDir;
if (flags.args.length) {
  // Assume the user doesn't want the entire directory processed
  workingDirForFilez = '';
}

var def = filez.readFromDirAndArgs(workingDirForFilez, flags.args);

// Create an array of SGFs to process.
var sgfArr = [];
for (var i = 0; i < def.collection.length; i++) {
  sgfArr.push(def.contents[def.collection[i]]);
}

var options = {
  sgfs: sgfArr,
  pageSize: flags.processed.pageSize,
  gnosFontSize: flags.processed.gnosFontSize,
  autoBoxCropOnVariation: flags.processed.autoBoxCropOnVariation,
  regionRestrictions: flags.processed.regionRestrictions,
  bookOptions: {
    frontmatter: {},
    appendices: {},
  },
  pdfx1a: flags.processed.pdfx1a,
  colorProfileFilePath: flags.processed.colorProfileFilePath,
  debug: flags.processed.debug
};

// Process frontmatter and appendices into the book options.
var bookParts = {
  frontmatter: 
      ['foreword', 'preface', 'acknowledgements', 'introduction', 'copyright'],
  appendices: ['glossary']
}

for (var category in bookParts) {
  var partsArray = bookParts[category];
  for (var i = 0; i < partsArray.length; i++) {
    var key = partsArray[i];
    var fname = flags.processed[key];
    var fpath = path.join(workingDir, fname);
    if (fs.existsSync(fpath)) {
      var content = fs.readFileSync(fpath, {encoding: 'utf8'});
      if (key === 'copyright') {
        content = JSON.parse(content);
      }
      if (content) {
        // Note: The text still needs to be converted from mardown to LaTeX.
        options.bookOptions[category][key] = content;
      }
    }
  }
}

var book = gpub.create(options);

if (workingDir) {
  var parts = workingDir.split(path.sep)
  var lastPart = parts[parts.length - 1];
  if (flags.processed.outputFormat === 'LATEX') {
    var fname = 'mybook.tex';
    if (flags.processed.outputFileName) {
      fname = path.join(workingDir, flags.processed.outputFileName) + '.tex';
    } else {
      fname = path.join(workingDir, lastPart) + '.tex';
    }
    fs.writeFileSync(fname, book);
  } else {
    console.log(book);
  }
} else {
  console.log(book);
}
