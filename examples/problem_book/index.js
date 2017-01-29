var gpub = require('../../index.js')
var ebook = require('./ebook.js')

var fs = require('fs');

var baseDir = __dirname
var sgfDir = baseDir + '/problems';

var fnames = gpub.nodeutils.numberSuffixSort(gpub.nodeutils.listSgfs(sgfDir));
var contents = gpub.nodeutils.fileContents(fnames, sgfDir);
var ids = gpub.nodeutils.createFileIds(fnames);

/**
 * Simple function that transforms IDs into diagram filenames
 */
var idFuncMaker = (outDir) => {
  var base_ = baseDir;
  return (style, id, suffix) => {
    return base_ + '/' + style.toLowerCase() + '/gen_diagrams/' +
        id + '.out.' + suffix;
  }
};
var idFn = idFuncMaker(baseDir);

var allstyles = [
  'IGO',
  'GNOS',
  'SMARTGO',
  'SVG'
]

var g = gpub.init({
    sgfs: contents,
    ids: ids,
    specOptions: {
      positionType: 'PROBLEM',
    },
  })
  .createSpec()
  .processSpec();

allstyles.forEach(style => {
  var bookMaker = g.renderDiagramsStream(d => {
        fs.writeFile(idFn(style, d.id, d.extension), d.rendered)
      }, {
        diagramType: style,
      }).bookMaker();
});

  // fs.writeFileSync(
    // style.toLowerCase() + '/' + 'ggg_easy.tex',
    // book.render(style, bookMaker, idFn));
