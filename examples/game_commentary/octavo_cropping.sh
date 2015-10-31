#!/bin/bash

# Generate the book so that it's octavo-sized

../../scripts/book_gen.js \
  --page_size=OCTAVO \
  --autoBoxCropOnVariation \
  --regionRestrictions=TOP,BOTTOM \
  && pdflatex game_commentary.tex
