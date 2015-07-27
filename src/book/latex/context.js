/**
 * Some basic LaTeX context definitions.
 */
gpub.book.latex.context = {
  /**
   * Typeset the diagram into LaTeX. This expects the diagrams to have already
   * been rendered. These methods are meant to provide page context.
   *
   * diagramType: member of gpub.diagrams.diagramType
   * diagram: The core diagram string. Needs to already have been rendered. This
   * ctx: Context object.
   *    {contextType: <gpub.book.contextType>, isChapter: <boolean>}
   * flattened: The flattened diagram object from Glift.
   *    Note: it seems a little weird to pass in the diagram and the flattened
   *    obj, since the flattened obj can regenerate the diagram. Probably should
   *    be rectified at some point.
   * intSize: Size of an intersection in Point. (1/72 of an inch)
   * pageSize: size of the page (see gpub.book.page.size).
   */
  typeset: function(
      diagramType,
      diagram,
      ctx,
      flattened,
      intSize,
      pageSize) {
    comment = flattened.comment() || '';
    label = gpub.diagrams.createLabel(flattened);

    // Render the markdown. Note: This splits the comment into a
    //  .preamble -- the header
    //  .text -- the main body of the text.
    var processedComment = comment ? gpub.book.latex.renderMarkdown(comment) : {
      preamble: '',
      text: ''
    };

    processedComment.text = gpub.diagrams.renderInline(
        diagramType, processedComment.text);

    var processedLabel = gpub.book.latex.context._processLabel(
        diagramType, label, ctx, flattened);

    var renderer = gpub.book.latex.context.rendering[ctx.contextType];
    if (!renderer) {
      renderer = gpub.book.latex.context.rendering[DESCRIPTION];
    }
    if (!intSize) {
      throw new Error('Intersection size in points not defined. Was' +
          intSize);
    }

    return renderer(
        diagram, ctx, processedComment, processedLabel, intSize, pageSize);
  },

  /** Process the label to make it appropriate for LaTeX. */
  _processLabel: function(diagramType, label, ctx, flattened) {
    var baseLabel = '\\gofigure';
    var mainMove = flattened.mainlineMove();
    // TODO(kashomon): Why would the mainMove be null? In anycase, if this is
    // not here, we occasionally get errors.
    if (!flattened.isOnMainPath() && mainMove !== null) {
      // We're on a variation. Add a comment below the diagram and create a
      // reference label.
      baseLabel = '\\govariation'
      var mainMoveNum = flattened.mainlineMoveNum();
      var readableColor = null;
      if (mainMove.color === 'BLACK') {
        readableColor = 'Black'
      } else {
        readableColor = 'White'
      }
      if (mainMove) {
        baseLabel += '[ from ' + readableColor + ' ' + mainMoveNum + ']';
      }
    }
    if (label) {
      // Convert newlines into latex-y newlines
      var splat = label.split('\n');
      for (var i = 0; i < splat.length; i++ ) {
        baseLabel += '\n\n\\subtext{' + splat[i] + '}';
      }
    }
    baseLabel = gpub.diagrams.renderInline(diagramType, baseLabel);
    return baseLabel;
  },

  /** Render the specific digaram context. */
  rendering: {
    EXAMPLE: function(diagram, ctx, pcomment, label, pts, pageSize) {
      if (!pageSize) {
        throw new Error('Page size must be defined. Was:' + pageSize);
      }
      var widthPt = gpub.book.page.inToPt(pageSize.widthIn);
      if (pcomment.preamble) {
        return [
          pcomment.preamble,
          '{\\centering',
          diagram,
          '}',
          label,
          '',
          pcomment.text,
          '\\vfill'].join('\n');
      } else {
        return [
          '',
          '\\rule{\\textwidth}{0.5pt}',
          '',
          '\\begin{minipage}[t]{' + 20*pts + 'pt}',
          diagram,
          label,
          '\\end{minipage}',
          '\\begin{minipage}[t]{' + (0.85*widthPt - 21*pts) +'pt}',
          '\\setlength{\\parskip}{0.5em}',
          pcomment.text,
          '\\end{minipage}',
          '\\vfill'].join('\n');
      }
    },

    DESCRIPTION: function(diagram, ctx, pcomment, label, pts) {
      return [
        pcomment.preamble,
        pcomment.text,
        '\\vfill'
      ].join('\n');
    },

    PROBLEM: function(diagram, ctx, pcomment, label, pts) {
      // TODO(kashomon): implement.
    }
  }
};
