var gpub = require('../../index.js')

var fs = require('fs');
var path = require('path');

var baseDir = __dirname
var sgfDir = path.join(baseDir, 'sgfs');

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

var out = gpub.create({
  template: 'MULTI_TYPE_EBOOK',
  sgfs: contents,
  ids: ids,
  diagramOptions: {
    diagramType: 'SVG',
  },
});

gpub.nodeutils.writeBookFiles(path.join(baseDir, 'multi-type-book'), out.files);
