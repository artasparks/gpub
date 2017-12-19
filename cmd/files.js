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
var walk = function(dir, filter, done) {
  if (!dir) {
    throw new Error('Directory must be defined. was ' + dir)
  }
  if (!filter) {
    throw new Error('Filter must be defined. was ' + filter)
  }
  var walker = function(dir, filter, results, done) {
    fs.readdir(dir, function(err, list) {
      console.log(list);
      if (err) {
        throw new Error('Error reading files: '  + err);
      }
      if (!list.length) {
        return;
      }
      for (var i = 0; i < list.length; i++) {
        var file = list[i];
        if (!file) {
          // Is this realistic?
          continue;
        }
        var absfile = path.join(dir, file);
        if (filter(absfile)) {
          results.push(absfile);
        } else {
        }
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, filter, [], function(newres) {
              results = results.concat(newres);
            })
          }
        });
      }
      done(results);
    });
  }
  walker(dir, filter, [], done)
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
      var anum = parseInt(/\d+/g.exec(a), 10)
      var bnum = parseInt(/\d+/g.exec(b), 10)
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
