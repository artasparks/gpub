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
   * ref: Reference for using in the diagram for hyperlinking
   */
  typeset: function(
      diagramType,
      diagram,
      ctx,
      flattened,
      intSize,
      pageSize,
      ref) {
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

    var latexLabel = gpub.book.latex.context._createLatexLabel(ctx, flattened, ref);

    var processedLabel = gpub.book.latex.context._processLabel(
        diagramType, label, ctx, flattened, ref);

    var renderer = gpub.book.latex.context.rendering[ctx.contextType];
    if (!renderer) {
      // Should this check be removed? Why do we need it?
      renderer = gpub.book.latex.context.rendering[DESCRIPTION];
    }
    if (!intSize) {
      throw new Error('Intersection size in points not defined. Was' +
          intSize);
    }

    // Add in debug info to the comment-text.
    processedComment.text = processedComment.text +
        gpub.book.latex.context._debugInfo(ctx.debug);

    return renderer(
        diagram, ctx, processedComment, processedLabel, intSize, pageSize,
        latexLabel);
  },

  /** Create a latex label for cross-referencing */
  _createLatexLabel: function(ctx, flattened, ref) {
    if (flattened.isOnMainPath() && ref) {
      return '\\phantomsection\n\\label{' + ref + '}';
    }
    return '';
  },

  _debugInfo: function(debug) {
    if (!gpub.global.debug) {
      return '';
    }
    var base = [
        '', // for extra spacing between original comment.
        '{\\scriptsize']
    if (debug.initialPosition) {
      base.push('ip:'+debug.initialPosition);
    }

    base.push('}');
    return base.join('\n');
  },

  /** Process the label to make it appropriate for LaTeX. */
  _processLabel: function(diagramType, label, ctx, flattened, ref) {
    var baseLabel = '\\gofigure';
    var mainMove = flattened.mainlineMove();
    // TODO(kashomon): Why would the mainMove be null? In anycase, if this is
    // not here, we occasionally get errors.
    if (!flattened.isOnMainPath() && mainMove !== null) {
      // We're on a variation. Add a comment below the diagram and create a
      // reference label.
      baseLabel = '';
      baseLabel = '\\centerline{\\govariation'
      var mainMoveNum = flattened.mainlineMoveNum();
      var readableColor = null;
      if (mainMove.color === 'BLACK') {
        readableColor = 'Black'
      } else {
        readableColor = 'White'
      }
      if (mainMove) {
        if (ref) {
          baseLabel += '\\hyperref[' + ref + ']{'
        }
        baseLabel += '\\textit{from} '
        baseLabel += readableColor + ' ' + mainMoveNum + '';
        // if (ref) {
          // baseLabel += '\\ref*{' + ref  + '}}'
        // }
        baseLabel += '}';
      }
      baseLabel += '}';
    }
    if (label) {
      // Convert newlines into latex-y newlines
      var splat = label.split('\n');
      for (var i = 0; i < splat.length; i++ ) {
        if (i == 0) {
          baseLabel += '\n\\subtext{' + splat[i] + '}';
        } else {
          baseLabel += '\n\n\\subtext{' + splat[i] + '}';
        }
      }
    }
    baseLabel = gpub.diagrams.renderInline(diagramType, baseLabel);
    return baseLabel;
  },

  /** Render the specific digaram context. */
  rendering: {

    EXAMPLE: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
      if (!pageSize) {
        throw new Error('Page size must be defined. Was:' + pageSize);
      }
      var widthPt = gpub.book.page.inToPt(pageSize.widthIn);
      var debug = this.renderDebug
      if (pcomment.preamble) {
        return [
          pcomment.preamble,
          latexLabel,
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
          latexLabel,
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

    DESCRIPTION: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
      return [
        pcomment.preamble,
        pcomment.text,
        '\\vfill'
      ].join('\n');
    },

    PROBLEM: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
      // TODO(kashomon): implement.
    }
  }
};
