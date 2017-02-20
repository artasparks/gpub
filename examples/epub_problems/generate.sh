#! /bin/bash

set -e

gulp concat-node

# set working directory to this directory
cd "$(dirname "$0")"

if [ -d "epub-book" ]; then
  rm -R epub-book
fi

echo " ** Generating ebook ** "
node index.js

echo " ** Zipping ebook ** "
./zip.sh

echo " ** Validating ebook ** "
./validate.sh
