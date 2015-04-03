#!/bin/bash

USAGE="=================================================================
  generate.sh [-h] <book-directory>
  A script for regenerating a Go book in the GPub examples directory.

  Note: This script assumes:
    - That you have LaTeX installed
    - That you have NodeJS installed
    - That you have the following in your .bashrc or equivalent:
    PATH=/path/to/gpub/scripts:\$PATH

  The target directory MUST have the following:
    - SGF files.

  The target directory MAY have the following:
    - Frontmatter declaration (frontmatter.json)
    - Frontmatter files:
          copyright.{tex|md},
          introduction.{tex|md},
          preface.{tex|md}"

command -v kpsewhich >/dev/null 2>&1 || {
  echo >&2 "TeX is required, but it is not installed.  Aborting."
  echo "$USAGE" >&2
  exit 1;
}

# Get directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "$USAGE" >&2
exit 1;
