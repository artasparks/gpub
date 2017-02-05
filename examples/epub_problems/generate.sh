#! /bin/bash

# set working directory to this directory
cd "$(dirname "$0")"

rm epub-book/OEBPS/svg/*

echo " ** Generating ebook ** "
node index.js

echo " ** Zipping ebook ** "
./zip.sh

echo " ** Validating ebook ** "
./validate.sh
