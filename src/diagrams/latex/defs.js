/**
 * Diagram label macros. For making Figure.1, Dia.1, etc.
 *
 * This is the basic style.  Used for games, primarily.
 * Defines:
 *  \gofigure: mainline variations.
 *  \godiagram: variation diagrams.
 */
gpub.diagrams.latex.diagramDefs = function(diagramPurpose) {
  // TODO(kashomon): Switch off of diagramPurpose.
  return [
    '% Mainline Diagrams. reset at parts',
    '\\newcounter{GoFigure}[part]',
    '\\newcommand{\\gofigure}{%',
    ' \\stepcounter{GoFigure}',
    ' \\centerline{\\textit{Figure.\\thinspace\\arabic{GoFigure}}}',
    '}',
    '% Variation Diagrams. reset at parts.',
    '\\newcounter{GoDiagram}[part]',
    '\\newcommand{\\godiagram}{%',
    ' \\stepcounter{GoDiagram}',
    ' \\centerline{\\textit{Diagram.\\thinspace\\arabic{GoDiagram}}}',
    '}',
    '\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
    ''].join('\n');
};
