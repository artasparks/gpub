gpub.spec.problemBook = {
  answerStyle: {
    /** No answers. */
    NONE: 'NONE',

    /** The answers go at the end of section */
    END_OF_SECTION: 'END_OF_SECTION',

    /** The answers go immediately after the page. */
    AFTER_PAGE : 'END_OF_SECTION'
  },

  /** Converts a problem set into a problem book. */
  fromProblemSet: function(spec) {
    // TODO(kashomon): Implement.
  },

  /**
   * buffer: gpub.util.Buffer, with an SGF obj.
   *
   * options:
   *  region: default region.
   *  answerStyle: See above.
   *  numAnswerVars : Defaults to 3. -1 means all variations. set to 0 if the
   *      answer style is NONE.
   */
  multi: function(buffer, opts) {
    var opts = opts || {};
    var answerStyle = opts.answerStyle ||
        gpub.spec.problemBook.answerStyle.END_OF_SECTION;
    var numAnswerVars = opts.numAnswerVars || 3;
    var problems = [];
    var answers = [];
    var region  = opts.region || glift.enums.boardRegions.AUTO;
    for (var i = 0; i < buffer.length; i++) {
      // We assume the problem begins at the beginning.
      var mt = buffer[i].movetree.newTreeRef();
      var name = buffer[i].name;
      var ex = gpub.spec.createExample(name, [], [], region, 'PROBLEM');
      problems.push(ex);

      var answerVars = gpub.spec.problemBook.variationPaths(mt, numAnswerVars);
      for (var j = 0; j < answerVars.length; j++) {
        var ans = gpub.spec.createExample(name, '', answerVars[j], region, 'ANSWER');
        answers.push(ans);
      }
    }
    return problems.concat(answers);
  },

  /** Create the answer-variation paths for a problem */
  variationPaths: function(mt, maxVars) {
    var out = [];
    if (maxVars === 0) {
      return out;
    }

    mt.recurseFromRoot(function(mtz) { 
      // TODO(kashomon): Support partial continuations
      // if (mtz.properties().getOneValue('C')) {
        // out.push(mtz.treepathToHere());
        // return;
      // }
      if (mtz.node().numChildren() === 0) {
        out.push(mtz.treepathToHere());
      }
    });
    if (maxVars < 0) {
      return out;
    } else {
      return out.slice(0, maxVars);
    }
  }
};
