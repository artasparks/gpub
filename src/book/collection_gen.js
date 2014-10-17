gpub.book.collection = {
  /**
   * Creates a Glift collection from
   *
   * sgfs: Array of SGFs.
   */
  fromSgfs: function(sgfs) {
    // Array of SGF declarations.
    // Note: We must rely on SGF aliases to generate the collection.
    var collection = [];
    for (var i = 0; sgfs && i < sgfs.length; i++) {
      collection.concat(this.fromSingleGame(sgfs[i]));
    }
    return collection;
  },

  fromSingleSgf: function(sgf) {
    var sgf = sgfs[i];
    var mt = glift.sgf.parse(sgf);
    var varPathBuffer = [];
    do {
      if (!mt.properties().contains('C') ||
          !mt.properties().getOneValue('C')) {
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        var node = mt.node();
        if (node.getParent() && node.getParent().numChildren() > 0) {
          mt.moveUp();
          var pathToHere = mt.treepathToHere();
          for (var i = 1; i < node.getParent().numChildren(); i++) {
            var newArr = pathToHere.slice(0);
            newArr.push(i);
            varPathBuffer.push(i);
          }
        }
        continue;
      }
      if (mt.node().numChildren() > 0) {
        mt.moveDown();
      }
    } while (mt.node().numChildren() > 0);
  },

  fromCurrentPosition: function(mt) {
  }
};
