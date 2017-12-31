const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const files = require('./files.js')

module.exports = {
  process: function(opts) {
    if (!opts.input) {
      throw new Error('Expected input-spec to be defined, but was: '
          + opts.input +
          '. Pass in with --input <spec-name>');
    }
    var inputFile = opts.input;
    var parsed = files.readAndParseSpec(inputFile);

    console.log('Processing: ' + inputFile);
    var api = gpub.initFromSpec(parsed.spec).processSpec();

    var outSpec = api.spec();

    var outputFile = '';
    if (opts.output) {
      outputFile = opts.output;
    } else {
      var outDirName = path.dirname(inputFile);
      var extName = path.extname(inputFile);
      var baseName = path.basename(inputFile, extName);
      outputFile = path.join(outDirName, baseName) + '-processed' + extName;
    }
    console.log(outputFile);

    files.writeSpec(outputFile, outSpec, parsed.idFileMap, opts.format);

    console.log('Finished processing!');
  }
}
