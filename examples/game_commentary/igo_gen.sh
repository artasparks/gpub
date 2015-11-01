#!/bin/bash

# Default way to generate the book.

../../scripts/book_gen.js \
  --diagram_type=IGO \
  --max_diagrams=1 \
  && pdflatex game_commentary.tex
