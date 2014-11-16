#!/usr/bin/env node

var fs = require('fs');
var path = require('path')

var sgfRegex = /.*\.sgf$/;

/**
 * Returns
 * {
 *  fnames: [],
 *  contents: []
 * }
 */
var readFromDirAndArgs = function(dir, args, filter) {
  var filter = filter || '.*';
  var filterType = typeof filter;
  if (filter && filterType === 'string') {
    filter = new RegExp(filter);
  }
  var def = {
    fnames: [],
    contents: []
  };

  if (dir) {
    var tmpfnames = fs.readdirSync(dir);
    for (var i = 0; i < tmpfnames.length; i++) {
      if (filter.test(tmpfnames[i])) {
        def.fnames.push(path.join(dir, tmpfnames[i]));
      }
    }
  }
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var f = args[i];
      if (f && filter.test(f)) {
        def.fnames.push(args[i]);
      }
    }
  }

  for (var i = 0; i < def.fnames.length; i++) {
    def.contents.push(fs.readFileSync(def.fnames[i], {encoding: 'utf8'}));
  }

  if (def.contents.length !== def.fnames.length) {
    throw new Error('Contents.length !== Filenames.length');
  }
  return def;
};

var writeSgf = function(originalFileName, contents) {
  var outFileName = null;
  if (sgfRegex.test(originalFileName)) {
    var outFileName = originalFileName.replace(/\..*$/, '.out.sgf');
  } else {
    var outFileName = originalFileName.replace(/\..*$/, '.sgf');
  }
  outFileName && fs.writeFileSync(outFileName, contents);
}

exports.readFromDirAndArgs = readFromDirAndArgs;
exports.sgfRegex = sgfRegex;
exports.writeSgf = writeSgf;
