var fs = require('fs');
var path = require('path');

var createId = function(file) {
  return path.basename(file).replace(/\.sgf$/, '').replace('\.', '_');
};

// Extra convenince methods for running gpub.
module.exports = {
  /** List all the SGFs in a directory. */
  listSgfs: function(dir) {
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('sgf'));
  },
  /** Read all the SGF contents. */
  fileContents: function(fnames, dir) {
    return fnames
        .map(f => path.join(dir, f))
        .map(f => fs.readFileSync(f, 'utf8'));
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
    return fnames.map(f => createId(f))
  },
};
