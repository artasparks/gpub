
var z = {
  init: function(opts) {
    console.log('Initializing current directory');
    var crawl = opts.crawl;
    var crawlDir = opts.crawlDir;
    var bookType = opts.bookType;

    console.log('crawl: ' + crawl);
    console.log('crawl-dir: ' + crawlDir);
    console.log('book-type: ' + bookType);
  },
};


module.exports = z;

