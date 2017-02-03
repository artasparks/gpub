#! /bin/bash

# set working directory to this directory
cd "$(dirname "$0")"

java -jar ../../tools/epubcheck/epubcheck.jar ebook.epub
