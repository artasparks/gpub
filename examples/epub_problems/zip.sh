#! /bin/sh

rm ebook.zip
zip -X0 "ebook.epub" "epub-book" epub-book/mimetype
zip -rDX9 "ebook.epub" "epub-book" -x "*.DS_Store" -x mimetype
