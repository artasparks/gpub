#!/usr/bin/env node

var program = require('commander');
// var gpub = require('gpub');

program
  .version('0.1.0');
  // Global options

program
  .command('init')
  .description('Initializes a book directory')
  .action(function(env, options){
    console.log('zog');
  });

program.parse(process.argv);

if (!program.args.length) program.help();
