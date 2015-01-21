/**
 * Generates a problem set spec.
 */
gpub.spec.problemSet = {
  /**
   * Process one movetree.
   */
  one: function(mt, alias, sgfObj, options) {
    region = options.region || glift.enums.boardRegions.AUTO;
    var widgetType = options.widgetType || null;
    if (mt.getTreeFromRoot().node().numChildren() === 0) {
      widgetType = 'EXAMPLE';
    }
    var baseSgfObj = glift.util.simpleClone(sgfObj);
    if (widgetType) {
      baseSgfObj.widgetType = widgetType;
    }
    if (!baseSgfObj.url) {
      baseSgfObj.alias = alias;
    }
    return baseSgfObj;
  }
};
