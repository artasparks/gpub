/**
 * @preserve GPub: A Go publishing platform, built on Glift
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * --------------------------------------
 */
(function(w) {
var gpub = gpub || w.gpub || {};
if (w) {
  // expose Glift as a global.
  w.gpub = gpub;
}
})(window);
gpub.global = {
  /**
   * Semantic versioning is used to determine API behavior.
   * See: http://semver.org/
   * Currently in alpha.
   */
  version: '0.1.0'
};
/**
 * GPub utilities.
 */
gpub.util = {};
/**
 * Buffer Helper. Used to manage groupings items. This implementation allows
 * users to fill up the buffer past the maximum capacity -- it us up to the user
 * to check whether the buffer should be flushed via the atCapacity method.
 */
gpub.util.Buffer = function(maxSize) {
  this._maxSize = maxSize || 1;

  /** Array of arbitrary (non-null/non-undefined) items */
  this._buffer = [];
};

gpub.util.Buffer.prototype = {
  /**
   * Adds an item to the buffer.  The item must be defined.
   */
  add: function(item) {
    if (item != null) {
      this._buffer.push(item);
    }
    return this;
  },

  /**
   * Checks whether or not the internal buffer size is larger than the specified
   * max size.
   */
  atCapacity: function() {
    return this._buffer.length >= this._maxSize;
  },

  /**
   * Returns a copy of the items array and reset the underlying array.
   */
  flush: function() {
    var copy = this._buffer.slice(0);
    this._buffer = [];
    return copy;
  }
};
/**
 * Markdown for Gpub. Note that Glift comes pre-packaged with markdown.
 *
 * Most output formats will want to defined a custom renderer.
 */
gpub.markdown = {
  /** For reference, here are the relevant methods */
  rendererMethods: {
    //////////////////////////////////
    // Block level renderer methods //
    //////////////////////////////////

    /** code: string, language: string */
    code: function(code, language) {},
    /** quote: string */
    blockquote: function(quote) {},
    /** html: string */
    html: function(html) {},
    /** text: string, level: number  */
    heading: function(text, level) {},
    /** No args */
    hr: function() {},
    /** body: string, ordered: boolean */
    list: function(body, ordered) {},
    /** text: string */
    listitem: function(text) {},
    /** text: string */
    paragraph: function(text) {},
    /** header: string, body: string*/
    table: function(header, body) {},
    /** content: string */
    tablerow: function(content) {},
    /** content: string, flags: object */
    tablecell: function(content, flags) {},

    ///////////////////////////////////
    // Inline level renderer methods //
    ///////////////////////////////////

    /** text: string */
    strong: function(text) {},
    /** text: string */
    em: function(text) {},
    /** code: string */
    codespan: function(code) {},
    br: function() {},
    /** text: string */
    del: function(text) {},
    /** href: string, title: string, text: string */
    link: function(href, title, text) {},
    /** image: string, title: string, text: string */
    image: function(href, title, text) {}
  }
};
gpub.mustache = {};

/**
 * Initialize the Mustache templating library into gpub.Mustache;
 */
