var gpub = require('../../index.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = path.join(baseDir, 'problems');

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

var files = gpub.create({
  template: 'PROBLEM_EBOOK',
  sgfs: contents,
  ids: ids,
  specOptions: {
    positionType: 'PROBLEM',
  },
  diagramOptions: {
    diagramType: 'SVG',
  }
});

var seenDir = {};
var files = ebook.create(bookMaker);
files.forEach(f => {
  var fpath = path.join(baseDir, 'epub-book', f.path);
  var dir = path.dirname(fpath);
  if (!seenDir[dir]) {
    seenDir[dir] = true;
    gpub.nodeutils.createDirsSync(dir);
  }
  if (f.path) {
    fs.writeFileSync(fpath, f.contents);
  }
});
