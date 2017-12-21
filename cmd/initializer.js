const files = require('./files.js')

var z = {
  init: function(opts) {
    console.log('Initializing current directory');
    var crawl = opts.crawl;
    var crawlDir = opts.crawlDir;
    var bookType = opts.bookType;

    console.log('crawl: ' + crawl);
    console.log('crawl-dir: ' + crawlDir);
    console.log('book-type: ' + bookType);

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
      var idmap = files.idToContentsMap(fnames, sgfDir);
      var ids = iles.createFileIds(fnames);

      var api = gpub.init({
        template: 'PROBLEM_EBOOK',
        sgfs: idmap,
        grouping: ids,
        specOptions: {
          positionType: 'PROBLEM',
        },
        diagramOptions: {
          diagramType: 'SVG',
        },
        templateOptions: {
          chapterSize: 25,
        }
      });
    });
  },
};


module.exports = z;