(function() {
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (global, factory) {
  factory(global.Mustache = {}); // <script>
}(this, function (mustache) {

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tags) {
      if (typeof tags === 'string')
        tags = tags.split(spaceRe, 2);

      if (!isArray(tags) || tags.length !== 2)
        throw new Error('Invalid tags: ' + tags);

      openingTagRe = new RegExp(escapeRegExp(tags[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tags[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tags[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          while (value != null && index < names.length)
            value = value[names[index++]];
        } else if (typeof context.view == 'object') {
          value = context.view[name];
        }

        if (value != null)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this._renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this._renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this._renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this._unescapedValue(token, context);
      else if (symbol === 'name') value = this._escapedValue(token, context);
      else if (symbol === 'text') value = this._rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype._renderSection = function (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender(template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype._renderInverted = function(token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype._renderPartial = function(token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype._unescapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype._escapedValue = function(token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype._rawValue = function(token) {
    return token[1];
  };

  mustache.name = "mustache.js";
  mustache.version = "1.1.0";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

}.bind(gpub))();
/**
 * Package for creating the 'books'! A book, in this context, is simply defined
 * as a generated string that contains rendered SGF data.
 */
gpub.book = {
  /** Creates a book! */
  create: function(spec, options) {
    this._validate(spec);
    var gen = this.generator(options.outputFormat, options);
    return gen.generate(spec);
  },

  _validate: function(spec) {
    if (spec.sgfCollection.length < 1) {
      throw new Error('sgfCollection must be non-empty');
    }
  }
};
/**
 * Constructs a new Diagram Context.
 */
gpub.book.newDiagramContext = function(ctype, isChapter, isMainline) {
  return {
    contextType: ctype,
    isChapter: isChapter,
    isMainline: isMainline
  };
};

/**
 * The diagram context. How should the diagram be displayed in the page?
 */
gpub.book.contextType = {
  /** No diagram context: just the digaram. */
  NONE: 'NONE',

  /**
   * No go diagram; just text. WidgetType should be of type EXAMPLE.
   */
  DESCRIPTION: 'DESCRIPTION',

  /** Go diagram + text + variations. */
  EXAMPLE: 'EXAMPLE',

  /**
   * Go diagram + text + variations. A 'Variations' needs further processing.
   * It's a 'game' that hasn't been turned into a series of examples.
   */
  VARIATIONS: 'VARIATIONS',

  /**
   * A Go problem. Go Problems need further processing: primarily because are
   * several ways you may want to display answers.
   */
  PROBLEM: 'PROBLEM'
};

gpub.book._headingRegex = /(^|\n)#+\s*\w+/;

/**
 * Gets the diagram context from a movetree, which says, roughly, how to typeset
 * a diagram in the page.
 *
 * This method uses a bunch of heuristics and is somewhat brittle.
 */
gpub.book.getDiagramContext = function(mt, flattened, sgfObj) {
  var ctx = gpub.book.contextType;
  var wtypes = glift.enums.widgetTypes;
  var wt = sgfObj.widgetType;
  mt = mt.newTreeRef();

  var ctxType = ctx.NONE;
  var comment = flattened.comment();
  var isChapter = gpub.book._headingRegex.test(comment);

  if (wt === wtypes.STANDARD_PROBLEM ||
      wt === wtypes.STANDARD_PROBLEM) {
    ctxType = ctx.PROBLEM;
  } else if (
      wt === wtypes.GAME_VIEWER ||
      wt === wtypes.REDUCED_GAME_VIEWER) {
    ctxType = ctx.VARIATIONS; // Needs more processing
  } else if (wt === wtypes.EXAMPLE && flattened.endingMoveNum() === 1) {
    if (glift.obj.isEmpty(flattened.stoneMap())) {
      ctxType = ctx.DESCRIPTION;
    } else {
      ctxType = ctx.EXAMPLE;
    }
  } else {
    ctxType = ctx.EXAMPLE;
  }
  return gpub.book.newDiagramContext(ctxType, isChapter, mt.onMainline());
};
/**
 * Constructs a book generator.
 */
gpub.book.generator = function(outputFormat, options) {
  if (!outputFormat) { throw new Error('No output format defined'); }
  if (!options) { throw new Error('Options not defined'); }

  var pkg = gpub.book[outputFormat.toLowerCase()];
  if (!pkg) {
    throw new Error('No package defined for: ' + outputFormat);
  }
  if (!pkg.generator) {
    throw new Error('No generator impl for: ' + outputFormat);
  }

  var gen = new gpub.book._Generator();

  // Copy over the methods from the implementations;
  for (var gkey in pkg.generator) {
    if (gkey && pkg.generator[gkey]) {
      gen[gkey] = pkg.generator[gkey].bind(gen);
    }
  }

  if (!gen.defaultOptions ||
      glift.util.typeOf(gen.defaultOptions) !== 'function' ) {
    throw new Error('No default options-function defined for type: ' +
        outputFormat);
  }

  return gen.initOptions(options);
};

/**
 * Generator interface.  All these metheds must be defined by the book-generator
 * implementations.
 */
gpub.book.Gen = {
  /**
   * Generates a 'book', whatever that means in the relevant context.
   *
   * Arguments:
   *  spec: The glift spec.
   *  options: The gpub options.
   *
   * Returns a string: the completed book.
   */
  generate: function(spec) {},

  /**
   * Returns the default template string for the specific book processor.
   */
  defaultTemplate: function() {},

  /**
   * Returns the default options for the specific book processor.
   */
  defaultOptions: function() {}
};

/**
 * Abstract book generator. Provides default methods and constructor.
 */
gpub.book._Generator = function() {
  this._opts = {};

  /**
   * Map from first 50 bytes + last 50 bytes of the SGF to the movetree. To
   * prevent-reparsing unnecessarily over and over.
   */
  this._parseCache = {};
};

gpub.book._Generator.prototype = {
  /** Returns the 'view' for filling out a template. */
  view: function(spec) {
    if (!spec) { throw new Error('Spec must be defined. Was: ' + spec) };

    var view = glift.util.simpleClone(this._opts.bookOptions);
    var mgr = this.manager(spec);

    var firstSgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(0));
    var mt = this.getMovetree(firstSgfObj);

    var globalMetadata = mt.metadata();
    // Should we defer to the book options or the data defined in the SGF? Here,
    // we've made the decision to defer to the book options, since, in some
    // sense, the book options as an argument are more explicit.
    if (globalMetadata) {
      for (var key in globalMetadata) {
        if (globalMetadata[key]) {
          view[key] = globalMetadata[key];
        }
      }
    }
    return view
  },

  /** Returns a Glift SGF Manager instance. */
  manager: function(spec) {
    if (!spec) { throw new Error('Spec not defined'); }
    return glift.widgets.createNoDraw(spec);
  },

  /**
   * Helper function for looping over each SGF in the SGF collection.
   *
   * The function fn should expect four params:
   *  - the index
   *  - The movetree.
   *  - The 'flattened' object.
   */
  forEachSgf: function(spec, fn) {
    var mgr = this.manager(spec);
    var opts = this.options();
    // 1 million diagrams should be enough for anybody ;)
    var max = opts.maxDiagrams ? opts.maxDiagrams : 1000000;
    for (var i = opts.skipDiagrams;
        i < mgr.sgfCollection.length && i < max; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var mt = this.getMovetree(sgfObj);

      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: sgfObj.nextMovesPath,
          boardRegion: sgfObj.boardRegion
      });

      var ctx = gpub.book.getDiagramContext(mt, flattened, sgfObj);

      fn(i, mt, flattened, ctx);
    }
  },

  /**
   * Get a movetree. SGF Parsing is cached for efficiency.
   */
  getMovetree: function(sgfObj) {
    var signature = this._sgfSignature(sgfObj.sgfString);
    if (!this._parseCache[signature]) {
      this._parseCache[signature] =
          glift.rules.movetree.getFromSgf(sgfObj.sgfString);
    }
    var initPos = glift.rules.treepath.parsePath(sgfObj.initialPosition);
    return this._parseCache[signature].getTreeFromRoot(initPos);
  },

  /**
   * Returns the template to use. Use the user provided template if it exists;
   * otherwise, default to the default template for the output format.
   */
  template: function() {
    var opts = this._opts;
    if (opts.template) {
      return opts.template;
    } else {
      return this.defaultTemplate();
    }
  },

  /**
   * Set the options for the Generator. Note: The generator defensively makes
   * a copy of the options.
   */
  initOptions: function(opts) {
    if (!opts) { throw new Error('Opts not defined'); }
    this._opts = glift.util.simpleClone(opts || {});

    var defOpts = {};
    if (this.defaultOptions) {
      defOpts = this.defaultOptions();
    }

    if (!defOpts) { throw new Error('Default options not defined'); }

    // TODO(kashomon): Should this be recursive? It's not clear to me.  Do you
    // usually want to copy over top level objects as they are?
    for (var gkey in defOpts) {
      if (defOpts[gkey] && !this._opts[gkey]) {
        this._opts[gkey] = defOpts[gkey];
      }
      // Step one level deeper into book options and copy the keys there.
      if (gkey === 'bookOptions') {
        var bookOptions = defOpts[gkey];
        for (var bkey in bookOptions) {
          if (bookOptions[bkey] && !this._opts.bookOptions[bkey]) {
            this._opts.bookOptions[bkey] = bookOptions[bkey];
          }
        }
      }
    }
    return this;
  },

  /** Returns the current options */
  options: function() {
    return this._opts;
  },

  /**
   * Returns a signature that for the SGF that can be used in a map.
   * Method: if sgf < 100 bytes, use SGF. Otherwise, use first 50 bytes + last
   * 50 bytes.
   */
  _sgfSignature: function(sgf) {
    if (typeof sgf !== 'string') {
      throw new Error('Improper type for SGF: ' + sgf);
    }
    if (sgf.length <= 100) {
      return sgf;
    }
    return sgf.substring(0, 50) + sgf.substring(sgf.length - 50, sgf.length);
  }
};
/**
 * Generate an ASCII book.
 */
gpub.book.ascii = {};
/**
 * ASCII book generator methods, for implementing gpub.book.Gen
 * interface.
 */
gpub.book.ascii.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();
    var content = [];

    this.forEachSgf(spec, function(mt, flattened, ctx) {
      var diagramStr = gpub.diagrams.create(flattened, opts.diagramType);
      var label = gpub.diagrams.createLabel(flattened);
      content.push(diagramStr);
    }.bind(this));

    view.content = content.join('\n');

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.ascii._defaultTemplate;
  },

  defaultOptions: function(opts) {
    return {
      diagramType: gpub.diagrams.diagramType.SENSEIS_ASCII
    }
  }
};

gpub.book.ascii._defaultTemplate = [
'Title: {{title}}',
'Authors: {{#authors}}{{.}}, {{/authors}}',
'------------------------------------------------------------------------------',
'{{content}}'
].join('\n');
/**
 * An html 'book' creator/processor. Implements gpub.book.processor.
 */
gpub.book.htmlpage = {}

gpub.book.htmlpage._template = [
'<!DOCTYPE html>',
'<html>',
'  <head>',
'    <title> {{title}} </title>',
'  <style>',
'    * {',
'      margin: 0;',
'      padding: 0;',
'    }',
'    #glift_display1 {',
'      height:500px;',
'      width:100%;',
'      position:relative;',
'    }',
'  </style>',
'  <body>',
'    <div id="wrap" style="position:relative;">',
'      <div id="glift_display1"></div>',
'    </div>',
'    <script type="text/javascript">',
'      var gliftMgr = glift.create({{content}});',
'    </script>',
// TODO(kashomon): Need to put Glift in here somewhere. Maybe even just
// embedded.
'  </body>',
'<html>'
].join('\n');
/**
 * Generator methods for the HTML page.
 */
gpub.book.htmlpage.generator = {
  generate: function(spec, options) {
  },

  defaultTemplate: function() {
    return gpub.book.htmlBook._template;
  },

  defaultOptions: function() {
    return {};
  }
};
/**
 * LaTeX book processor! The most common output for GPub.
 */
gpub.book.latex = {};
/**
 * Some basic LaTeX context definitions.
 */
gpub.book.latex.context = {
  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(diagram, ctx, comment, label) {
    comment = comment || '';
    label = label || '';

    // Render the markdown. Note: This splits the comment into a
    //  .preamble -- the header
    //  .text -- the main body of the text.
    var processedComment = comment ? gpub.book.latex.renderMarkdown(comment) : {
      preamble: '',
      text: ''
    };

    var processedLabel = gpub.book.latex.context._processLabel(label, ctx);

    var renderer = gpub.book.latex.context.rendering[ctx.contextType];
    if (!renderer) {
      renderer = gpub.book.latex.context.rendering[DESCRIPTION];
    }

    return renderer(diagram, ctx, processedComment, processedLabel);
  },

  /** Process the label to make it appropriate for LaTeX. */
  _processLabel: function(label, ctx) {
    var baseLabel = ctx.isMainLine ? '\\gofigure' : '\\godiagram';
    if (label) {
      var splat = label.split('\n');
      for (var i = 0; i < splat.length; i++ ) {
        baseLabel += '\n\n\\subtext{' + splat[i] + '}';
      }
    }
    return baseLabel;
  },

  /** Render the specific digaram context. */
  rendering: {
    EXAMPLE: function(diagram, ctx, pcomment, label) {
      if (ctx.preamble) {
        return [
          pcomment.preamble,
          '{\\centering',
          diagram,
          '}',
          label,
          '',
          pcomment.text,
          '\\vfill'].join('\n');
      } else {
        return [
          '',
          '\\rule{\\textwidth}{0.5pt}',
          '',
          '\\begin{minipage}[t]{0.5\\textwidth}',
          diagram,
          label,
          '\\end{minipage}',
          '\\begin{minipage}[t]{0.5\\textwidth}',
          '\\setlength{\\parskip}{0.5em}',
          pcomment.text,
          '\\end{minipage}',
          '\\vfill'].join('\n');
      }
    },

    DESCRIPTION: function(diagram, ctx, pcomment, label) {
      return [
        pcomment.preamble,
        pcomment.text,
        '\\vfill'
      ].join('\n');
    },

    PROBLEM: function(diagram, ctx, pcomment, label) {
      // TODO(kashomon): implement.
    }
  }
};
/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var view = this.view(spec);
    var opts = this.options();
    view.init = gpub.diagrams.getInit(opts.diagramType, 'LATEX');
    var content = [];

    this.forEachSgf(spec, function(idx, mt, flattened, ctx) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType);
      var label = gpub.diagrams.createLabel(flattened);
      var contextualized = gpub.book.latex.context.typeset(
          diagram, ctx, flattened.comment(), label);
      content.push(contextualized);
    }.bind(this));

    view.content = content.join('\n');

    return gpub.Mustache.render(this.template(), view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return {
      diagramType: gpub.diagrams.diagramType.GNOS,
      bookOptions: {
        /**
         * init: Any additional setup that needs to be done in the header. I.e.,
         * for diagram packages.
         */
        init: '',

        title: 'My Book',
        subtitle: 'Subtitle',
        publisher: 'Publisher',
        authors: [
          'You!'
        ],

        /** Defs for definiing the diagrams. */
        diagramWrapperDef: [
          '% Mainline Diagrams. reset at parts',
          '\\newcounter{GoFigure}[part]',
          '\\newcommand{\\gofigure}{%',
          ' \\stepcounter{GoFigure}',
          ' \\centerline{\\textit{Figure.\\thinspace\\arabic{GoFigure}}}',
          '}',

          '% Variation Diagrams. reset at parts.',
          '\\newcounter{GoDiagram}[part]',
          '\\newcommand{\\godiagram}{%',
          ' \\stepcounter{GoDiagram}',
          ' \\centerline{\\textit{Diagram.\\thinspace\\arabic{GoDiagram}}}',
          '}',
          '\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
          ''].join('\n')
      }
    };
  }
};
gpub.book.latex.defaultTemplate = [
'\\documentclass[letterpaper,12pt]{memoir}',
'\\usepackage{color}',
'\\usepackage{wrapfig}',
'\\usepackage{setspace}',
'\\usepackage[margin=1in]{geometry}',

'%%% Define any extra packages %%%',
'{{init}}',

'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',

'%%% Diagram Figure defs.',
'% Must expose two commands',
'%  \\gofigure  (mainline diagrams)',
'%  \\godiagram (variation diagrams)',
'{{diagramWrapperDef}}',
'',

'%%% Define the main title %%%',
'\\definecolor{light-gray}{gray}{0.55}',
'\\newcommand*{\\mainBookTitle}{\\begingroup',
'  \\raggedleft',
'  {{#authors}}',
'     {\\Large {{.}} } \\\\',
'  {{/authors}}',
'  \\vspace*{5 em}',
'  {\\textcolor{light-gray}{\\Huge {{title}} }}\\\\',
'  \\vspace*{\\baselineskip}',
'  {\\small \\bfseries {{subtitle}} }\\par',
'  \\vfill',
'  {\\Large {{publisher}} }\\par',
'  \\vspace*{2\\baselineskip}',
'\\endgroup}',

'',
'\\begin{document}',
'',
'\\pagestyle{empty}',
'\\mainBookTitle',
'\\newpage',
'\\tableofcontents',
'',
'\\chapterstyle{section}',
'\\pagestyle{companion}',
'\\makepagestyle{headings}',
'\\renewcommand{\\printchapternum}{\\space}',
'\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
'',

'%%% The content. %%%',
'{{&content}}',
'',
'\\end{document}'].join('\n');
/** Creates a marked-Markdown renderer for LaEeX */
gpub.book.latex.renderer = function() {
  if (gpub.book.latex._rendererInstance) {
    return gpub.book.latex._rendererInstance;
  }
  var renderer = new glift.marked.Renderer();
  for (var key in gpub.book.latex.markdown) {
    renderer[key] = gpub.book.latex.markdown[key].bind(renderer);
  }
  renderer._preamble = [];

  return renderer;
};

/**
 * Returns:
 *  {
 *    preamble: ...
 *    text: ...
 *  }
 */
gpub.book.latex.renderMarkdown = function(str) {
  var renderer = gpub.book.latex.renderer()
  str = gpub.book.latex.sanitize(str);

  var text = glift.marked(str, {
    renderer: renderer,
    silent: true
  });
  return {
    preamble: renderer.extractPreamble(),
    text: text
  }
};

/** Set of markdown methods for the renderer */
gpub.book.latex.markdown = {
  ////////////////////
  // Custom methods //
  ////////////////////

  /** Extract the preamble from the renderer */
  extractPreamble: function() {
    return this._preamble.join('\n');
  },

  //////////////////////////////////
  // Block level renderer methods //
  //////////////////////////////////

  /**
   * Note: this assumes the memoir class.
   *
   * # Level 1: Book
   * ## Level 2: Part
   * ### Level 3: Chapter
   * ####+ Level 4+: Chapter*
   * text: string, level: number  
   */
  heading: function(text, level) {
    if (level === 1) {
      this._preamble.push('\\book{' + text + '}');
    } else if (level === 2) {
      this._preamble.push('\\part{' + text + '}');
    } else if (level === 3) {
      this._preamble.push('\\chapter{' + text + '}');
    } else {
      // A chapter heading without
      this._preamble.push('\\chapter*{' + text + '}');
    }
    return ''; // Don't return anything. Header should be part of the preamble.
    // TODO(kashomon): Should \\section{...} go here?
  },

  /** No args */
  hr: function() {
    return '\\hrule';
  },

  /** body: string, ordered: boolean */
  list: function(body, ordered) {
    if (ordererd) {
      return [
        '\\begin{enumerate}',
        body,
        '\\end{enumerate}'].join('\n');
    } else {
      return [
        '\\begin{itemize}',
        body,
        '\\end{itemize}'].join('\n');
    }
  },

  /** text: string */
  listitem: function(text) {
    return '\\item ' + text;
  },

  /** text: string */
  paragraph: function(text) {
    // Nothing special for paragraphs.
    return text + '\n\n';
  },

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /** text: string */
  strong: function(text) {
    return '\\textbf{' +  text + '}';
  },

  /** text: string */
  em: function(text) {
    return '\\textit{' +  text + '}';
  },

  /** code: string */
  br: function() {
    return '\\newline';
  },

  /** href: string, title: string, text: string */
  // requires: \usepackage{hyperref}
  // link: function(href, title, text) {},

  /** image: string, title: string, text: string */
  // might not be necessary
  // image: function(href, title, text) {}

  ///////////////////
  // Not Supported //
  ///////////////////
  code: function(code, language) { return code; },
  blockquote: function(quote) { return quote; },
  html: function(html) { return html; },
  // table: function(header, body) {return table},
  // tablerow: function(content) {},
  // tablecell: function(content, flags) {},

  codespan: function(code) { return code; },
  del: function(text) { return text; }
};
///////////////////
// Experimental! //
///////////////////

/**
 * Page context wrapper. I think this will probably -- at least for now -- be a
 * LaTeX consideration.
 */
gpub.book.latex.Page = function() {
  this.buffer = [];
};

gpub.book.latex.Page.prototype = {
  /** Add a diagram to the page. */
  addDiagram: function(str, context, comment, label, isMainLine) {

  },

  /** Clear the page lines */
  flush: function() {
    var out = this.buffer.join('\n');
    this.buffer = [];
    return out;
  }
};

gpub.book.latex.pageSize = {
  A4: 'A4',
  A5: 'A5',
  LETTER: 'LETTER',

  // http://en.wikipedia.org/wiki/Book_size
  QUARTO: 'QUARTO',
  OCTAVO: 'OCTAVO',
  TWELVEMO: 'TWELVEMO'
};
/**
 * Sanitizes latex input. This isn't particularly robust, but it is meant to
 * protect us against accidental problematic characters rather than malicious
 * user input.
 */
gpub.book.latex.sanitize = function(text) {
  return text
    .replace(/\\/g, '\\textbackslash')
    .replace(/[$}{%&]/g, function(match) {
      return '\\' + match;
    });
};
/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * A default Glift specification.
   */
  _defaultSpec: {
    // Since this is for a book definition, we don't need a divId. Clients
    // can add in a relevant ID later.
    divId: null,
    // An array of sgf-objects.  This will be populated with entries, created by
    // the spec processors.
    sgfCollection: [],
    // We must rely on SGF aliases to generate the collection to ensure the
    // collection is self contained.
    sgfMapping: {},
    // SGF Defaults that apply to all SGFs. This is a good place to specify the
    // base widget type, e.g., STANDARD_PROBLEM or EXAMPLE.
    sgfDefaults: {},
    // Metadata for the entire spec. Metedata is unused by Glift, but it's
    // sometimes convenient for Gpub.
    metadata: {}
  },

  /**
   * Gets the the processor based on the book purpose.
   */
  _getSpecProcessor: function(bookPurpose) {
    switch(bookPurpose) {
      case 'GAME_COMMENTARY':
        return gpub.spec.gameBook;
      case 'PROBLEM_SET':
        return gpub.spec.problemSet;
      default:
        throw new Error('Unsupported book purpose: ' + bookPurpose);
        break;
    }
  },

  /**
   * Creates a glift spec from an array of sgf data. At this point, we assume
   * the validity of the options passed in. In other words, we expect that the
   * options have been processed by the API.
   */
  create: function(sgfs, options) {
    var spec = glift.util.simpleClone(gpub.spec._defaultSpec);
    var processor = gpub.spec._getSpecProcessor(options.bookPurpose);

    spec.sgfDefaults = glift.util.simpleClone(
        glift.widgets.options.baseOptions.sgfDefaults);
    processor.setHeaderInfo(spec);

    for (var i = 0; sgfs && i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      var mt = glift.parse.fromString(sgfStr);
      var alias = mt.properties().getOneValue('GN') || 'sgf:' + i;
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }
      spec.sgfCollection = spec.sgfCollection.concat(
          processor.processOneSgf(mt, alias, options));
    }
    spec.metadata.bookPurpose = options.bookPurpose;
    return spec;
  },

  /**
   * Convert a movetree and a couple of options to an entry in the SGF
   * collection. Note: this doesn't set the widgetType: it's expected that users
   * will probably already have widgetType = EXAMPLE. Users can, of course, set
   * the widgetType after this processor helper.
   *
   * alias: Required. The cache alias.
   * initPos: Required. The init position
   * nextMoves: Required. Next moves path
   * boardRegion: Required. The region of the board to display.
   */
  _createExample: function(
      alias, initPos, nextMoves, region) {
    if (!alias) { throw new Error('No SGF Alias'); }
    if (!initPos) { throw new Error('No Initial Position'); }
    if (!nextMoves) { throw new Error('No Next Moves'); }
    if (!glift.enums.boardRegions[region]) {
      throw new Error('Unknown board region: ' + region);
    }
    var exType = gpub.spec.exampleType;
    var ipString = glift.rules.treepath.toInitPathString;
    var fragString = glift.rules.treepath.toFragmentString;
    var base = {
      // widgetType: 'EXAMPLE',
      alias: alias,
      initialPosition: ipString(initPos),
      nextMovesPath: fragString(nextMoves),
      boardRegion: region,
      widgetType: 'EXAMPLE'
    };
    return base;
  }
};
/**
 * A gpub spec processor. Implements gpub.spec.processor.
 */
gpub.spec.gameBook = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.EXAMPLE;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
    var out = [];
    var varPathBuffer = [];
    var node = mt.node();
    while (node) {
      if (!mt.properties().getOneValue('C') && node.numChildren() > 0) {
        // Ignore positions don't have comments and aren't terminal.
        // We ignore the current position, but if there are variations, we note
        // them so we can process them after we record the next comment.
        var node = mt.node();
        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
      } else {
        // This node has a comment or is terminal.  Process this node and all
        // the variations.
        var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
        out.push(gpub.spec._createExample(
            alias,
            pathSpec.treepath,
            pathSpec.nextMoves,
            options.boardRegion));

        varPathBuffer = varPathBuffer.concat(
            gpub.spec.gameBook.variationPaths(mt));
        for (var i = 0; i < varPathBuffer.length; i++) {
          var path = varPathBuffer[i];
          var mtz = mt.getTreeFromRoot(path);
          var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
          out.push(gpub.spec._createExample(
              alias,
              varPathSpec.treepath,
              varPathSpec.nextMoves,
              options.boardRegion));
        }
        varPathBuffer = [];
      }
      node = node.getChild(0); // Travel down
      mt.moveDown();
    }
    return out;
  },

  /**
   * Get an initial treepath to the point where we want to create a next-moves
   * path.
   *
   * mt: The movetree
   */
  variationPaths: function(mt) {
    mt = mt.newTreeRef();
    var out = [];
    var node = mt.node();
    if (!node.getParent()) {
      // There shouldn't variations an the root, so just return.
      return out;
    }

    mt.moveUp();
    for (var i = 1; i < mt.node().numChildren(); i++) {
      var mtz = mt.newTreeRef();
      mtz.moveDown(i);
      mtz.recurse(function(nmtz) {
        if (!nmtz.properties().getOneValue('C')) {
          return; // Must have a comment to return the variation.
        }
        out.push(nmtz.treepathToHere());
      });
    }
    return out;
  }
};
/**
 * Generates a problem set spec. Implements gpub.spec.processor.
 */
