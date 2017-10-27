#!/usr/bin/env node

var program = require('commander');
var gpub = require('../index');
var initializer = require('./initializer')

program
  .version('0.1.0');
  // Global options

program
  .command('init')
  .description('Initializes a book directory')
  .action(function(env, options){
    initializer.init();
  });

program.parse(process.argv);

if (!program.args.length) program.help();
