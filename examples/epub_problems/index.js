var gpub = require('../../index.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = path.join(baseDir, 'problems');

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var idmap = gpub.nodeutils.idToContentsMap(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

var out = gpub.create({
  template: 'PROBLEM_EBOOK',
  sgfs: idmap,
  grouping: ids,
  ids: ids,
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

gpub.nodeutils.writeBookFiles(path.join(baseDir, 'epub-book'), out.files);
