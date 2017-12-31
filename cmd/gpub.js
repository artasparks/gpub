#!/usr/bin/env node

var program = require('commander');
var process = require('process');

var gpub = require('../index');
var initializer = require('./initializer')
var processor = require('./processor')
var parser = require('./parser')
var diagrams = require('./diagrams')

program
  // TODO(kashomon): Version with GPub
  .version(gpub.global.version);
  // Global options

function listify(val) {
  return val.split(',');
}

program
  .command('init-spec')
  .option('-c, --no-crawl', 'Whether to not crawl the current directory looking for sgfs.', true)
  .option('-w, --crawl-dir <dir>', 'Directory to crawl looking for SGFs. Defaults to cwd', '')
  .option('-i, --init-type [init-type]',
      'Optional simplified initialization types. One of {PROBLEM_EBOOK, COMMENTARY_LATEX}.',
      'COMMENTARY_LATEX')
  .option('-o, --output-file <file>',
      'File to write the yaml to defaults to go-book[.yaml|.json] in current directory',
      'go-book')
  .option('-f, --format <format>',
      'Format for the spec. YAML or JSON supported',
      'YAML')

  // Option overrides
  .option('-t, --template-type <template-type>', 
      'Book template for book creation', 'PROBLEM_EBOOK')
  .option('-p, --position-type <position-type>', 
      'Default position type for processing SGFs', 'PROBLEM')
  .option('-d, --diagram-type <diagram-type>', 
      'Diagram type for diagram image generation', 'SVG')

  .description('Initializes a book spec')
  .action(function(options) {
    if (!options.crawlDir) {
      options.crawlDir = process.cwd()
    }
    initializer.init(options);
  });

program
  .command('process')
  .option('-i, --input <spec-file>', 'Spec file to process into book-compatible form')
  .option('-o, --output [spec-file]', 'Output name for processed spec file. ' +
      'Defaults to input name + processed[.yaml|.json]', '')
  .option('-f, --format <format>',
      'Output format for the spec. YAML or JSON supported',
      'YAML')

  .description('Processes a book spec, returning processed spec')
  .action(function(options) {
    processor.process(options);
  });


program
  .command('render-diagrams')
  .option('-i, --input <spec-file>', 'Spec file from which to generate diagrams')
  .option('-o, --output-dir [dir]', 'Output directroy for generated diagrams. ' +
      'Defaults to spec-dir + /diagrams')
  .option('-e, --nocreate-output-dir', 'Whether to auto-create generated output dir.')
  .option('-p, --noauto-process', 'Whether to also process the Spec file generated output dir.')
  .option('-f, --diagram-type [diagram-type]',
      'Override the output format of the diagrams. Usually this comes from the spec', '')
  .option('-c, --write-comments', 'Whether to also write the comments to *-comment.txt files', false)

  .description('Render images from a gpub book spec.')
  .action(function(options) {
    diagrams.render(options);
  });

program
  .command('parse')
  .option('-f, --files <files>', 'Files to process (comma separated)', listify, [])
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
