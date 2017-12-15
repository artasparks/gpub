#!/usr/bin/env node

var program = require('commander');
var process = require('process');

var gpub = require('../index');
var initializer = require('./initializer')
var parser = require('./parser')

program
  .version('0.1.0');
  // Global options
  //

function listify(val) {
  return val.split(',');
}

program
  .command('init')
  .option('-t, --book-type <type>', 'Book type to initialize the book', 'Problem')
  .option('-c, --no-crawl', 'Whether to not crawl the current directory looking for sgfs.', true)
  .option('-w, --crawl-dir <dir>', 'directory to crawl looking for SGFs. Defaults to cwd', '')
  .description('Initializes a book directory')
  .action(function(options) {
    if (!options.crawlDir) {
      options.crawlDir = process.cwd()
    }
    initializer.init(options);
  });

program
  .command('parse')
  .option('-f, --files [files]', 'Files to process', listify, [])
  .option('-o, --output-dir [dir]', 'Output directory. Defaults to cwd', '')
  .option('-i, --input-dir [dir]', 'Input directory. ' +
      'If specified, preferred to individual files')
  .description('Parse go files into SGF.')
  .action(function(options) {
    if (!options) {
      console.log('Must define options (at least files).')
      return
    }
    if (!options.files && !options.inputDir) {
      console.log('One of --files or --input_dir must be defined')
      return
    }
    if (!options.outputDir) {
      options.outputDir = process.cwd()
    }
    parser.parse(options)
  });

program.parse(process.argv);

if (!program.args.length) program.help();
