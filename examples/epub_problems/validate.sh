#! /bin/bash

# set working directory to this directory
cd "$(dirname "$0")"

java -jar ../../tools/epubcheck/epubcheck.jar --mode svg -v 3.0 ebook.epub
