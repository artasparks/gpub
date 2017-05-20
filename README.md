# GPub: A Go Publishing Utility

[![Travis Build Status](https://travis-ci.org/Kashomon/gpub.svg?branch=master)](https://travis-ci.org/Kashomon/gpub)

## Overview

<img src="https://cdn.rawgit.com/Kashomon/gpub/master/marks-demo.svg" width="100%">

_Note: GPub is under active development and users may find unexpected API-breaking
changes until a 1.0.0 release occurs_

GPub is a book-generating platform written in JavaScript, with the goal of
quickly making high-quality Go/Baduk/Wei-Qi books without the need for auxilary
software.

Currently, I am working to support generating books in 3 formats: PDF (for
print), GoBooks (SmartGo), and EPub (Ebooks).

### Installation

1. Install [LaTeX](http://www.latex-project.org/)
1. Install the GNos Font. For font-installation instructions, see
   [Kashomon/go-type1](https://www.github.com/Kashomon/go-type1). The recommended font
   is gnos.
1. Install [NodeJS](https://nodejs.org/)
1. See [GPub-Examples](https://www.github.com/Kashomon/gpub-examples) for some
   worked examples how to use GPub.

## Development

If you want to do development on GPub, you will additionally need:

1. The Java runtime environment
1. Install [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) -- JavaScript task runner
1. Install dependencies via `npm install`
1. Run the full test+build `gulp build-test`

### About Gpub

GPub grew out of another library I created called Glift.

GPub that relies on the same go-processing logic as
[Glift](http://www.gliftgo.com). This core logic lives in a library (called
[glift-core](https://github.com/Kashomon/glift-core)) is is responsible for
providing an understanding of go files and generated a flattened representation
of a go position, while GPub is responsible for generating an intermediate
representation and for the ultimate rendering diagrams for print

#### Diagram Type

__`Diagram Type`__ indicates how diagrams should be rendered. Note that most diagrams
have an intended target output format. It is left as future work to indicate to
the user how the diagram types are restricted.

Various diagram types:

  * `GNOS`: Uses the Gnos LaTeX font.
  * `GOOE`: Uses the GOOE LaTeX font
  * `IGO`: Uses the IGO LaTeX font (\*not currently supported).
  * `SVG`: Generate raw SVGs (\*not currently supported).
  * `PDF`: Generate raw PDFs (\*not currently supported).

#### Styling via Markdown
By default, GPub uses
[Markdown](http://daringfireball.net/projects/markdown/syntax) to add styling to
diagram comments via [Marked.js](https://github.com/chjj/marked). In the near
future, all the major output formats will support
custom renderers. See the [Markdown Page](http://daringfireball.net/projects/markdown/syntax)
for more details about the supported syntax.

GPub also uses Markdown to gather diagram-level Metadata. The following headers will be used to generate chapter-data.

    # Foo Bar => Book Foo Bar
    ## Foo Bar => Part Foo Bar
    ### Foo Bar => Chapter Foo Bar

## Scripts

GPub comes with a number of scripts to help with book generation and
renversion. It's usually convenient ta have something like:

```shell
PATH=/Users/kashomon/inprogress/gpub/scripts:$PATH
```

in your `.bashrc` or `.bash_profile`

This will enable you to use:

* `book_gen.js` A script to generate go books.
* `convert_tygem.js` A script to convert Tygem `.gib` files to SGF. Not terribly
  robust; relies on Glift functionality.

### Flags

GPub has a custom flag parsing library (sorry). The format for flags is as follows:

```
--flag_name=value
--foo (boolean only, equivalent to --foo=true)
--nofoo (boolean only, equivalent to --foo=false)
```

*Examples*
```
--debug -- turn debugging on
--nodebug -- turn debugging on
```

### Converting Tygem files to SGF

`convert_tygem.js` converts .gib files into .sgfs (automatically making new sgf
files).

```shell
convert_tygem.js *.gib
```

## Development

To work on / contribute to Gpub, you will need to install:

* NodeJS
* Gulp
* Java (for the closure compiler, ebook-validator)
* LaTeX/XeLaTeX (for making LaTeX/XeLaTeX books)
* Calibre and/or Kindle App (for making/viewing ebooks)

Then, to install all the deps, you'll need:

```
npm install
```

And then to run the tests:

```
gulp build-test
