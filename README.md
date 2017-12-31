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

### Pre-Setup  Steps

1. Install [LaTeX](http://www.latex-project.org/)
1. Install the Gnos Font. For font-installation instructions, see
   [Kashomon/go-type1](https://www.github.com/Kashomon/go-type1). The recommended font
   is gnos.
1. Install [NodeJS](https://nodejs.org/)

## The CLI

GPub has a rudamentary CLI for generating books, images, and preforming other
useful SGF-related tasks.

### Installation

Install with NPM:

```
npm install -g gpub
```

Or manually:

```shell
git clone git@github.com:Kashomon/gpub.git

# Install the necessary node modules
cd gpub
npm install

# Add to your bashrc/bash_profile
alias gpub='/Users/kashomon/inprogress/gpub/cmd/gpub.js'
```

With this tool, you now have the ability to create Go images!

### Spec Generation

The GPub spec is a YAML or JSON file that specifies the SGFs you want processed
into a book or images. To get one started, use

```shell
gpub init-spec
```

This will crawl the current directory looking for SGFs and then sort them.

Currently, GPub supports two types of 'books': Commentary books and problem
books. The default is a `COMMENTARY_LATEX`. Here are the options:

* `PROBLEM_LATEX` (default): Make a problem book PDF, using LaTeX.
* `PROBLEM_EBOOK`: Make a problem book, as an EBook.
* `COMMENTARY_LATEX`: Make a game commentary book PDF, using LaTeX.

### [Optional] Spec Processing

The initial GPub spec created from the above is very rudamentary. GPub must
figure out which images should be generated. In order to do that, the spec
needs to be 'processed'. This can be done separately or it can be combined with
later steps.

```shell
gpub process --input my-spec.yaml
```

### [Optional] Image Generation

Next, GPub takes the processed Spec and generates images from the combination
of the SGFs and the positional information from the spec.

By default, gpub creates a generated output-directory called `diagrams`, and
also auto-processes the spec (previous step).

```shell
gpub render-diagrams --input my-spec.yaml
```

By default, gpub gets the diagram type from the spec, but this can be overridden:

```shell
gpub render-diagrams --input my-spec.yaml --diagram-type SVG
```

Also, if it's helpful, you can write the comments that go with the diagrams to .txt files:

```shell
gpub render-diagrams --input go-book.yaml --write-comments
```

### Book Generation

TODO(Kashomon): Add this functionality.

*Book Generation doesn't currently work. As such, this is an aspirational goal*

### Extras

The GPub CLI also has some helpers I've found useful:

**Parse go files.** Autodetect and parse go files. Currently just supports
Tygem (gib) and SGF files.

```
# Specify individual files
gpub parse -f foo.gib,bar.gib -o $CWD

# Specify  an input directory
gpub parse -i path/to/tygem/files
```

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
