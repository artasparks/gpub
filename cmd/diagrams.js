const fs = require('fs')
const path = require('path')

const gpub = require('../index');
const files = require('./files')

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

    if (!opts.nocreateOutputDir) {
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

    // Async write the files.
    var api = gpub.initFromSpec(parsed.spec)
    if (!opts.noautoProcess) {
      console.log('Processing spec: ' + inputFile);
      api = api.processSpec();
    } else {
      console.warn('Auto-processing disabled (--noauto-process)')
      console.warn('Note: The gpub spec must already be processed ' +
          'in order to generate diagrams.')
    }

    console.log('Rendering diagrams from: ' + inputFile);
    console.log('Writing diagrams to: ' + outputDir);

    var diagramType = parsed.spec.diagramOptions.diagramType;
    console.log('Using Diagram Type: ' + diagramType);

    var fmt = gpub.book.formatter.fromDiagramType(diagramType);
    api.renderDiagramsStream(function(diagram, meta) {
      var fpath = path.join(outputDir, diagram.id) + '.' + meta.extension;
      fs.writeFileSync(fpath, diagram.rendered);

      // Optionally write comment files
      if (opts.writeComments) {
        var cpath = path.join(outputDir, diagram.id) + '-comment.txt';
        var content = meta.comment;
        if (!opts.nomarkdownComments) {
          content = gpub.book.formatter.joinProcessed(fmt(content));
        }
        fs.writeFileSync(cpath, content);
      }
    });
    console.log('Done rendering!');
  },
};
