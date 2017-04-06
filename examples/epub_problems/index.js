var gpub = require('../../index.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = path.join(baseDir, 'problems');

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

var out = gpub.create({
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

gpub.nodeutils.writeBookFiles(path.join(baseDir, 'epub-book'), out.files);
