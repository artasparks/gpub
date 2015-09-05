#!/bin/bash

# Generate the book so that it's PDF/X-1a:2001 compatible and octavo-sized

../../scripts/book_gen.js \
  --page_size=OCTAVO \
  --pdfx1a \
  --autoBoxCropOnVariation \
  --regionRestrictions=TOP,BOTTOM
