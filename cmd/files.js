/*
 * Utilities for processing go files.
 */

var fs = require('fs');
var path = require('path');
var gpub = require('../index');

var createId_ = function(file) {
  return path.basename(file).replace(/\.sgf$/, '').replace('\.', '_');
};

/**
 * Create all the intermediate dirs for a path. Expects a top-level dirname.
 */
var createDirsSync = function(dirname) {
  if (!dirname) {
    return;
  }
  if (fs.existsSync(dirname)) {
    return;
  }
  var parts = dirname.split(path.sep);
  var p = parts[0];
  if (path.isAbsolute(dirname)) {
    p = path.join('/', p);
  }
  for (var i = 1; i < parts.length; i++) {
    var p = path.join(p, parts[i]);
    try {
      fs.mkdirSync(p);
    } catch(e) {
      if (e.code != 'EEXIST') throw e;
    }
  }
};

/** Walk a directory looking for things. */
var walk = function(dir, filter, ignore, done) {
  if (!dir) {
    throw new Error('Directory must be defined. was ' + dir)
  }
  if (!filter) {
    throw new Error('Filter must be defined. was ' + filter)
  }
  var walker = function(dir, cb) {
    fs.readdir(dir, function(err, list) {
      var results = [];
      if (err) {
        throw new Error('Error reading files: '  + err);
      }
      if (!list.length) {
        return;
      }
      var next = function(index) {
        if (index >= list.length) {
          cb(results);
          return
        }
        var f = list[index];
        if (f === undefined) {
          cb(results);
          return
        }
        if (ignore(f)) {
          next(index+1);
          return
        }
        var absfile = path.join(dir, f);
        if (filter(absfile)) {
          results.push(absfile);
        }
        fs.stat(absfile, (err, stat) => {
          if (stat && stat.isDirectory()) {
            walker(absfile, (newres) => {
              results = results.concat(newres);
              next(index+1);
            });
          } else {
            next(index+1);
          }
        });
      };
      next(0);
    });
  }
  walker(dir, done);
};

// Extra convenince methods for running gpub.
module.exports = {
  /** List all the SGFs in a directory. */
  listSgfs: function(dir) {
    return fs.readdirSync(dir)
        .filter(f => gpub.glift.parse.knownGoFile(f));
  },

  /** Walk the file system for files. */
  walk: walk,

  /** Read all the SGF contents. */
  fileContents: function(fnames, dir) {
    return fnames
        .map(f => path.join(dir, f))
        .map(f => fs.readFileSync(f, 'utf8'));
  },

  /**
   * Takes a list of file names and makes a map of ID to contents of that file.
   */
  idToContentsMap: function(names, dir) {
    var out = {};
    names
        .map(f => path.join(dir, f))
        .forEach(f => {
          var fkey = createId_(f);
          out[fkey] = fs.readFileSync(f, 'utf8');
        });
    return out;
  },

  /** Sort problems based on a number-suffix. */
  numberSuffixSort: function(files) {
    files.sort((a, b) => {
      var aMatch = /(\d+)\.[a-z]+$/.exec(a)
      var bMatch = /(\d+)\.[a-z]+$/.exec(b)
      if (!aMatch || !bMatch) {
        return 0;
      }
      if (aMatch.length < 2 || bMatch.length < 2) {
        return 0;
      }
      var anum = parseInt(aMatch[0], 10)
      var bnum = parseInt(bMatch[0], 10)
      if (anum < bnum) {
        return -1;
      } else if (anum > bnum) {
        return 1;
      }
      return 0;
    });
    return files;
  },

  /** Create IDs from filenames for a list of SGFs */
  createFileIds: function(fnames) {
    return fnames.map(f => createId_(f))
  },

  /** Create ID form filename */
  createId: createId_,

  /** Create intermediate dirs */
  createDirsSync: createDirsSync,

  /** Writes BookFiles {files} to {dir}, creating dirs where necessary */
  writeBookFiles: function(dir, files) {
    var seenDir = {};
    files.forEach(f => {
      var fpath = path.join(dir, f.path);
      var subdir = path.dirname(fpath);
      if (!seenDir[subdir]) {
        seenDir[subdir] = true;
        createDirsSync(subdir);
      }
      if (f.path) {
        fs.writeFileSync(fpath, f.contents);
      }
    });
  }
};
