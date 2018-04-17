const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const gpub = require('../index');
const files = require('./files')

const initTypeOverrides= {
  PROBLEM_EBOOK: {
    templateType: 'PROBLEM_EBOOK',
    positionType: 'PROBLEM',
    diagramType: 'SVG',
  },
  PROBLEM_LATEX: {
    templateType: 'PROBLEM_LATEX',
    positionType: 'PROBLEM',
    diagramType: 'GNOS',
  },

  COMMENTARY_EBOOK: {
    templateType: 'COMMENTARY_EBOOK',
    positionType: 'GAME_COMMENTARY',
    diagramType: 'SVG',
  },
  COMMENTARY_LATEX: {
    templateType: 'COMMENTARY_LATEX',
    positionType: 'GAME_COMMENTARY',
    diagramType: 'GNOS',
  },
}

var methods = {
  init: function(opts) {
    console.log('Initializing GPub book spec!');

    if (opts.initType) {
      console.log('Usaging simplified initialization for type: ' + opts.initType)
      if (!initTypeOverrides[opts.initType]) {
        console.warn('Unknown init type: ' + opts.initType);
      } else {
        var overrides = initTypeOverrides[opts.initType];
        for (var key in overrides) {
          opts[key] = overrides[key]
        }
      }
    }

    if (!opts.templateType) {
      throw new Error('template-type must be specified. was: '
          + opts.templateType);
    }
    if (!opts.diagramType) {
      throw new Error('diagram-type must be specified. was: '
          + opts.diagramType);
    }
    if (!opts.positionType) {
      throw new Error('position-type must be specified. was: '
          + opts.positionType);
    }
    if (!opts.output) {
      throw new Error('output-file must be specified. was: '
          + opts.output);
    }
    var maxDiaDist = parseInt(opts.maxDiagramDistance, 10);
    if (isNaN(maxDiaDist)) {
      throw new Error('--maix-diagram-distance could not be parsed. was: '
          + opts.maxDiagramDistance);
    }

    var crawl = opts.crawl;
    var crawlDir = opts.crawlDir;
    console.log('Crawling the following dir looking for SGFs: ' + crawlDir);

    // filter only SGFs
    var filter = (f) => {
      return /.*\.sgf$/.test(f);
    };
    // Ignore dot files
    var ignore = (f) => {
      return /^\..*/.test(f);
    };

    var results = files.walkSync(opts.crawlDir, filter, ignore);

    var sorted = files.numberSuffixSort(results);
    var idContentsMap = files.idToContentsMap(sorted);
    var idFileMap = files.idToFileMap(sorted);
    var ids = files.createFileIds(sorted);

    var gpubOpts = {
      template: opts.templateType,
      games: idContentsMap,
      grouping: ids,
      specOptions: {
        positionType: opts.positionType,
        maxDiagramDistance: maxDiaDist,
        useNextMovesPath: opts.useNextMovesPath,
      },
      diagramOptions: {
        diagramType: opts.diagramType,
        ignoreRenderLabels: opts.ignoreRenderLabels,
      },
      templateOptions: {
        chapterSize: 25,
      }
    };

    var api = gpub.init(gpubOpts).createSpec();

    var spec = api.spec();
    files.writeSpec(opts.output, spec, idFileMap, opts.format);
  },
};


module.exports = methods;
