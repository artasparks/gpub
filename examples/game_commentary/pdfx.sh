#!/bin/bash

# Generate the book so that it's PDF/X-1a:2001 compatible

../../scripts/book_gen.js --pdfx1a && pdflatex game_commentary.tex

