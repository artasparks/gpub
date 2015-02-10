/**
 * Generates a problem set spec. Implements gpub.spec.processor.
 */
gpub.spec.problemSet = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.STANDARD_PROBLEM;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
    var outObj = {
      alias: alias,
      boardRegion: options.boardRegion
    };
    var widgetType = null;
    if (mt.getTreeFromRoot().node().numChildren() === 0) {
      // It may seem strange to use examples for problems, but this prevents
      // web-instances from trying to create a solution viewer and books from
      // creating answers. This is probably a hack, but it's not enough of one
      // to remove right now.
      if (widgetType) {
        outObj.widgetType = 'EXAMPLE';
      }
    }
    return [outObj];
  }
};
