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
    files.walk(opts.crawlDir, (f) => f.endsWith('.sgf'), (results) => {
      console.log(results);
    });
  },
};


module.exports = z;

