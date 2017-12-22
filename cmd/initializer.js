const files = require('./files.js')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const initTypeOverrides= {
  PROBLEM_EBOOK: {
    templateType: 'PROBLEM_EBOOK',
    positionType: 'PROBLEM',
    diagramType: 'SVG',
  },
  COMMENTARY_LATEX: {
    templateType: 'RELENTLESS_COMMENTARY_LATEX',
    positionType: 'GAME_COMMENTARY',
    diagramType: 'GNOS',
  }
}

var z = {
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
      console.error('template-type must be specified. was: '
          + opts.templateType);
      return
    }
    if (!opts.diagramType) {
      console.error('diagram-type must be specified. was: '
          + opts.diagramType);
      return
    }
    if (!opts.positionType) {
      console.error('position-type must be specified. was: '
          + opts.positionType);
      return
    }
    if (!opts.outputFile) {
      console.error('output-file must be specified. was: '
          + opts.outputFile);
      return
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

    files.walk(opts.crawlDir, filter, ignore, (results) => {
      var sorted = files.numberSuffixSort(results);
      var idContentsMap = files.idToContentsMap(sorted);
      var idFileMap = files.idToFileMap(sorted);
      var ids = files.createFileIds(sorted);

      var api = gpub.init({
        template: opts.templateType,
        sgfs: idContentsMap,
        grouping: ids,
        specOptions: {
          positionType: opts.positionType,
        },
        diagramOptions: {
          diagramType: opts.diagramType,
        },
        templateOptions: {
          chapterSize: 25,
        }
      }).createSpec();

      var spec = api.spec();
      // We're going to do some hackery here. Instead of storing the SGF files
      // directly in the spec, we're going to re-store them linked to their
      // filenames.
      var outputDir = path.dirname(opts.outputFile);
      for (var id in idFileMap) {
        var file = idFileMap[id];
        var dir = path.dirname(file);
        idFileMap[id] = path.join(path.relative(outputDir, dir), path.basename(file))
      }
      spec.sgfMapping = idFileMap;

      var yamlDoc = yaml.safeDump(spec, {
        // skip undefined.
        skipInvalid: true
      })

      console.log('Writing spec to: ' + opts.outputFile);
      fs.writeFileSync(opts.outputFile, yamlDoc);
      console.log('Done!');
    });
  },
};


module.exports = z;