gpub.spec.problemSet = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.STANDARD_PROBLEM;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
    var outObj = {
      alias: alias,
      boardRegion: options.boardRegion
    };
    var widgetType = null;
    if (mt.getTreeFromRoot().node().numChildren() === 0) {
      // It may seem strange to use examples for problems, but this prevents
      // web-instances from trying to create a solution viewer and books from
      // creating answers. This is probably a hack, but it's not enough of one
      // to remove right now.
      if (widgetType) {
        outObj.widgetType = 'EXAMPLE';
      }
    }
    return [outObj];
  }
};
/**
 * The inteface for a spec processor. All spec processors must implement this
 * interface.
 */
gpub.spec.processor = {
  /**
   * Sets any relevant header info on the SGF Spec. Usually, the processor will
   * specify a widgetType, but other SGF Defaults or metadata may make sense.
   */
  setHeaderInfo: function(spec, options) {},

  /**
   * Process one SGF instance. Processing one SGF can result in multiple entries
   * in the SGF collection and so the return type is an array of sgf objects.
   * The most common case for this is that processing one Game results in many
   * commentary diagrams.
   *
   * movetree: The parsed SGF.
   * alias: the 'key' used for the SGF in the sgf collection in the SGF cache.
   * options: any additional options: .e.g., boardRegion.
   *
   * Returns: an array of sgf objects for the SGF collection.
   */
  processOneSgf: function(movetree, alias, options) {}
};
gpub.diagrams = {
  /**
   * Types of diagram output.
   */
  // TODO(kashomon): Make part of the API (gpub.api)
  diagramType: {
    /**
     * ASCII. Generate an ascii diagram.
     */
    ASCII: 'ASCII',
    /**
     * Sensei's ASCII variant.
     */
    SENSEIS_ASCII: 'SENSEIS_ASCII',
    /**
     * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
     */
    GOOE: 'GOOE',
    /**
     * Josh Hoak's variant of Gooe
     */
    GNOS: 'GNOS',
    /**
     * Another LaTeX font / LaTeX style package
     * >> Not Currently Supported
     */
    IGO: 'IGO',
    /**
     * Native PDF generation
     * >> Not Currently Supported, but here for illustration.
     */
    PDF: 'PDF'
  },

  /**
   * The new method for generating diagrams. Note that this no longer generates
   * the diagram context -- that is left up to the relevant book generator.
   */
  create: function(flattened, diagramType, options) {
    // TODO(kashomon): Remove optional options obj. We should only do options
    // processing in api land.
    options = options || {};
    return this._getPackage(diagramType).create(flattened, options);
  },

  /** Gets a diagram type package */
  _getPackage: function(diagramType) {
    if (!diagramType || !gpub.diagrams.diagramType[diagramType]) {
      throw new Error('Unknown diagram type: ' + diagramType);
    }
    var pkgName = glift.enums.toCamelCase(diagramType);
    var pkg = gpub.diagrams[pkgName];

    if (!pkg) {
      throw new Error('No package for diagram type: ' + diagramType);
    }
    if (!pkg.create) {
      throw new Error('No create method for diagram type: ' + diagramType);
    }
    return pkg
  },

  /** Gets the initialization data for a diagramType. */
  getInit: function(diagramType, outputFormat) {
    var pkg = this._getPackage(diagramType);
    if (!pkg.init || typeof pkg.init != 'object') {
      throw new Error('No init obj');
    }
    var init = pkg.init[outputFormat];
    if (!init) {
      return ''
    } else if (typeof init === 'function') {
      return init();
    } else if (typeof init === 'string') {
      return init;
    } else {
      return '';
    }
  },

  /**
   * A flattener helper.  Returns a Flattened object, which is key for
   * generating diagrams.
   */
  // TODO(kashomon): Consider deleting this. It's really not doing much at all.
  flatten: function(sgf, initPos, nextMovesPath, boardRegion) {
    initPos = initPos || [];
    nextMovesPath = nextMovesPath || [];
    var movetree = glift.rules.movetree.getFromSgf(sgf, initPos);
    return glift.flattener.flatten(movetree, {
      nextMovesTreepath: nextMovesPath,
      boardRegion: boardRegion
    });
  },

  /**
   * Construct the label based on the flattened object. From the flattened
   * object, we must extract the collisions and the move numbers.
   *
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  createLabel: function(flattened) {
    return gpub.diagrams._constructLabel(
        collisions = flattened.collisions(),
        isOnMainline = flattened.isOnMainPath(),
        startNum = flattened.startingMoveNum(),
        endNum = flattened.endingMoveNum());
  },

  /**
   * Construct the label based on the flattened object. From the flattened
   * object, we must extract the collisions and the move numbers.
   *
   * Collisions is an array of collisions objects, having the form:
   *    {color: <color>, mvnum: <number>, label: <str label>}
   *
   * returns: stringified label format.
   */
  _constructLabel: function(collisions, isOnMainline, startNum, endNum) {
    var baseLabel = '';
    if (isOnMainline) {
      var nums = [startNum];
      if (startNum !== endNum) {
        nums.push(endNum);
      }
      var moveLabel = nums.length > 1 ? 'Moves: ' : 'Move: ';
      baseLabel += '(' + moveLabel + nums.join('-') + ')';
    }

    if (collisions && collisions.length) {
      var buffer = [];
      for (var i = 0; i < collisions.length; i++) {
        var c = collisions[i];
        var col = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
        buffer.push(col + ' ' + c.mvnum + ' at ' + c.label);
      }
      if (baseLabel) {
        baseLabel += '\n';
      }
      baseLabel += buffer.join(', ') + '.';
    }

    return baseLabel;
  }
};
/**
 * The diagrams creator interface.
 */
