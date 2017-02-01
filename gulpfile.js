'use strict';

var gulp = require('gulp'),
    qunit = require('gulp-qunit'),
    size = require('gulp-size'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    through = require('through2'),
    nglob = require('glob'),

    fs = require('fs'),
    path = require('path');

// The source paths, used for generating the glob, for determining sources.
var srcPaths = [
  // :Glift Core: //
  // Top level source package must go first since it defines the namespace
  'deps/glift-core/glift.js',

  // Enums/Points are depended on directly by lots of other packages.
  'deps/glift-core/util',

  // The rest of glift-core
  'deps/glift-core',

  // TODO(kashomon): Should be just src/ once conversion to closure-types is
  // complete
  // :GPub: //
  'src/gpub.js',
  'src/api',
  'src/spec',
  'src/diagrams',
  'src/util',
  'src/book',
  'src/book/latex',
]

// Ignore the test files
var srcIgnore = ['!src/**/*_test.js', '!deps/**/*_test.js']

// The glob used for determining tests
var testGlob = [
  'src/api/*_test.js',
  'src/spec/*_test.js',
  'src/util/*_test.js',
  'src/diagrams/**/*_test.js',
  'src/book/**/*_test.js',

  // Don't include Glift deps
  // 'deps/**/*_test.js'
]

// The full build-test cycle. This:
// - Updates all the HTML files
// - Recreates the concat-target
// - Runs all the tests
// - Compiles with JSCompiler + TypeChecking
gulp.task('build-test', ['concat', 'compile', 'test', 'concat-node'])

gulp.task('test', ['update-html-tests', 'update-html-srcs'], () => {
  return gulp.src('./test/htmltests_gen/GPubQunitTest.html').pipe(qunit())
});

// A watcher for the the full build-test cycle.
gulp.task('test-watch', () => {
  return gulp.watch([
    'src/**/*.js',
    'src/**/*_test.js'], ['test'] );
});

// A simpler watcher that just updates the 
gulp.task('update-html-watch', () => {
  return gulp.watch([
    'src/**/*.js',
    'src/**/*_test.js'], ['update-html-tests', 'update-html-srcs'] );
})

// Compile the sources with the JS Compiler
gulp.task('compile', () => {
  return gulp.src(jsSrcGlobGen(srcPaths, srcIgnore))
    .pipe(closureCompiler({
      compilerPath: './tools/compiler-latest/compiler.jar',
      fileName: 'gpub.js',
      compilerFlags: {
        // TODO(kashomon): Turn on ADVANCED_OPTIMIZATIONS when all the right
        // functions have been marked @export, where appropriate
        // compilation_level: 'ADVANCED_OPTIMIZATIONS',
        //
        language_in: 'ECMASCRIPT5',
        // Note that warning_level=VERBOSE corresponds to:
        //
        // --jscomp_warning=checkTypes
        // --jscomp_error=checkVars
        // --jscomp_warning=deprecated
        // --jscomp_error=duplicate
        // --jscomp_warning=globalThis
        // --jscomp_warning=missingProperties
        // --jscomp_warning=undefinedNames
        // --jscomp_error=undefinedVars
        //
        // Do some advanced Javascript checks.
        // https://github.com/google/closure-compiler/wiki/Warnings
        jscomp_error: [
          'accessControls',
          'checkRegExp',
          'checkTypes',
          'checkVars',
          'const',
          'constantProperty',
          'deprecated',
          'duplicate',
          'globalThis',
          'missingProperties',
          'missingProvide',
          'missingReturn',
          'undefinedNames',
          'undefinedVars',
          'visibility',
          // We don't turn requires into Errors, because the closure compiler
          // reorders the sources based on the requires.
          // 'missingRequire',
        ]
      }
    }))
    .pipe(size())
    .pipe(gulp.dest('./compiled/'))
})

gulp.task('concat', () => {
  return gulp.src(jsSrcGlobGen(srcPaths, srcIgnore))
    .pipe(concat('gpub-concat.js'))
    .pipe(size())
    .pipe(gulp.dest('./compiled/'))
})

gulp.task('concat-node', () => {
  return gulp.src(jsSrcGlobGen(srcPaths, srcIgnore))
    .pipe(concat('gpub-concat.js'))
    .pipe(size())
    .pipe(gulp.dest('./gpub-node/'))
})

// Update the HTML tests with the dev JS source files
gulp.task('update-html-srcs', () => {
  return gulp.src(jsSrcGlobGen(srcPaths, srcIgnore))
    .pipe(updateHtmlFiles({
      filesGlob: './test/htmltests/*.html',
      outDir: './test/htmltests_gen/',
      header: '<!-- AUTO-GEN-DEPS -->',
      footer: '<!-- END-AUTO-GEN-DEPS -->',
      dirHeader: '<!-- %s sources -->',
    }))
});

// Update the HTML tests with the test JS files
gulp.task('update-html-tests', () => {
  return gulp.src(testGlob)
    .pipe(updateHtmlFiles({
      filesGlob: './test/htmltests/GPubQunitTest.html',
      outDir: './test/htmltests_gen/',
      header: '<!-- AUTO-GEN-TESTS -->',
      footer: '<!-- END-AUTO-GEN-TESTS -->',
      dirHeader: '<!-- %s tests -->',
    }))
})

// Update the HTML tests with the compiled glift.
gulp.task('update-html-compiled', ['compile'], () => {
  return gulp.src('./compiled/gpub.js')
    .pipe(updateHtmlFiles({
      filesGlob: './test/htmltests/*.html',
      outDir: './test/htmltests_gen/',
      header: '<!-- AUTO-GEN-DEPS -->',
      footer: '<!-- END-AUTO-GEN-DEPS -->',
      dirHeader: '<!-- %s sources -->',
    }))
});

gulp.task('compile-test', ['update-html-compiled'], () => {
  return gulp.src('./test/htmltests_gen/GPubQunitTest.html').pipe(qunit())
});

gulp.task('compile-watch', () => {
  return gulp.watch([
    'src/**/*.js',
    'src/**/*_test.js'], ['update-html-compiled'] );
});

gulp.task('src-gen', () => {
  gulp.src(jsSrcGlobGen(srcPaths, srcIgnore))
    .pipe(through.obj(function(file, enc, cb) {
      console.log(file.path);
      cb()
    }, function(cb) {
      cb()
    }));
});

gulp.task('bump-patch', ['concat-node'], () => {
  gulp.src(['package.json', 'src/gpub_global.js', 'src/gpub.js'])
    .pipe(updateVersion({type: 'patch'}))
});

/////////////////////////////////////////////////
/////////////// Library Functions ///////////////
/////////////////////////////////////////////////
//
// Beware! Below lie demons unvanquished.
//
// TODO(kashomon): Move these to a node library for sharing with GPub

/**
 * Takes an ordering array and an ignore glob-array and generates a glob array
 * appropriate for gulp. What this does is take an array of paths (both files
 * and directorys), and recursively generates directory-based globs.
 *
 * Glift (and co) have an idiosyncratic way of genserating namespaces.
 * Namepsaces are created files with the same name as a directory. For example,
 * src/foo should have a file that defines glift.foo = {}; Thus, these files
 * must go first before all other files that depend on that namespace.
 *
 * As an expanded example, consider the following directories:
 *
 * src/
 *  foo/
 *    abc.js
 *    foo.js
 *    zed.js
 *  bar/
 *    bbc.js
 *    bar.js
 *    zod.js
 *    biff/
 *      biff.js
 *      boff.js
 *
 * So, when called as such:
 *    jsSrcGlobGen(['src'])
 *
 * The following array would be produced:
 *    [
 *      'src/*.js', 'src/foo/foo.js', 'src/foo/*.js', 'src/bar/bar.js',
 *      'src/bar/biff/biff.js', 'src/bar/biff/*.js'
 *    ]
 *
 * Note: for convenience, users may pass in a set of normal node-glob style
 * globs that will be appended to the generated globs.
 *
 * I.e., if jsSrcGlobGen is called with
 *    jsSrcGlobGen(['src'], ['!src/**' + '/*_test.js'])
 *
 * Then, assuming the directory structure above, the output array will be
 *   [ 'src/*.js', ..., !src/**' + ' /*_test.js']
 *
 * (note: Concatenation is used to avoid comment-breaks).
 *
 * @param {!Array<string>} ordering
 * @param {!Array<string>} addGlobs
 * @return {!Array<string>} processed globs
 */
function jsSrcGlobGen(ordering, addGlobs) {
  if (typeof ordering !== 'object' || !ordering.length) {
    throw new Error(
        'Ordering must be a non-empty array of paths. ' +
        'Was: ' + (typeof ordering) + ':' + String(ordering));
  }

  var out = [];
  var addGlobs = addGlobs || [];

  var rread = function(dirPath) {
    var components = dirPath.split(path.sep);
    var last = components[components.length - 1];

    var nsfile = path.join(dirPath, last + '.js');
    if (fs.existsSync(nsfile)) {
      out.push(nsfile);
    }
    out.push(path.join(dirPath, '*.js'));

    fs.readdirSync(dirPath).forEach((f) => {
      var fpath = path.join(dirPath, f)
      var fd = fs.lstatSync(fpath);
      if (fd.isDirectory()) {
        rread(fpath)
      }
    });
  }

  ordering.forEach((fpath) => {
    if (!fs.existsSync(fpath)) {
      console.warn('Path does not exist: ' + path);
      return;
    }
    var fd = fs.lstatSync(fpath);
    if (!fd.isDirectory()) {
      out.push(fpath);
    } else {
      rread(fpath);
    }
  })

  return out.concat(addGlobs);
}

/**
 * Update the semver version
 * @param {{
 *  regexes: !Array<!RegExp>,
 *  type: string
 * }} opt
 */
function updateVersion(opt) {
  var opt = opt || {};
  var allFile = [];
  var defaultReg = [
    'version:\\s*[\'"]((\\d+)\\.(\\d+)\\.(\\d+))[\'"]',
    '"version":\\s*"((\\d+)\\.(\\d+)\\.(\\d+))"',
    '@version\\s*((\\d+)\\.(\\d+)\\.(\\d+))',
  ];

  var inRegs = defaultReg || opt.regexes;
  var reg = inRegs.map((r) => new RegExp(r));
  var type = opt.type || 'patch';
  if (type !== 'patch' && type !== 'minor' && type !== 'major') {
    throw new Error('Unknown bump type (should be patch, minor, or major): ' + type);
  }
  return through.obj(function(file, enc, cb) {
    allFile.push(file.path);
    cb();
  }, function(cb) {
    allFile.forEach((f) => {
      var contents = fs.readFileSync(f, {encoding: 'UTF-8'})
      for (var i = 0; i < reg.length; i++) {
        var r = reg[i];
        if (r.test(contents)) {
          console.log('Updating Version for: ' + f);
          contents = contents.replace(r, function(match, p1, maj, min, pat) {
            var nmaj = maj, nmin = min, npat = pat;
            if (type === 'major') {
              nmaj = parseInt(maj, 10) + 1;
            }
            if (type === 'minor') {
              nmin = parseInt(min, 10) + 1;
            }
            if (type === 'patch') {
              npat = parseInt(pat, 10) + 1;
            }
            var newv = nmaj + '.' + nmin + '.' + npat
            // Now we can use simple string replacement
            return match.replace(p1, newv)
          })
          break;
        }
      }
      fs.writeFileSync(f, contents)
    })
    cb();
  })
}


/**
 * A function to update the HTML files. The idea is that updateHtmlFiles takes a
 * glob of files and treats them as templates. It goes through and add
 * sources to these files then outputs them to  the specified outDir
 *
 *  - filesGlob: The glob of html files.
 *  - header: The header marker to indicate where to dump the JS sources.
 *  - footer: The footer marker to indicate where to dump the JS
 *    sources.
 *  - outDir the output dir for the templated files.
 *  - template - the template to use.
 * @param {{
 *  filesGlob: string,
 *  header: string,
 *  footer: string,
 *  outDir: string,
 *  template: string
 * }} params
 * @return {!Object} an object stream
 * Note: this gets the 'srcs' as part of the Vinyl file stream.
 */
function updateHtmlFiles(params) {
  var files = nglob.sync(params.filesGlob);
  var header = params.header;
  var footer = params.footer;
  var regexp = new RegExp(`(${header})(.|\n)*(${footer})`, 'g')
  var outDir = params.outDir;

  var dirHeader = params.dirHeader;
  var all = [];
  var template = params.template || '<script type="text/javascript" src="%s"></script>';

  return through.obj(function(file, enc, cb) {
    all.push(file);
    cb();
  }, function(cb) {
    var htmldir = path.dirname(files[0])

    var tags = [];
    var lastdir = null
    all.forEach((f) => {
      var relpath = path.relative(htmldir, f.path)

      var dir = path.dirname(f.path)
      if (dir !== lastdir) {
        tags.push(dirHeader.replace('%s', path.relative(htmldir, dir)))
        lastdir = dir
      }

      tags.push(template.replace('%s', relpath))
      this.push(f)
    })

    var text = tags.join('\n');

    if (!fs.existsSync(outDir)){
      fs.mkdirSync(outDir);
    }

    files.forEach((fname) => {
      var parsedPath = path.parse(fname)
      var outPath = path.join(outDir, parsedPath.base)
      if (!fs.existsSync(outPath)) {
        // First we write the template files.
        var contents = fs.readFileSync(fname, {encoding: 'UTF-8'})
        fs.writeFileSync(outPath, contents)
      }
      // Then, read from the newly-written file and overwrite the template
      // sections.
      var contents = fs.readFileSync(outPath, {encoding: 'UTF-8'})
      var replaced = contents.replace(regexp, '$1\n' + text + '\n$3')
      fs.writeFileSync(outPath, replaced)
    });

    cb();
  })
}
