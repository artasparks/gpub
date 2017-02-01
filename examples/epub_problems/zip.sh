#! /bin/bash

# set working directory to this directory
cd "$(dirname "$0")"

# Remove the existing ebook.epub if it exists.
if [ -f ebook.epub ]; then
  rm ebook.epub
fi

# CD into epub-book to avoid path-prefix.
cd epub-book

zip -X0 "../ebook.epub" mimetype
zip -rDX9 "../ebook.epub" * -x "*.DS_Store" -x mimetype
