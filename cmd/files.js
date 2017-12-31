/*
 * Utilities for processing go files.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml')

const gpub = require('../index');

const createId_ = function(file) {
  return path.basename(file).replace(/\.sgf$/, '').replace('\.', '_');
};

const jsonRegex = /\.sgf$/;
const yamlRegex = /\.yaml$/;

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

/**
 * Walk a directory looking for things.
 * This thing is pretty overy designed, but it was fun to play around with it.
 */
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


/**
 * Walk a directory looking for things.
 * This thing is pretty overy designed, but it was fun to play around with it.
 */
var walkSync = function(dir, filter, ignore) {
  if (!dir) {
    throw new Error('Directory must be defined. was ' + dir)
  }
  if (!filter) {
    throw new Error('Filter must be defined. was ' + filter)
  }
  var outFiles = [];

  var walker = function(dir) {
    var results = fs.readdirSync(dir);
    if (!results.length) {
      return;
    }
    for (var i = 0; i < results.length; i++) {
      var f = results[i];
      if (f === undefined) {
        continue
      }
      if (ignore(f)) {
        continue
      }
      var absfile = path.join(dir, f);
      if (filter(absfile)) {
        outFiles.push(absfile);
      }

      var stat = fs.statSync(absfile);
      if (stat && stat.isDirectory()) {
        walker(absfile);
      }
    };
  };
  walker(dir);
  return outFiles;
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

  /** Walk the file system for files synchronously. */
  walkSync: walkSync,

  /** Read all the SGF contents. */
  fileContents: function(fnames, dir) {
    return fnames
        .map(f => path.join(dir, f))
        .map(f => fs.readFileSync(f, 'utf8'));
  },

  /**
   * Takes a list of file names and makes a map of ID to contents of that file.
   * Directory [dir] is optional. If specified, the file names are prepended
   * with the directory path.
   */
  idToContentsMap: function(names, dir) {
    var out = {};
    names
        .map(f => {
          if (dir) {
            return path.join(dir, f)
          }
          return f
        })
        .forEach(f => {
          var fkey = createId_(f);
          out[fkey] = fs.readFileSync(f, 'utf8');
        });
    return out;
  },


  /**
   * Takes a list of file names and makes a map of ID to contents of that file.
   * Directory [dir] is optional. If specified, the file names are prepended
   * with the directory path.
   */
  idToFileMap: function(names, dir) {
    var out = {};
    names
        .map(f => {
          if (dir) {
            return path.join(dir, f)
          }
          return f
        })
        .forEach(f => {
          out[createId_(f)] = f;
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
  },

  /**
   * Parses a GPub spec: could be either JSON or Yaml. Optionally can override
   * the filetype with ftype parameter.
   *
   * output format: {
   *   spec: <spec>,
   *   idFileMap: Object<string, string>,
   * }
   */
  readAndParseSpec: function(file, ftype) {
    var contents = fs.readFileSync(file, 'utf8');
    var out = {
      spec: {},
      idFileMap: {},
    };
    if (jsonRegex.test(file) || ftype === 'JSON') {
      out.spec = JSON.parse(contents);
    } else if (yamlRegex.test(file) || ftype === 'YAML') {
      out.spec = yaml.safeLoad(contents);
    } else {
      throw new Error('File-type of ' + file + ' could not be ascertained ' +
          'to be either JSON or YAML. Aborting');
    }

    // Now, we must convert all the files into actual strings
    var idFileMap = {};
    for (var id in out.spec.sgfMapping) {
      var file = out.spec.sgfMapping[id];
      out.idFileMap[id] = file;
      out.spec.sgfMapping[id] = fs.readFileSync(file, 'utf8');
    }
    return out;
  },

  /**
   * Write the spec-file, taking into account the file type.
   */
  writeSpec: function(outFile, spec, idFileMap, ftype) {
    var outFileExt = path.extname(outFile);
    var outFileBase = path.basename(outFile, outFileExt);
    var outDir = path.dirname(outFile);
    var newFileMap = {};

    for (var id in idFileMap) {
      var file = idFileMap[id];
      var dir = path.dirname(file);
      // Make sure the files
      newFileMap[id] = path.join(path.relative(outDir, dir), path.basename(file))
    }

    spec.sgfMapping = newFileMap;

    var outDoc = '';
    var docExt = '.yaml';
    var processJson = function() {
      outDoc = JSON.stringify(spec);
      docExt = '.json';
    };
    var processYaml = function() {
      outDoc = yaml.safeDump(spec, {
        // skip undefined.
        skipInvalid: true
      });
      docExt = '.yaml';
    }

    if (ftype === 'JSON') {
      processJson();
    } else if (ftype === 'YAML') {
      processYaml();
    } else if (outFileExt === '.json') {
      processJson();
    } else if (outFileExt === '.yaml') {
      processYaml();
    } else {
      // Default condition
      processYaml();
    }

    var finalOutFile = path.join(outDir, outFileBase) + docExt;

    console.log('Writing spec to: ' + finalOutFile);
    fs.writeFileSync(finalOutFile, outDoc);

    // TODO(kashomon): Add this by stealing the logic from the processor
  }
};
