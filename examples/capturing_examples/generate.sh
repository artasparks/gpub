#! /bin/bash

set -e

gulp concat-node

# set working directory to this directory
cd "$(dirname "$0")"

if [ -d "epub-book" ]; then
  rm -R epub-book
fi

if [ -d "gen-diagrams" ]; then
  rm -R gen-diagrams
fi

if [ -f "epub-book.yaml" ]; then
  rm epub-book.yaml
fi


echo " ** Generating yaml ** "
node ../../cmd/gpub.js init-spec --init-type=PROBLEM_EBOOK --output=epub-book.yaml

echo " ** Processing yaml ** "
node ../../cmd/gpub.js process --input=epub-book.yaml --output=epub-book.yaml

echo " ** Generating diagrams ** "
node ../../cmd/gpub.js render-diagrams --input=epub-book.yaml

echo " ** Converting to PNG ** "
INKS=/Applications/Inkscape.app/Contents/Resources/bin/inkscape
# brew install imagemagick --with-librsvg
if [ -f $INKS ]; then
  svgfiles=$(find . -type f -name '*.svg')
  for f in $svgfiles; do
    svg=gen-diagrams/$(basename $f)
    png=gen-diagrams/$(basename $f .svg).png
    # Doesn't do a good job with fonts. =(
    # convert $PWD/$svg $PWD/$png
    $INKS -z -e $PWD/$png -w 500 $PWD/$svg
  done
fi

echo " Warning: Generating book not yet finished "
exit

# echo " ** Zipping ebook ** "
# ./zip.sh

# echo " ** Validating ebook ** "
#
