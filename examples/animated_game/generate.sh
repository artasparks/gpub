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


# echo " ** Generating yaml ** "
node ../../cmd/gpub.js init-spec --init-type=COMMENTARY_EBOOK --max-diagram-distance=1 --ignore-render-labels --output=epub-book.yaml --no-use-next-moves-path

echo " ** Processing yaml ** "
node ../../cmd/gpub.js process --input=epub-book.yaml

echo " ** Generating diagrams ** "
node ../../cmd/gpub.js render-diagrams --input=epub-book-processed.yaml

echo " ** Converting to PNG ** "
INKS=/Applications/Inkscape.app/Contents/Resources/bin/inkscape
# brew install imagemagick --with-librsvg
if [ -f $INKS ]; then
  svgfiles=$(find . -type f -name '*.svg')
  for f in $svgfiles; do
    svg=gen-diagrams/$(basename $f)
    png=gen-diagrams/$(basename $f .svg).png
    # Neither of these do a good job with fonts. =(
    convert $PWD/$svg $PWD/$png

    # Note that Inkscape creates PNGs with transparency which while nice for
    # diagrams, isn't great for animations.
    # $INKS -z -e $PWD/$png -w 500 $PWD/$svg
  done
fi

echo " ** Animating ** "
convert -loop 0 -delay 10 gen-diagrams/*.png gen-diagrams/animation.gif
convert gen-diagrams/animation.gif \( +clone -set delay 500 \) +swap +delete gen-diagrams/animation-pause.gif

exit

# echo " ** Zipping ebook ** "
# ./zip.sh

# echo " ** Validating ebook ** "
#


