/**
 * Some basic LaTeX context definitions.
 */
gpub.book.latex.context = {
  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(diagramType, diagram, ctx, flattened) {
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

    return renderer(diagram, ctx, processedComment, processedLabel);
  },

  /** Process the label to make it appropriate for LaTeX. */
  _processLabel: function(diagramType, label, ctx, flattened) {
    var baseLabel = flattened.isOnMainPath() ? '\\gofigure' : '\\govariation';
    if (label) {
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
    EXAMPLE: function(diagram, ctx, pcomment, label) {
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
          '\\begin{minipage}[t]{0.5\\textwidth}',
          diagram,
          label,
          '\\end{minipage}',
          '\\begin{minipage}[t]{0.5\\textwidth}',
          '\\setlength{\\parskip}{0.5em}',
          pcomment.text,
          '\\end{minipage}',
          '\\vfill'].join('\n');
      }
    },

    DESCRIPTION: function(diagram, ctx, pcomment, label) {
      return [
        pcomment.preamble,
        pcomment.text,
        '\\vfill'
      ].join('\n');
    },

    PROBLEM: function(diagram, ctx, pcomment, label) {
      // TODO(kashomon): implement.
    }
  }
};
