#!/bin/bash

../../scripts/book_gen.js \
    --autoBoxCropOnVariation \
    --regionRestrictions=TOP,BOTTOM && \
    pdflatex game_commentary.tex
