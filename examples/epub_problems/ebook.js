var gpub = require('../../index.js')

var create = function(bookMaker) {
  var epub = gpub.book.epub;

  var contentFile = 'chap1.html';
  var contents = epub.contentDocHeader();

  return [];
};

module.exports = {
  create: create
}
