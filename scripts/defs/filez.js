#!/usr/bin/env node

var fs = require('fs');
var path = require('path')
var glift = require('./glift')

var sgfRegex = /.*\.sgf$/;

/**
 * Returns
 *  {
 *    collection: <glift collection (array)>
 *    contents: {
 *      <filename> : contents
 *    }
 *  }
 */
var readFromDirAndArgs = function(dir, args, collectionFile, filter) {
  var filter = filter || '.*';
  var filterType = typeof filter;
  if (filter && filterType === 'string') {
    filter = new RegExp(filter);
  }

  if (collectionFile && dir) {
    console.error('Collection file and directory cannot both be specified');
    process.exit(1);
  }

  var def = {
    collection: [],
    contents: {}
  };

  var fnames = [];

  if (dir) {
    var tmpfnames = fs.readdirSync(dir);
    for (var i = 0; i < tmpfnames.length; i++) {
      if (filter.test(tmpfnames[i])) {
        fnames.push(path.join(dir, tmpfnames[i]));
      }
    }
  }

  var sgfCollection = null;
  var collectionDir = null;
  if (collectionFile) {
    var coll = JSON.parse(fs.readFileSync(collectionFile, {encoding: 'utf8'}));
    var collectionDir = path.dirname(collectionFile);
    for (var i = 0; i < coll.length; i++) {
      var item = coll[i];
      if (typeof item === 'object') {
        fnames.push(item.url);
      } else {
        fnames.push(item);
      }
    }
    sgfCollection = coll;
  }

  // Fallback to processing args.
  if (!dir && !collectionFile && args) {
    for (var i = 0; i < args.length; i++) {
      var f = args[i];
      if (f && filter.test(f)) {
        fnames.push(args[i]);
      }
    }
  }

  for (var i = 0; i < fnames.length; i++) {
    var fname = fnames[i];
    var fnamePath = fname;
    if (collectionDir) {
      fnamePath = path.join(collectionDir, fname);
    }
    def.contents[fname] =
        fs.readFileSync(fnamePath, {encoding: 'utf8'});
  }

  def.collection = glift.widgets.options.setOptionDefaults({
    sgfCollection: sgfCollection || fnames
  }).sgfCollection;

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
