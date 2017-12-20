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
    // filter SGFs
    var filter = (f) => {
      return /.*\.sgf$/.test(f);
    };
    // Ignore dot files
    var ignore = (f) => {
      return /^\..*/.test(f);
    };

    files.walk(opts.crawlDir, filter, ignore, (results) => {
      var sorted = files.numberSuffixSort(results);
      console.log(sorted);
    });
  },
};


module.exports = z;

