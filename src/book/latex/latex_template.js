gpub.book.latex.defaultTemplate = [
'{{=<% %>=}}', // Change the tag-type to ERB
'\\documentclass[letterpaper,12pt]{memoir}',
'\\usepackage{color}',
'\\usepackage{wrapfig}',
'\\usepackage{setspace}',
'\\usepackage{graphicx}',
'\\usepackage[margin=1in]{geometry}',

'%%% Define any extra packages %%%',
'<%init%>',
'<%={{ }}=%>', // Change it back for testing

'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',

'%%% Diagram Figure defs.',
'% Must expose two commands',
'%  \\gofigure  (mainline diagrams)',
'%  \\godiagram (variation diagrams)',
'% Mainline Diagrams. reset at parts',
'\\newcounter{GoFigure}[part]',
'',
'\\newcommand{\\gofigure}{%',
' \\stepcounter{GoFigure}',
' \\centerline{\\textit{Diagram.\\thinspace\\arabic{GoFigure}}}',
'}',

'% Variation Diagrams. reset at parts.',
'\\newcounter{GoVariation}[part]',
'',
'\\newcommand{\\govariation}[1][]{%',
' \\stepcounter{GoVariation}',
' \\centerline{\\textit{Variation.\\thinspace\\arabic{GoVariation}#1}}',
'}',
'',
'\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
'',

'%%% Define the main title %%%',
'\\definecolor{light-gray}{gray}{0.55}',
'\\newcommand*{\\mainBookTitle}{\\begingroup',
'  \\raggedleft',
'  {{#authors}}',
'     {\\Large {{.}} } \\\\',
'     \\vspace*{1 em}',
'  {{/authors}}',
'  \\vspace*{5 em}',
'  {\\textcolor{light-gray}{\\Huge {{title}} }}\\\\',
'  \\vspace*{\\baselineskip}',
'  {{#subtitle}}',
'  {\\small \\bfseries {{subtitle}} }\\par',
'  {{/subtitle}}',
'  \\vfill',
'  {{#publisher}}',
'  {\\Large {{publisher}} }\\par',
'  \\vspace*{2\\baselineskip}',
'  {{/publisher}}',
'\\endgroup}',

' %%% Chapter settings %%%',
//'\\pagestyle{empty}',
//'\\chapterstyle{section}', -- the old style
//'\\chapterstyle{demo2}', -- 2 hrules
// other options for chapter styles:
// bringhurst,crosshead,default,dowding,memman,komalike,ntglike,tandh,wilsondob
'\\chapterstyle{madsen}',
'\\pagestyle{companion}',

// openany, openright, openleft
'\\openany',
'\\makepagestyle{headings}',
'\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
//'\\renewcommand{\\printchapternum}{\\space}', -- Force no chapter nums

'',
'\\begin{document}',
'%%% The Frontmatter. %%%',
'\\begin{titlingpage}', // Don't number the title page
'\\mainBookTitle',
'\\end{titlingpage}',
'\\frontmatter*',
'', // copyright page
'{{#frontmatter.copyright}}',
// \\{include{
// do stuff...
'{{/frontmatter.copyright}}',
'',
'',
'\\newpage',
'\\tableofcontents',
'',
'',
'%%% The content. %%%',
'\\mainmatter',
'{{&content}}',
'',
'\\end{document}'].join('\n');