gpub.diagrams.creator = {
  /**
   * Create diagram from a flattened display.
   */
  create: function(flattened, options) {}
};
/**
 * ASCII in the Sensei's library format.  See:
 * http://senseis.xmp.net/?HowDiagramsWork
 *
 * Example:
 * $$ A [joseki] variation
 * $$  ------------------
 * $$ | . . . . . . . . .
 * $$ | . . . . . . . . .
 * $$ | . . 7 3 X d . . .
 * $$ | . . O 1 O 6 . . .
 * $$ | . . 4 2 5 c . . .
 * $$ | . . 8 X a . . . .
 * $$ | . . . b . . . . .
 * $$ | . . . . . . . . .
 * $$ | . . . . . . . . .
 */
gpub.diagrams.senseisAscii = {
  create: function(flattened, opts) {
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.senseisAscii.symbolMap;

    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base());
      if (i.textLabel() &&
          i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        var label = i.textLabel(); // need to check about.
      } else if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      } // default case: symbol is the base.

      var out = symbolMap[symbol];
      if (!out) {
        console.log('Could not find symbol str for : ' + symbol);
      }
      return out;
    });

    var outArr = [];
    for (var i = 0, arr = newBoard.boardArray(); i < arr.length; i++) {
      outArr.push(arr[i].join(' '));
    }

    return outArr.join('\n');
  }
};
gpub.diagrams.senseisAscii.symbolMap = {
  /** Placeholder symbol. */
  EMPTY: '_',

  /** Base layer. */
  TL_CORNER: '.',
  TR_CORNER: '.',
  BL_CORNER: '.',
  BR_CORNER: '.',
  TOP_EDGE: '.',
  BOT_EDGE: '.',
  LEFT_EDGE: '.',
  RIGHT_EDGE: '.',
  CENTER: '.',
  CENTER_STARPOINT: '+',

  /**
   * Stone layer. We don't display the base layer if a stone layer exists.
   */
  BSTONE: 'X',
  WSTONE: 'O',

  /**
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
   */
  BSTONE_TRIANGLE: 'Y',
  WSTONE_TRIANGLE: 'Q',
  TRIANGLE: 'T',

  BSTONE_SQUARE: '#',
  WSTONE_SQUARE: '@',
  SQUARE: 'S',

  BSTONE_CIRCLE: 'B',
  WSTONE_CIRCLE: 'W',
  CIRCLE: 'C',

  BSTONE_XMARK: 'Z',
  WSTONE_XMARK: 'P',
  XMARK: 'M',

  // Note: BStone and WStone text labels don't really work and should be ignored
  // and just rendered as stones, unless they're numbers between 1-10
  BSTONE_TEXTLABEL: '%s',
  WSTONE_TEXTLABEL: '%s',
  TEXTLABEL: '%s'
};
/**
 * Create a gooe-font diagram.
 */
