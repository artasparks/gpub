const fs = require('fs')
const path = require('path')

const files = require('./files.js')

module.exports = {
  render: function(opts) {
    if (!opts.input) {
      throw new Error('Expected input-spec to be defined, but was: '
          + opts.input +
          '. Pass in with --input <spec-name>');
    }
    var inputFile = opts.input;

    var outputDir = '';
    if (!opts.outputDir) {
      var baseDirName = path.dirname(inputFile);
      outputDir = path.join(baseDirName, 'diagrams');
    } else {
      outputDir = baseDirName
    }

    if (opts.createOutputDir) {
      try {
        // Try to make the directory, to ensure it exists
        fs.mkdirSync(outputDir);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          // Great, it already exists
        }
      }
    }

    var parsed = files.readAndParseSpec(inputFile);

    if (opts.diagramType) {
      if (!parsed.spec.diagramOptions) {
        parsed.diagramOptions = {};
      }
      parsed.spec.diagramOptions.diagramType = opts.diagramType;
    }

    console.log('Rendering digarams from: ' + inputFile);
    console.warn('Note: The gpub spec must already be processed ' +
        'in order to generate diagrams.')

    // Async write the files.
    gpub.initFromSpec(parsed.spec).renderDiagramsStream(function(diagram, meta) {
      var fpath = path.join(outputDir, diagram.id) + '.' + meta.extension;
      fs.writeFileSync(fpath, diagram.rendered);
      if (opts.writeComments) {
        var cpath = path.join(outputDir, diagram.id) + '-comments.txt';
        fs.writeFileSync(cpath, meta.comment);
      }
    });
    console.log('Done rendering!');
  },
};
