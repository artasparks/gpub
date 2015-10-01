#!/usr/bin/env node

// Note: experimental. Doesn't currently work.

// The sgf merge tool expects four values:
//
// LOCAL
//    The version from the current branch
// REMOTE
//    The version from the other branch
// BASE
//    The version from the merge base (common ancestor)
// MERGED
//    File to which the merged version should be written
//
// The tool should exit with a code of zero to indicate that the user is happy
// with the merged version, saved to the filename in the MERGED environment
// variable. A nonzero exit code means that Git should ignore that file and not
// mark this conflict resolved.
//
// See:
// http://chimera.labs.oreilly.com/books/1230000000561/ch07.html#_custom_merge_tools
//
// Add to your global .gitconfig
//
// [mergetool "sgfmerge"]
// 	cmd = sgf_merge.js $LOCAL $REMOTE $MERGED $BASE
// 	trustExitCode = true

var scriptpath = process.argv[1] || 'script';

if (argv.length !== 5) {
  throw new Error('Expecting format: $LOCAL $REMOTE $MERGED $BASE');
}

var scriptpath = process.argv[1] || 'script';

var local = process.argv[2];
console.log(local);
console.log('-----------------------------------');
var remote  = process.argv[3];
console.log(remote);
console.log('-----------------------------------');
var base  = process.argv[4];
console.log(base);
console.log('-----------------------------------');
var merged  = process.argv[5];
console.log(merged);
console.log('-----------------------------------');

return 1;
