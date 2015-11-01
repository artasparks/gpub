#!/bin/bash

# Default way to generate the book. Note that igo fundamentally doesn't work
# with the memoir class, so this doesn't work at the moment.

../../scripts/book_gen.js \
  --diagram_type=IGO \
  --max_diagrams=1 \
  && pdflatex game_commentary.tex