gpub.diagrams.gooe = {
  // TODO(kashomon): Remove this. Sizes are a property of the fonts, at least
  // for latex. Gooe only supports 2 sizes.  Gnos supports 8.
  sizes: {
    NORMAL: 'NORMAL',
    LARGE: 'LARGE'
  },

  /**
   * Takes a flattened set of symbols and produces a full string diagram. These
   * diagrams are not stand alone and must live inside a LaTeX document to
   * viewed.
   *
   * flattened: A flattened object.
   * size: a member of gpub.diagrams.diagramSize;
   */
  create: function(flattened, size) {
    return gpub.diagrams.gooe.gooeStringArray(flattened, size).join('\n');
  },

  /**
   * Returns an array of string lines.
   */
  gooeStringArray: function(flattened, size) {
    var header = size === 'LARGE' ? '{\\bgoo' : '{\\goo';
    var footer = '}';
    var gooeBoard = gpub.diagrams.gooe.gooeBoard(flattened, size);
    var out = [header];
    for (var i = 0, arr = gooeBoard.boardArray(); i < arr.length; i++) {
      out.push(arr[i].join(''));
    }
    out.push(footer);
    return out;
  },

  /**
   * Returns a flattener-symbol-board that's transformed into a gooe-board.
   */
  gooeBoard: function(flattened, size) {
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gooe.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
      if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      }
      var symbolSizeOverride = symbol + '_' + size;
      var out = '';
      if (symbolMap[symbolSizeOverride]) {
        out = symbolMap[symbolSizeOverride];
      } else if (symbolMap[symbol]) {
        out = symbolMap[symbol];
      } else {
        out = symbolMap.EMPTY;
      }
      if (i.textLabel()) {
        out = out.replace('%s', i.textLabel());
      }
      return out;
    });
    return newBoard;
  }
};
/**
 * Initialization necessary for various output formats.
 */
