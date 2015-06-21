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
'  <%#authors%>',
'     {\\Large{<%.%>}} \\\\',
'     \\vspace*{1 em}',
'  <%/authors%>',
'  \\vspace*{5 em}',
'  {\\textcolor{light-gray}{\\Huge{<%title%>}}}\\\\',
'  \\vspace*{\\baselineskip}',
'  <%#subtitle%>',
'  {\\small \\bfseries <%subtitle%> }\\par',
'  <%/subtitle%>',
'  \\vfill',
'  <%#publisher%>',
'  {\\Large{<%publisher%>}}\\par',
'  \\vspace*{2\\baselineskip}',
'  <%/publisher%>',
'  <%#year%>',
'  {\\large{<%year%>}}\\par',
'  \\vspace*{2\\baselineskip}',
'  <%/year%>',
'\\endgroup}',

' %%% Chapter settings %%%',
//'\\pagestyle{empty}',
//'\\chapterstyle{section}', -- the old style
//'\\chapterstyle{demo2}', -- 2 hrules
// other options for chapter styles:
// bringhurst,crosshead,default,dowding,memman,komalike,ntglike,tandh,wilsondob
'\\chapterstyle{madsen}',

// openany, openright, openleft
'\\openany',
'\\makepagestyle{headings}',
'\\setlength{\\headwidth}{\\textwidth}',
'\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
'\\makerunningwidth{headings}[\\textwidth]{\\textwidth}',

'\\pagestyle{companion}',
'\\makerunningwidth{companion}{\\headwidth}',
//'\\renewcommand{\\printchapternum}{\\space}', -- Force no chapter nums

'',
'\\begin{document}',
'%%% The Frontmatter. %%%',
'\\begin{titlingpage}', // Don't number the title page
'\\mainBookTitle',
'\\end{titlingpage}',
'\\frontmatter*',
'', // copyright page
'<%#frontmatter.copyright%>',
'\\include{<%frontmatter.copyright%>}',
'<%/frontmatter.copyright%>',
'',
'',
'\\newpage',
'', // TODO(kashomon): Flag guard content generation.
'\\tableofcontents',
'',
'<%#frontmatter.foreward%>',
'\\include{<%frontmatter.foreward%>}',
'<%/frontmatter.foreward%>',
'',
'<%#frontmatter.preface%>',
'\\include{<%frontmatter.preface%>}',
'<%/frontmatter.preface%>',
'',
'<%#frontmatter.acknowledgements%>',
'\\include{<%frontmatter.acknowledgements%>}',
'<%/frontmatter.acknowledgements%>',
'',
'<%#frontmatter.introduction%>',
'\\include{<%frontmatter.introduction%>}',
'<%/frontmatter.introduction%>',
'',
'%%% The content. %%%',
'\\mainmatter',
'<%&content%>',
'',
'\\end{document}'].join('\n');
