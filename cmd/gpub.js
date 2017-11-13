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
  .option('-t, --book_type [type]', 'Book type to initialize the book as', 'Problem')
  .description('Initializes a book directory')
  .action(function(cmd, options){
    initializer.init();
  });

program
  .command('parse')
  .option('-t, --file_type [type]', 'Book type to initialize the book as')
  .option('-f, --files [files]', 'Files to process', listify, [])
  .option('-o, --output_dir [dir]', 'Output directory. Defaults to cwd', '')
  .option('-i, --input_dir [dir]', 'Input directory. ' +
      'If specified, preferred to individual files')
  .description('Parse go files into SGF.')
  .action(function(options) {
    if (!options) {
      console.log('Must define options (at least files).')
      return
    }
    if (!options.files && !options.input_dir) {
      console.log('One of --files or --input_dir must be defined')
      return
    }
    if (!options.output_dir) {
      options.output_dir = process.cwd()
    }
    parser.parse(options)
  });

program.parse(process.argv);

if (!program.args.length) program.help();