gpub.diagrams.gooe.init = {
  LATEX: function() {
    return '\\usepackage{gooemacs}\n \\\\\n' +
      gpub.diagrams.gooe.init.extraDefs();
  },

  /**
   * Some built in defs that are useful for generating LaTeX books using Gooe
   * fonts.
   */
  defs: {
    sizeDefs: [
      '% Size definitions',
      '\\newdimen\\bigRaise',
      '\\bigRaise=4.3pt',
      '\\newdimen\\smallRaise',
      '\\smallRaise=3.5pt',
      '\\newdimen\\inlineRaise',
      '\\inlineRaise=3.5pt'
    ],

    bigBoardDefs: [
      '% Big-sized board defs',
      '\\def\\eLblBig#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\bigRaise\\hbox{\\tenpointeleven{#1}}\\hss}}',
      '\\def\\goWsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\tenpointeleven{#1}\\hss}}',
      '\\def\\goBsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\color{white}\\tenpointeleven{#1}\\color{white}\\hss}}'
    ],

    normalBoardDefs: [
      '% Normal-sized board defs',
      '\\def\\eLbl#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\smallRaise\\hbox{\\tenpoint{#1}}\\hss}}',
      '\\def\\goWsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\eightpointnine{#1}\\hss}}',
      '\\def\\goBsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\color{white}\\eightpointnine{#1}\\color{white}\\hss}}'
    ]
  },

  /**
   * Generates the LaTeX document headers as a string.
   *
   * Takes a base font family. Defaults to cmss (computer modern sans serif).
   */
  extraDefs: function(baseFont) {
    var defs = gpub.diagrams.gooe.init.defs;
    var baseFont = baseFont || 'cmss';
    var fontDefsBase = [
      '% Gooe font definitions',
      '\\font\\tenpoint=' + baseFont + '10',
      '\\font\\tenpointeleven=' + baseFont + '10 at 11pt',
      '\\font\\eightpoint=' + baseFont + '8',
      '\\font\\eightpointnine=' + baseFont + '8 at 9pt'
    ]
    return fontDefsBase
      .concat(defs.sizeDefs)
      .concat(defs.bigBoardDefs)
      .concat(defs.normalBoardDefs).join('\n');
  }
};
/**
 * Mapping from flattened symbol to char
 */
