gpub
====

GPub: The Future of Go Publishing

For font-installation instructions, see Kashamon/go-type1.  The recommended font is gnos.

### A Discussion of Architecture

At the base of GPub is Glift, which provides all the interesting SGF parsing / handling.

GPub deals with a number of data types:

* __SGF__: SGF is the basic file format for Go. It stands for Smart Go Format
  and is meant to record moves, variations, and comments.  SGFs look like `(;GM[1]AW[aa]AB[ab]...)`
* __Glift Spec__: This is the JSON format used by Glift for rendering multiple
  SGFs.  Beyond SGFs, it also contains tertiary data for rendering such as widgetType.
* __LaTeX__: A target book format.
* __Markdown__: Markdown is a text-formatting style used for rendering.
  Typically, the target is HTML, but in the case of GPub, Markdown is used for comments to rendor LaTeX.

Thus, we see the following flow in GPub:

    List of SGFS  => Generate Glift Spec
                  => Generate Book Spec (Optional)
                  => Generate LaTeX
                  => Generate PDF (via pdflatex)

### Open Questions

* Does it make sense to generate an intermediate Book Spec? It works reasonably
  well for games, but it might not make sense for problems.
