#! /bin/bash

local BOOK_NAME="epub-game-commentary"

set -e

gulp concat-node

# set working directory to the directory of this script.
cd "$(dirname "$0")"

if [ -d "${BOOK_NAME}" ]; then
  rm -R "${BOOK_NAME}"
fi

echo " ** Generating ebook ** "
node index.js

echo " ** Zipping ebook ** "
./zip.sh

echo " ** Validating ebook ** "
./validate.sh