gpub.diagrams.gooe.symbolMap = {
  /**
   * Generally, we don't display empty intersections for the gooe diagram type.
   */
  EMPTY: '\\eLbl{_}',

  /**
   * Base layer.
   */
  TL_CORNER: '\\0??<',
  TR_CORNER: '\\0??>',
  BL_CORNER: '\\0??,',
  BR_CORNER: '\\0??.',
  TOP_EDGE: '\\0??(',
  BOT_EDGE: '\\0??)',
  LEFT_EDGE: '\\0??[',
  RIGHT_EDGE: '\\0??]',
  CENTER: '\\0??+',
  CENTER_STARPOINT: '\\0??*',

  /**
   * Stone layer. We don't display the base layer if a stone layer exists.
   */
  BSTONE: '\\0??@',
  WSTONE: '\\0??!',

  /**
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
   */
  BSTONE_TRIANGLE: '\\0??S',
  WSTONE_TRIANGLE: '\\0??s',
  TRIANGLE: '\\0??3',
  BSTONE_SQUARE: '\\0??S',
  WSTONE_SQUARE: '\\0??s',
  SQUARE: '\\0??2',
  BSTONE_CIRCLE: '\\0??C',
  WSTONE_CIRCLE: '\\0??c',
  CIRCLE: '\\0??1',
  BSTONE_XMARK: '\\0??X',
  WSTONE_XMARK: '\\0??x',
  XMARK: '\\0??4',
  BSTONE_TEXTLABEL: '\\goBsLbl{%s}',
  WSTONE_TEXTLABEL: '\\goWsLbl{%s}',
  TEXTLABEL: '\\eLbl{%s}',

  /**
   * Here we have overrides for big-label types.
   */
  BSTONE_TEXTLABEL_LARGE: '\\goBsLblBig{%s}',
  WSTONE_TEXTLABEL_LARGE: '\\goWsLblBig{%s}',
  TEXTLABEL_LARGE: '\\eLblBig{%s}'

  // Formatting for inline stones.  Should these be there? Probably not.
  // BSTONE_INLINE: '\goinBsLbl{%s}',
  // WSTONE_INLINE: '\goinWsLbl{%s}',
  // MISC_STONE_INLINE: '\goinChar{%s}',
};
gpub.diagrams.gnos = {
  /** Available sizes. In pt. */
  sizes: {
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    14: '14',
    16: '16',
    20: '20'
  },

  /** Mapping from size to label size index. Keys in pt. */
  singleCharSizeAtTen: {
    8: 1, // tiny
    9: 2, // footnotesize
    10: 2, // footnotesize
    11: 3, // small
    12: 3, // normalsize
    14: 4, // large
    16: 5,
    20: 6
  },

  /**
   * Array of avaible latex sizes. Should probably be moved to the latex
   * package.
   */
  sizeArray: [
    'tiny',
    'scriptsize',
    'footnotesize',
    'small',
    'normalsize',
    'large',
    'Large',
    'LARGE',
    'huge',
    'Huge'
  ],

  /**
   * The create method!
   * 
   * We expect flattened and options to be edfined
   */
  create: function(flattened, options) {
    options.size = options.size || gpub.diagrams.gnos.sizes['12']
    return gpub.diagrams.gnos.gnosStringArr(flattened, options.size).join('\n');
  },

  gnosStringArr: function(flattened, size) {
    var latexNewLine = '\\\\';
    var header = [
        '\\gnosfontsize{' + size + '}',
        '{\\gnos'];
    var footer = '}';
    var board = gpub.diagrams.gnos.gnosBoard(flattened, size);
    for (var i = 0, arr = board.boardArray(); i < arr.length; i++) {
      header.push(arr[i].join('') + latexNewLine);
    }
    header.push(footer);
    return header;
  },

  /** Returns a flattener-symbol-board. */
  gnosBoard: function(flattened, size) {
    var size = size || '12';
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gnos.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
      if (i.textLabel() && i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        symbol = gpub.diagrams.gnos.getLabelDef(i.textLabel(), i.stone(), size);
      } else if (i.mark() && i.stone()) {
        symbol = toStr(i.stone()) + '_' + toStr(i.mark());
      } else if (i.stone()) {
        symbol = toStr(i.stone());
      } else if (i.mark()) {
        symbol = toStr(i.mark());
      }

      if (symbolMap[symbol]) {
        out = symbolMap[symbol];
      } else {
        out = symbolMap.EMPTY;
      }
      var lbl = i.textLabel();
      if (lbl) {
        out = gpub.diagrams.gnos._processTextLabel(symbol, out, lbl, size);
      } else if (i.mark() && !i.stone()) {
        out = gpub.diagrams.gnos.symbolMap.markOverlap(
            symbolMap[toStr(i.base())], out);
      }
      return out;
    });
    return newBoard;
  },

  /**
   * This needs some explanation because it's kinda nuts.
   *  - I prefer the raw fonts for double-character fonts.
   *  - I prefer the GOOE style gnosb/gnosw built-ins for >3 chars (e.g., 234)
   *  - At 8 point, the tiny font looks terrible, so defer to the gnosb/gnosw
   * label: string or null
   * stone: number symbol or null
   * size: string.  Size of the gnos font
   */
  getLabelDef: function(label, stone, size) {
    var toStr = glift.flattener.symbolStr;
    size = size + ''; // Ensure a string
    if (label && /^\d+$/.test(label) && stone &&
        (size === '8' || label.length >= 3)) {
      var num = parseInt(label);
      var stoneStr = toStr(stone)
      if (num > 0 && num < 100) {
        return stoneStr + '_' + 'NUMLABEL_1_99';
      } else if (num >= 100 && num < 200) {
        return stoneStr + '_' + 'NUMLABEL_100_199';
      } else if (num >= 200 && num < 299) {
        return stoneStr + '_' + 'NUMLABEL_200_299';
      } else if (num >= 300 && num < 399) {
        return stoneStr + '_' + 'NUMLABEL_300_399';
      }
    } else if (stone && label) {
      return toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      return 'TEXTLABEL';
    }
  },

  /**
   * Apply the label to the symbol value.
   */
  _processTextLabel: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      lbl = parseInt(label) % 100;
      return symbolVal.replace('%s', lbl);
    } else {
      // Make smaller for labels 2+ characters long
      var sizeIdx = gpub.diagrams.gnos.singleCharSizeAtTen[size] || 3;
      if (label.length > 1) {
        sizeIdx--;
      }
      var sizeMod = '\\' + (gpub.diagrams.gnos.sizeArray[sizeIdx] || 'tiny');
      return symbolVal.replace('%s', sizeMod + '{' + label + '}');
    }
  }
};
gpub.diagrams.gnos.init = {
  LATEX: '\\usepackage{gnos}'
};
/**
 * Symbol map.
 */
gpub.diagrams.gnos.symbolMap = {
  /** Placeholder symbol. */
  EMPTY: '\\gnosEmptyLbl{_}',

  /** Base layer. */
  TL_CORNER: '<',
  TR_CORNER: '>',
  BL_CORNER: ',',
  BR_CORNER: '.',
  TOP_EDGE: '(',
  BOT_EDGE: ')',
  LEFT_EDGE: '\\char91',
  RIGHT_EDGE: ']',
  CENTER: '+',
  CENTER_STARPOINT: '*',

  /**
   * Stone layer. We don't display the base layer if a stone layer exists.
   */
  BSTONE: '@',
  WSTONE: '!',

  /**
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
   */
  BSTONE_TRIANGLE: 'S',
  WSTONE_TRIANGLE: 's',
  TRIANGLE: '3',
  BSTONE_SQUARE: 'S',
  WSTONE_SQUARE: 's',
  SQUARE: '2',
  BSTONE_CIRCLE: 'C',
  WSTONE_CIRCLE: 'c',
  CIRCLE: '1',
  BSTONE_XMARK: 'X',
  WSTONE_XMARK: 'x',
  XMARK: '4',
  BSTONE_TEXTLABEL: '\\gnosOverlap{@}{\\color{white}%s}',
  WSTONE_TEXTLABEL: '\\gnosOverlap{!}{%s}',
  TEXTLABEL: '\\gnosEmptyLbl{%s}',

  BSTONE_NUMLABEL_1_99: '{\\gnosb\\char%s}',
  BSTONE_NUMLABEL_100_199: '{\\gnosbi\\char%s}',
  BSTONE_NUMLABEL_200_299: '{\\gnosbii\\char%s}',
  BSTONE_NUMLABEL_300_399: '{\\gnosbiii\\char%s}',

  WSTONE_NUMLABEL_1_99: '{\\gnosw\\char%s}',
  WSTONE_NUMLABEL_100_199: '{\\gnoswi\\char%s}',
  WSTONE_NUMLABEL_200_299: '{\\gnoswii\\char%s}',
  WSTONE_NUMLABEL_300_399: '{\\gnoswiii\\char%s}',

  markOverlap: function(a, b) {
    return '\\gnosOverlap{' + a + '}{\\gnos' + b + '}';
  }
};
gpub.diagrams.igo = {
  create: function(flattened, options) {
  }
};
/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(flattened, options) {
  }
};
gpub.templates = {};

/**
 * A representation of a GPub template. Like normal HTML templating, but quite
 * a bit simpler.
 */
gpub.templates._Template = function(sections, paramMap) {
  this._sections = sections;
  this._paramMap = paramMap;
  this._paramContent = {};
};

