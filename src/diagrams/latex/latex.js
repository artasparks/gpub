/**
 * Some basic LaTeX definitions. This should perhaps be its own directory, once
 * more styles are added.
 */
gpub.diagrams.latex = {
  /**
   * Sanitizes latex input. This isn't particularly robust, but it is meant to
   * protect us against accidental characters.
   */
  sanitize: function(text) {
    return text.replace(/[$#}{]/g, function(match) {
      return '\\' + match;
    });
  },

  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(str, purpose, comment, label, isMainLine, bookData) {
    comment = this.sanitize(comment);

    var camelCaseName = glift.enums.toCamelCase(purpose)
    var func = gpub.diagrams.latex[camelCaseName];
    switch(purpose) {
      case 'GAME_REVIEW':
        var baseLabel = isMainLine ? '\\gofigure' : '\\godiagram';
        if (label) {
          baseLabel += '\n\n \\subtext{' + label + '}';
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
    var chapter = bookData.chapterTitle || 'Chapter';
    return [
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
  gameReviewChapter: function(diagramString, comment, label, title) {
    return [
      '\\chapter{' + title + '}',
      '{\\centering',
      diagramString,
      '}',
      label,
      '',
      comment,
      '\\vfill'].join('\n');
  }
};
