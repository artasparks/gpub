/**
 * The phases of GPub. GPub generation happens in four phases. Generation can
 * stop at any one of the four steps and output the results.
 *
 * 1. Options. In this step, we process tho options for validity. Stopping at
 *    this step produces a validate options spec with only the file
 * 2. Spec Generation. This a description of the book in JSON. This is
 *    equivalent to a Glift spec, with embedded SGFs.
 * 3. Diagram Generation. The diagrams are generated next.
 * 4. Book Generation. Lastly, the diagrams are combined together to form the
 *    book.
 *
 * For a variety of reasons, the book generation can be terminated at any one of
 * these 3 phases.
 */
gpub.outputPhase = {
  OPTIONS: 'OPTIONS',
  SPEC: 'SPEC',
  DIAGRAMS: 'DIAGRAMS',
  BOOK: 'BOOK'
};


/**
 * The type general type of the book.  Specifes roughly how we generate the
 * Glift spec.
 */
gpub.bookPurpose = {
  /** Game with commentary. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /** Set of problems and, optionally, anwsers. */
  PROBLEM_SET: 'PROBLEM_SET',

  /** A set of problems processed specifically for book consumption. */
  PROBLEM_BOOK: 'PROBLEM_BOOK'
};


/**
 * The format for gpub output.
 */
gpub.outputFormat = {
  /** Construct a book in ASCII format. */
  ASCII: 'ASCII',

  /** Constructs a EPub book. */
  EPUB: 'EPUB',

  /** Constructs a full HTML page. This is often useful for testing. */
  HTMLPAGE: 'HTMLPAGE',

  /** Construct a book with a LaTeX format. */
  LATEX: 'LATEX'

  /** Construct a book in Smart Go format. */
  // SMART_GO: 'SMART_GO'

  // Future Work:
  // - ONLY_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};

/**
 * Process the incoming options and set any missing values.
 */
gpub.processOptions = function(options) {
  var newo = {};
  var options = options || {};

  var simpleTemplate = function(target, base, template) {
    for (var key in template) {
      if (newo[key] !== undefined) {
        // We've already copied this key
        continue;
      }
      var val = base[key];
      // Note: we treat null and empty string as intentionally falsey values,
      // thus we only rely on default behavior in the case of
      if (val !== undefined) {
        target[key] = base[key];
      } else {
        target[key] = template[key];
      }
    }
    return target;
  };

  var bookOptions = options.bookOptions || {};
  var frontmatter = bookOptions.frontmatter || {};
  var t = gpub.defaultOptions;
  simpleTemplate(
      newo, options, t);
  simpleTemplate(
      newo.bookOptions, bookOptions, t.bookOptions);
  simpleTemplate(
      newo.bookOptions.frontmatter, frontmatter, t.bookOptions.frontmatter);

  if (newo.skipDiagrams < 0) {
    throw new Error('skipDiagrams cannot be less than 0');
  }
  if (newo.maxDiagrams < 0) {
    throw new Error('maxDiagrams cannot be less than 0');
  }

  gpub.validateOptions(newo);

  return newo;
};

/**
 * Validate the options and return the passed-in obj.
 */
gpub.validateOptions = function(newo) {
  var keys = [
    'outputFormat',
    'bookPurpose',
    'boardRegion',
    'diagramType',
    'pageSize'
  ];

  var parentObjs = [
    gpub.outputFormat,
    gpub.bookPurpose,
    glift.enums.boardRegions,
    gpub.diagrams.diagramType,
    gpub.book.page.type
  ];

  if (keys.length !== parentObjs.length) {
    throw new Error('Programming error! Keys and parent objs not same length');
  }

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var value = newo[k];
    if (!parentObjs[i].hasOwnProperty(value)) {
      throw new Error('Value: ' + value + ' for property ' + k + ' unrecognized'); 
    }
  }

  return newo;
};
