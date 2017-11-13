/*
 * Command functions for parsing go files.
 */

var fs = require('fs');
var path = require('path');

var gpub = require('../index');
var gofiles = require('./files');

var parse = function(opts) {
  var files = opts.files || [];

  if (files.length === 0 && !opts.input_dir) {
    console.warning('No files: nothing to do');
    return;
  }

  var inDir = opts.input_dir;
  if (inDir) {
    console.log('parsing files from dir: ' + inDir);
    files = gofiles.listSgfs(inDir)
    files = files.map(f => path.join(inDir, f));
  }

  if (opts.file_type && !gpub.glift.parse.parseType[opts.file_type]) {
    console.error('File type ' + opts.file_type + ' not known!')
    return
  }

  var outDir = opts.output_dir;
  console.log('Outputting to dir: ' + outDir)

  var outfiles = []
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var justName = path.basename(f);

    var contents = fs.readFile(f, 'utf8', function(err, data) {
      if (err) {
        console.log('Error reading file ' + f + ': ' + err)
        return
      }
      var ftype = opts.file_type;
      var mt;
      if (ftype) {
        var mt = gpub.glift.parse.fromString(data, ftype);
      } else {
        var mt = gpub.glift.parse.fromFileName(data, f);
      }
      var outName = justName.replace(/\.[^.]*$/, '.sgf')
      var outPath = path.join(outDir, outName);
      fs.writeFile(outPath, mt.toSgf());
    });
  }
}

module.exports = {
  parse: parse,
};
