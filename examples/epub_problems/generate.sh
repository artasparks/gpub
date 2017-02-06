#! /bin/bash

set -e

# set working directory to this directory
cd "$(dirname "$0")"

rm -R epub-book

echo " ** Generating ebook ** "
node index.js

echo " ** Zipping ebook ** "
./zip.sh

echo " ** Validating ebook ** "
./validate.sh
