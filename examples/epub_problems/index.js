var gpub = require('../../index.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = path.join(baseDir, 'problems');

var fnames = gpub.preprocess.numberSuffixSort(gpub.preprocess.listSgfs(sgfDir));
var idmap = gpub.preprocess.idToContentsMap(fnames, sgfDir);
var ids = gpub.preprocess.createFileIds(fnames);

var out = gpub.create({
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

gpub.preprocess.writeBookFiles(path.join(baseDir, 'epub-book'), out.files);
