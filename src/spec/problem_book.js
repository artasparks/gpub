/**
 * A gpub spec processor for problem meant to go into books. I expect that this
 * will be used as a just-in-time processor during book generation.
 */
gpub.spec.problemBook = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.EXAMPLE;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
  },

  processProblemDef: function(mt, alias, options) {
  },

  processCorrect: function(mt, alias, options) {
  },

  processIncorrect: function(mt, alias, options) {
  }
};
