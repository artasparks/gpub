gpub.gen.collection = {
  /**
   * Creates a Glift collection from
   *
   * sgfs: Array of SGFs.
   *
   * returns: a full options specification.
   */
  fromGames: function(sgfs) {
    // Array of SGF declarations.
    // Note: We must rely on SGF aliases to generate the collection.
    var spec = {
      // Since this is for a book definition, we don't need a divId. Clients
      // can add in a relevant ID later.
      divId: null,
      sgfCollection: [],
      sgfMapping: {}
    };
    var collection = [];
    for (var i = 0; sgfs && i < sgfs.length; i++) {
      var sgf = sgfs[i];
      var mt = glift.sgf.parse(sgf);
      var sgfName = mt.properties().getOneValue('GN') || 'sgf:' + i;

      // Create a cache entry.
      spec.sgfMapping[sgfName] = sgf;

      // Finally, process the sgf collection.
      spec.sgfCollection = spec.sgfCollection.concat(
          this.fromMovetree(mt, sgfName));
    }
    return spec;
  },

  /**
   * Convert a movetree to a SGF Collection.
   *
   * mt: A movetree from which we want to generate our SGF Collection.
   * alias: The name of this movetree / SGF instance. This is used to create the
   *    alias.
   */
  fromMovetree: function(mt, alias) {
    var boardRegions = glift.enums.boardRegions;
    var out = [];
    var varPathBuffer = [];
    var node = mt.node();
    while (node) {
      if (!mt.properties().getOneValue('C') && node.numChildren() > 0) {
        // Ignore positions don't have comments and aren't terminal.
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        var node = mt.node();
        varPathBuffer = varPathBuffer.concat(this.getVariationPaths(mt));
      } else {
        // This node has a comment or is terminal.  Process this node and all
        // the variations.
        var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
        out.push(this.createExample(
            alias, pathSpec.treepath, pathSpec.nextMoves));

        varPathBuffer = varPathBuffer.concat(this.getVariationPaths(mt));
        for (var i = 0; i < varPathBuffer.length; i++) {
          var path = varPathBuffer[i];
          var mtz = mt.getTreeFromRoot(path);
          var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
          out.push(this.createExample(
              alias, varPathSpec.treepath, varPathSpec.nextMoves));
        }
        varPathBuffer = [];
      }
      node = node.getChild(0); // Travel down
      mt.moveDown();
    }
    return out;
  },

  /**
   * Get an initial treepath to the point where we want to create a next-moves
   * path.
   */
  getVariationPaths: function(mt) {
    mt = mt.newTreeRef();
    var out = [];
    var node = mt.node();
    if (!node.getParent()) {
      // There shouldn't variations an the root, so just return.
      return out;
    }

    mt.moveUp();
    for (var i = 1; i < mt.node().numChildren(); i++) {
      var mtz = mt.newTreeRef();
      mtz.moveDown(i);
      mtz.recurse(function(nmtz) {
        if (!nmtz.properties().getOneValue('C')) {
          return; // Must have a comment to return the variation.
        }
        out.push(nmtz.treepathToHere());
      });
    }
    return out;
  },

  /**
   * Convert a movetree and a couple of options to an entry in the SGF
   * collection.
   * alias: Required. The cache alias.
   * initPos: Required. The init position
   * nextMoves: Required. Next m
   * region: not required. Defaults to ALL, but must be part of kkkkkkj
   */
  createExample: function(alias, initPos, nextMoves, region) {
    region = region || glift.enums.boardRegions.ALL;
    if (!glift.enums.boardRegions[region]) {
      throw new Error('Unknown board region: ' + region);
    }
    var treepathToString = glift.rules.treepath.toString;
    var base = {
      widgetType: 'EXAMPLE',
      alias: alias,
      initialPosition: treepathToString(initPos),
      nextMovesPath: treepathToString(nextMoves),
      boardRegion: region
    };
    return base;
  }
};
