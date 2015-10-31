#!/bin/bash

# Default way to generate the book.

../../scripts/book_gen.js \
  --diagram_type=IGO \
  && pdflatex game_commentary.tex
