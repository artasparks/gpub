goog.provide('gpub.diagrams.gooe.init');

/**
 * Initialization necessary for various output formats.
 */
gpub.diagrams.gooe.init = {
  LATEX: function() {
    return '\\usepackage{gooemacs}\n \\\\\n' +
      gpub.diagrams.gooe.init.extraDefs();
  },

  /**
   * Some built in defs that are useful for generating LaTeX books using Gooe
   * fonts.
   */
  defs: {
    sizeDefs: '% Size definitions\n' +
      '\\newdimen\\bigRaise\n' +
      '\\bigRaise=4.3pt\n' +
      '\\newdimen\\smallRaise\n' +
      '\\smallRaise=3.5pt\n' +
      '\\newdimen\\inlineRaise\n' +
      '\\inlineRaise=3.5pt\n',

    bigBoardDefs: '% Big-sized board defs' +
      '\\def\\eLblBig#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\bigRaise\\hbox{\\tenpointeleven{#1}}\\hss}}\n' +
      '\\def\\goWsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\tenpointeleven{#1}\\hss}}\n' +
      '\\def\\goBsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\color{white}\\tenpointeleven{#1}\\color{white}\\hss}}\n',

    normalBoardDefs: '% Normal-sized board defs' +
      '\\def\\eLbl#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\smallRaise\\hbox{\\tenpoint{#1}}\\hss}}\n' +
      '\\def\\goWsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\eightpointnine{#1}\\hss}}\n' +
      '\\def\\goBsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\color{white}\\eightpointnine{#1}\\color{white}\\hss}}\n',
  },

  /**
   * Generates the LaTeX document headers as a string.
   *
   * Takes a base font family. Defaults to cmss (computer modern sans serif).
   * @param {string=} opt_baseFont
   * @return {string} the latex init defs.
   */
  extraDefs: function(opt_baseFont) {
    var baseFont = opt_baseFont || 'cmss';
    var defs = gpub.diagrams.gooe.init.defs;
    var fontDefsBase =
      '% Gooe font definitions\n' +
      '\\font\\tenpoint=' + baseFont + '10\n' +
      '\\font\\tenpointeleven=' + baseFont + '10 at 11pt\n' +
      '\\font\\eightpoint=' + baseFont + '8\n' +
      '\\font\\eightpointnine=' + baseFont + '8 at 9pt\n';
    return fontDefsBase +
      defs.sizeDefs +
      defs.bigBoardDefs +
      defs.normalBoardDefs;
  }
};