gpub.templates._Template.prototype = {
  /** Compiles the template with the new template variables. */
  compile: function() {
    var sectionsCopy = this._sections.slice(0);
    for (var key in this._paramMap) {
      var idx = this._paramMap[key];
      var content = this._paramContent[key] || '';
      sectionsCopy[idx] = content;
    }
    return sectionsCopy.join('');
  },

  /** Returns true if the template has parameter given by 'key' */
  hasParam: function(key) {
    return !!this._paramMap[key];
  },

  /** Sets a template parameter. */
  setParam: function(key, value) {
    if (!this._paramMap[key]) {
      throw new Error('Unknown key: ' + key);
    }
    this._paramContent[key] = value.toString();
  }
};
/**
 * Basic latex template.
 */
gpub.templates.latexBase = [
'\\documentclass[letterpaper,12pt]{memoir}',
'\\usepackage{color}',
'\\usepackage{wrapfig}',
'\\usepackage{setspace}',
'\\usepackage{unicode}',
'\\usepackage[margin=1in]{geometry}',
'%%% Define any extra packages %%%',
'{{ extraPackages }}',
'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',
'%%% Extra defs',
'% Necessary for the particular digaram type.',
'{{ diagramTypeDefs }}',
'',
'%%% Diagram Figure defs.',
'% Must expose two commands',
'%  \\gofigure  (mainline diagrams)',
'%  \\godiagram (variation diagrams)',
'{{ diagramWrapperDefs }}',
'',
'%%% Define the main title %%%',
'{{ mainBookTitleDef }}',
'',
'\\begin{document}',
'',
'\\pagestyle{empty}',
'\\mainBookTitle',
'\\newpage',
'\\tableofcontents',
'',
'\\chapterstyle{section}',
'\\pagestyle{companion}',
'\\makepagestyle{headings}',
'\\renewcommand{\\printchapternum}{\\space}',
'\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
'',
'%%% The content. %%%',
'{{ content }}',
'',
'\\end{document}'].join('\n');
/**
 * Parse a latexTemplate.  LaTeX templates are only special in that they require
 * several specific parameters.  The parse step validates that these parameters
 * exist.
 */
gpub.templates.parseLatexTemplate = function(str) {
  var expectedParams = [
    'extraPackages',
    'diagramTypeDefs',
    'diagramWrapperDefs',
    'mainBookTitleDef',
    'content'
  ]
  var template = gpub.templates.parse(str);
  expectedParams.forEach(function(key) {
    if (!template.hasParam(key)) {
      throw new Error('Expected template to have key: ' + key);
    }
  });
  return new gpub.templates.LatexTemplate(template);
};

gpub.templates.LatexTemplate = function(template) {
  /** A parsed GPub template. */
  this._template = template;
};

gpub.templates.LatexTemplate.prototype = {
  setExtraPackages: function(str) {
    this._template.setParam('extraPackages', str);
    return this;
  },
  setDiagramTypeDefs: function(str) {
    this._template.setParam('diagramTypeDefs', str);
    return this;
  },
  setDiagramWrapperDefs: function(str) {
    this._template.setParam('diagramWrapperDefs', str);
    return this;
  },
  setTitleDef: function(str) {
    this._template.setParam('mainBookTitleDef', str);
    return this;
  },
  setContent: function(str) {
    this._template.setParam('content', str);
    return this;
  },
  compile: function() {
    return this._template.compile();
  }
};
/**
 * A simplistic template parser.
 */
gpub.templates.parse = function(template) {
  var sections = [];
  var paramMap = {}; // key to position
  var states = {
    DEFAULT: 'DEFAULT',
    IN_PARAM: 'IN_PARAM'
  };
  var curstate = states.DEFAULT;
  var buffer = [];
  var prev = null;
  var position = 0;
  for (var i = 0; i < template.length; i++) {
    var c = template.charAt(i);
    switch(curstate) {
      case 'DEFAULT':
        if (c === '{') {
          if (prev === '{') {
            sections.push(buffer.join(''));
            curstate = states.IN_PARAM;
            position++;
            buffer = [];
          }
          // Else move on
        } else {
          if (prev === '{') buffer.push(prev);
          buffer.push(c);
        }
        break;
      case 'IN_PARAM':
        if (c === '}') {
          if (prev === '}') {
            sections.push(null);
            var param = buffer.join('').replace(/^\s*|\s*$/g, '');
            paramMap[param] = position;
            position++;
            curstate = states.DEFAULT;
            buffer = [];
          }
          // else ignore and move on
        } else {
          buffer.push(c)
        }
        break
      default: 
        throw new Error('Unknown state: ' + curstate);
    }
    prev = c;
  }
  sections.push(buffer.join(''));
  return new gpub.templates._Template(sections, paramMap);
};
/**
 * Stub namespace. Not really used because all the API should exist at the top
 * level.
 */
gpub.api = {};
////////////////////////
// Methods in the API //
////////////////////////


/**
 * Create a book or other output from 
 *
 * SGFS: Array of SGFs.
 * options: An options array. See gpub.defaultOptions for the format.
 *
 * Returns: The completed book or document.
 */
gpub.create = function(sgfs, options) {
  // Validate input and create the options array.
  gpub._validateInputs(sgfs, options);

  // Process the options and fill in any missing values or defaults.
  options = gpub.processOptions(options);

  // Create the glift specification.
  var spec = gpub.spec.create(sgfs, options);

  // Create the finished book (or whatever that means).
  var book = gpub.book.create(spec, options)

  return book;
};

/////////////
// Private //
/////////////

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 */
gpub._validateInputs = function(sgfs, options) {
  if (!sgfs || !sgfs.length || glift.util.typeOf(sgfs) !== 'array') {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
};

/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /** See gpub.bookFormat. */
  outputFormat: 'LATEX',

  /** See gpub.bookPurpose. */
  bookPurpose: 'GAME_COMMENTARY',

  /** See glift.enums.boardRegions. */
  boardRegion: 'AUTO',

  /** See glift.diagrams.diagramType. */
  diagramType: 'GNOS',


  /** Skip the first N diagrams. Allows users to generate parts of a book. */
  skipDiagrams: 0,

  /**
   * Maximum diagrams generated -- allows users to specify a section of the
   * book. 0 indicates that all subsequent diagrams are generated.
   */
  maxDiagrams: 0,

  /**
   * Override the default template.
   * A false-y template will result in using the default template.
   */
  template: null,

  /** Options specifically for book processors */

  // TODO(kashomon): Rename this to view so that we can have the book options be
  // separate.
  bookOptions: {}
};


/**
 * The type general type of the book.  Specifes roughly how we generate the
 * Glift spec.
 */
gpub.bookPurpose = {
  /** Game with commentary. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /** Set of problems and, optionally, anwsers. */
  PROBLEM_SET: 'PROBLEM_SET'
};


/**
 * The format for gpub output.
 */
gpub.outputFormat = {
  /** Construct a book with a LaTeX format. */
  LATEX: 'LATEX',

  /** Constructs a full HTML page. This is often useful for testing. */
  HTMLPAGE: 'HTMLPAGE',

  /** Construct a book in ASCII format. */
  ASCII: 'ASCII'

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
  if (!options) {
    options = {};
  }
  for (var key in gpub.defaultOptions) {
    var val = options[key];
    if (!val) {
      options[key] = gpub.defaultOptions[key];
    }
  }
  if (options.skipDiagrams < 0) {
    throw new Error('skipDiagrams cannot be less than 0');
  }
  if (options.maxDiagrams < 0) {
    throw new Error('maxDiagrams cannot be less than 0');
  }
  return options;
};
