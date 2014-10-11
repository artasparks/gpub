#!/usr/bin/env node

var path = require('path');
var glift = require('../glift.js');
var gpub = require('../gpub.js');
var fs = require('fs');
var path = require('path')

process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
});

var cwd = process.cwd();

var inputSgf = process.argv[2];

return;

if (!inputJsPath) {
  console.log("Input Spec path needs to be defined.");
  process.exit(1);
}

var sgfData = fs.readFileSync(inputJsPath, 'UTF8');

console.log(gpub.diagrams.create(
    '(;GB[1]C[foo]AW[aa]AB[ab]LB[ab:z])',
    gpub.diagrams.types.GOOE));
