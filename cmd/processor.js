const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const files = require('./files.js')

var jsonRegex = /.sgf$/;
var yamlRegex = /.ymal$/;

module.exports = {
  process: function(opts) {
    if (!opts.input) {
      throw new Error('Expected input-spec to be defined, but was: '
          + opts.input);
    }

    console.log('Processing: ' + opts.input);
    var spec = files.readAndParseSpec(opts.input);
    var api = gpub.initFromSpec(spec).processSpec();
    console.log(api.spec_);
  }
}
