var gpub = require('../../index.js')
var ebook = require('./ebook.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = baseDir + '/problems';

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

var bookMaker = gpub.init({
    sgfs: contents,
    ids: ids,
    specOptions: {
      positionType: 'PROBLEM',
    },
    diagramOptions: {
      diagramType: 'SVG',
    }
  })
  .createSpec()
  .processSpec()
  .renderDiagrams()
  .bookMaker()

var files = ebook.create(bookMaker);
files.forEach(f => {
  if (f.path) {
    fs.writeFileSync(path.join(baseDir,  'epub-book', f.path), f.contents);
  }
});
