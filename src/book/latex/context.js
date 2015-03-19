/**
 * Some basic LaTeX context definitions.
 */
gpub.book.latex.context = {
  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(str, purpose, comment, label, isMainLine, bookData) {
    comment = this.sanitize(comment);
    var camelCaseName = glift.enums.toCamelCase(purpose)
    var func = gpub.diagrams.latex[camelCaseName];
    switch(purpose) {
      case 'GAME_REVIEW':
      case 'GAME_REVIEW_CHAPTER':
        var baseLabel = isMainLine ? '\\gofigure' : '\\godiagram';
        if (label) {
          var splat = label.split('\n');
          for (var i = 0; i < splat.length; i++ ) {
            baseLabel += '\n\n\\subtext{' + splat[i] + '}';
          }
        }
        var label = baseLabel;
        break;
      default:
        // Do nothing.  This switch is for processing the incoming label.
    }
    return func(str, comment, label, bookData);
  },

  /**
   * Return a section intro.
   */
  sectionIntro: function(diagramString, comment, label, bookData) {
    var part = bookData.sectionTitle || '';
    var chapter = bookData.chapterTitle || '';
    return [
      '\\part{' + part + '}',
      '\\chapter{' + chapter + '}',
      comment
    ].join('\n');
  },

  /**
   * Generate a GAME_REVIEW diagram.
   *
   * diagramString: Literal string for the diagram
   * comment: Comment for diagram
   * label: Diagram label
   *
   * returns: filled-in latex string.
   */
  gameReview: function(diagramString, comment, label) {
    return [
      '',
      '\\rule{\\textwidth}{0.5pt}',
      '',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      diagramString,
      label,
      '\\end{minipage}',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      '\\setlength{\\parskip}{0.5em}',
      comment,
      '\\end{minipage}',
      '\\vfill'].join('\n');
  },

  /**
   * Generate a Game Review Chapter Diagram.
   */
  gameReviewChapter: function(diagramString, comment, label, bookdata) {
    return [
      '\\chapter{' + bookdata.chapterTitle + '}',
      '{\\centering',
      diagramString,
      '}',
      label,
      '',
      comment,
      '\\vfill'].join('\n');
  },

  problem: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
  },

  answer: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
  }
};
