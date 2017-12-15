/*
 * Command functions for parsing go files.
 */

var fs = require('fs');
var path = require('path');

var gpub = require('../index');
var gofiles = require('./files');

var parse = function(opts) {
  var files = opts.files || [];

  if (files.length === 0 && !opts.inputDir) {
    console.warning('No files: nothing to do');
    return;
  }

  var inDir = opts.inputDir;
  if (inDir) {
    console.log('parsing files from dir: ' + inDir);
    files = gofiles.listSgfs(inDir)
    files = files.map(f => path.join(inDir, f));
  }

  var outDir = opts.outputDir;
  console.log('Outputting to dir: ' + outDir)

  var outfiles = []
  for (var i = 0; i < files.length; i++) {
    var fin = files[i];
    (function(f) {
      var justName = path.basename(f);
      console.log('Reading:' + f);
      var contents = fs.readFile(f, 'utf8', function(err, data) {
        if (err) {
          console.log('Error reading file ' + f + ': ' + err)
          return
        }
        var ftype = opts.fileType;
        var mt;
        if (ftype) {
          var mt = gpub.glift.parse.fromString(data, ftype);
        } else {
          var mt = gpub.glift.parse.fromFileName(data, f);
        }
        var outName = justName.replace(/\.[^.]*$/, '.sgf')
        var outPath = path.join(outDir, outName);
        console.log('writing to ' + outPath);
        fs.writeFile(outPath, mt.toSgf());
      });
    })(fin);
  }
}

module.exports = {
  parse: parse,
};
