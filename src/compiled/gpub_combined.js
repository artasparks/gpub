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
  version: '0.1.0',

  /**
   * Whether or not debugging information is enabled.
   */
  debug: false
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
gpub.util.size = {
  /** Various conversion helpers. */
  ptToIn: function(ptSize) { return ptSize * (1 / 72); },
  ptToMm: function(ptSize) { return ptSize * 0.3528; },

  mmToPt: function(mmSize) { return mmSize * (1 / 0.3528); },
  inToPt: function(inSize) { return inSize * 72 ; },

  inToMm: function(inSize) { return inSize * 25.4; },
  mmToIn: function(mmSize) { return mmSize * (1 / 25.4); },

  /**
   * Converts a size string with units into a number. If there are no units and
   * the string's a number, we assume the number's in pt.
   *
   * Note the size-string looks <num><unit>.
   *
   * Ex: 12pt, 12mm, 1.2in
   *
   * Notes: https://www.cl.cam.ac.uk/~mgk25/metric-typo/
   */
  parseSizeToPt: function(sizeString) {
    if (typeof sizeString !== 'string') {
      throw new Error('Bad type for size string: ' + sizeString);
    }
    if (/^\d+(\.\d*)?$/.test(sizeString)) {
      return parseFloat(sizeString);
    }
    if (!/^\d+(\.\d*)?[a-z]{2}$/.test(sizeString)) {
      throw new Error('Unknown format for: ' + sizeString)
    }
    var units = sizeString.substring(sizeString.length - 2);
    var num = parseFloat(sizeString.substring(0, sizeString.length - 2));
    switch(units) {
      case 'pt':
          return num;
          break;
      case 'mm':
          return gpub.util.size.mmToPt(num);
          break;
      case 'in':
          return gpub.util.size.inToPt(num);
          break;
      default:
          throw new Error('Unknown units size: ' + sizeString)
          break;
    }
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
 * Constructs a new Diagram Context, which contains information about the
 * diagram context in which this diagram should be typeset.  It also contains
 * debug information
 */
gpub.book.newDiagramContext = function(ctype, isChapter, pdfx1a, debug) {
  return {
    contextType: ctype,
    isChapter: isChapter,
    pdfx1a: pdfx1a,
    debug: debug
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
  // TODO(kashomon): Do we need this?
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
gpub.book.getDiagramContext = function(
    mt, flattened, sgfObj, pdfx1a, debugCtx) {
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
  return gpub.book.newDiagramContext(ctxType, isChapter, pdfx1a, debugCtx);
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

  return gen._initOptions(options);
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
   * Returns:
   * {
   *  content: ...
   *  diagrams:...
   * }
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

    var defaultView = this.defaultOptions ?
        this.defaultOptions().bookOptions || {} : {};

    var globalMetadata = mt.metadata();

    // Prefer options in the following order:
    //  1. explicitly passed in options (already done)
    //  2. metadata in the SGF
    //  3. default view options
    var globalBookDefaults = gpub.defaultOptions.bookOptions;
    if (globalMetadata) {
      for (var key in globalMetadata) {
        if (globalMetadata[key] !== undefined && (
            view[key] === undefined ||
                JSON.stringify(view[key]) ===
                JSON.stringify(globalBookDefaults[key]))) {
          view[key] = globalMetadata[key];
        }
      }
    }

    if (defaultView) {
      for (var key in defaultView) {
        if (defaultView[key] !== undefined && view[key] === undefined) {
          view[key] = defaultView[key];
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
   * The function fn should expect five params:
   *  - the index
   *  - The movetree.
   *  - The 'flattened' object.
   *  - The context
   *  - A unique name for the SGF (usually the sgf alias).
   */
  forEachSgf: function(spec, fn) {
    var mgr = this.manager(spec);
    var opts = this.options();
    // 1 million diagrams should be enough for anybody ;). Users can override if
    // they really must, but millions of diagrams would imply hundreds of
    // thousands of pages.
    var max = opts.maxDiagrams ? opts.maxDiagrams : 1000000;
    var regionRestrictions = opts.regionRestrictions;
    for (var i = opts.skipDiagrams;
        i < mgr.sgfCollection.length && i < max; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var nextMoves = glift.rules.treepath.parseFragment(sgfObj.nextMovesPath);
      var sgfId = this.getSgfId(sgfObj);
      var mt = this.getMovetree(sgfObj, sgfId);
      var autoVarCrop = this._shouldPerformAutoCropOnVar(mt, nextMoves)

      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: nextMoves,
          boardRegion: sgfObj.boardRegion,
          autoBoxCropOnNextMoves: autoVarCrop,
          regionRestrictions: regionRestrictions
      });

      var debugCtx = this._getDebugCtx(
          mt, nextMoves, sgfObj.boardRegion, autoVarCrop, regionRestrictions);
      var ctx = gpub.book.getDiagramContext(
          mt, flattened, sgfObj, this.usePdfx1a(), debugCtx);

      fn(i, mt, flattened, ctx, sgfId);
    }
  },

  /**
   * Given an SGF Object, returns the SGF ID. If the alias exists, just use the
   * alias as the ID. Otherwise, use parts of the SGF String as the ID.
   */
  getSgfId: function(sgfObj) {
    var alias = sgfObj.alias;
    if (alias) {
      return alias;
    }
    var signature = this._sgfSignature(sgfObj.sgfString);
    if (signature) {
      return signature
    }
    throw new Error('SGF Object contains neither alias nor an SGF String. ' + 
        'Cannot generate an SGF Id.');
  },

  /**
   * Get a movetree. SGF Parsing is cached for efficiency.
   */
  getMovetree: function(sgfObj, id) {
    if (!this._parseCache[id]) {
      this._parseCache[id] =
          glift.rules.movetree.getFromSgf(sgfObj.sgfString);
    }
    var initPos = glift.rules.treepath.parsePath(sgfObj.initialPosition);
    return this._parseCache[id].getTreeFromRoot(initPos);
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

  /** Returns the current options */
  options: function() {
    return this._opts;
  },

  /**
   * Whether the doc should be generated as a PDF/X-1a compatible doc. This
   * should be moved to the latex stuff if possible. It's only ever going to be
   * used for latex.
   */
  usePdfx1a: function() {
    return this._opts.pdfx1a;
  },

  /**
   * Returns the debug context. This info typically gets put directly into the
   * book for, well, debugging.
   */
  _getDebugCtx: function(
      mt, nextMoves, boardRegion, autoBoxCrop, regRestrict) {
    if (!gpub.global.debug) {
      return {};
    }
    var base = {
      initialPosition:
          glift.rules.treepath.toInitPathString(mt.treepathToHere()),
      nextMoves: glift.rules.treepath.toFragmentString(nextMoves),
      boardRegion: boardRegion,
      autoBoxCrop: autoBoxCrop,
      regionRestrictions: regRestrict
    };
    return base;
  },

  /**
   * Whether autocropping on variations should be performed.
   */
  _shouldPerformAutoCropOnVar: function(mt, nextMoves) {
    var performAutoCrop = this.options().autoBoxCropOnVariation;
    nextMoves = nextMoves || [];
    if (performAutoCrop && mt.onMainline()) {
      if (nextMoves.length == 0) {
        performAutoCrop = false;
      } else {
        // It's possible that the next moves path continues on the mainline for
        // a while and then diverts to a branch, but this doesn't currently
        // happen due to the way specs are generated. Thus, we only check the
        // first move in the nextMoves path.
        performAutoCrop = nextMoves[0] > 0;
      }
    }
    return performAutoCrop;
  },

  /**
   * Set the options for the Generator. Note: The generator defensively makes
   * a copy of the options.
   */
  _initOptions: function(opts) {
    if (!opts) { throw new Error('Opts not defined'); }
    this._opts = glift.util.simpleClone(opts || {});

    var defaultOpts = {};
    if (this.defaultOptions) {
      defaultOpts = this.defaultOptions();
    }

    if (!defaultOpts) { throw new Error('Default options not defined'); }

    for (var gkey in defaultOpts) {
      if (defaultOpts[gkey] && !this._opts[gkey]) {
        this._opts[gkey] = defaultOpts[gkey];
      }
    }

    // Note: We explicitly don't drill down into the bookOptions / view so that
    // the passed-in bookOptions have the ability to take precedence.
    return this;
  },

  /**
   * Returns a signature that for the SGF that can be used in a map.
   * Method: if sgf < 100 bytes, use SGF. Otherwise, use first 50 bytes + last
   * 50 bytes.
   */
  _sgfSignature: function(sgf) {
    if (sgf === undefined) {
      throw new Error('Cannot create signature. SGF is undefined!');
    }
    if (typeof sgf !== 'string') {
      throw new Error('Improper type for SGF: ' + sgf);
    }
    if (sgf.length <= 100) {
      return sgf;
    }
    return sgf.substring(0, 50) + sgf.substring(sgf.length - 50, sgf.length);
  }
};
gpub.book.page = {};

/**
 * Enum-like type enumerating the supported page sizes.
 */
gpub.book.page.type = {
  A4: 'A4',
  /** 8.5 x 11 */
  LETTER: 'LETTER',
  /** 6 x 9 */
  OCTAVO: 'OCTAVO',
  /** 5 x 7 */
  NOTECARD: 'NOTECARD',
  /** 8 x 10 */
  EIGHT_TEN: 'EIGHT_TEN',
  /** 5.5 x 8.5 */
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE'
};

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 */
gpub.book.page.size = {
  A4: {
    heightMm: 297,
    widthMm: 210,
    widthIn: 8.268,
    heightIn: 11.693
  },
  /** Standard printer paper. */
  LETTER: {
   heightMm: 280,
    widthMm: 210,
    heightIn: 11,
    widthIn: 8.5
  },
  /**
   * 6x9. Octavo is probably the most common size for professionally printed go
   * books.
   */
  OCTAVO: {
    heightMm: 229,
    widthMm: 152,
    heightIn: 9,
    widthIn: 6
  },
  /**
   * 5x7 paper. Doesn't have an official name, as far as I know, so we'll call
   * it Notecard.
   */
  NOTECARD: {
    heightMm: 178,
    widthMm: 127,
    heightIn: 7,
    widthIn: 5
  },

  /** Miscellaneous sizes, named by the size. */
  EIGHT_TEN: {
    heightMm: 254,
    widthMm: 203,
    heightIn: 10,
    widthIn: 8
  },
  FIVEFIVE_EIGHTFIVE: {
    heightMm: 216,
    widthMm: 140,
    heightIn: 8.5,
    widthIn: 5.3
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
   * Typeset the diagram into LaTeX. This expects the diagrams to have already
   * been rendered. These methods are meant to provide page context.
   *
   * diagramType: member of gpub.diagrams.diagramType
   * diagram: The core diagram string. Needs to already have been rendered. This
   * ctx: Context object.
   *    {contextType: <gpub.book.contextType>, isChapter: <boolean>}
   * flattened: The flattened diagram object from Glift.
   *    Note: it seems a little weird to pass in the diagram and the flattened
   *    obj, since the flattened obj can regenerate the diagram. Probably should
   *    be rectified at some point.
   * intSize: Size of an intersection in Point. (1/72 of an inch)
   * pageSize: size of the page (see gpub.book.page.size).
   * ref: Reference for using in the diagram for hyperlinking
   */
  typeset: function(
      diagramType,
      diagram,
      ctx,
      flattened,
      intSize,
      pageSize,
      ref) {
    comment = flattened.comment() || '';
    label = gpub.diagrams.createLabel(flattened);

    // Render the markdown. Note: This splits the comment into a
    //  .preamble -- the header
    //  .text -- the main body of the text.
    var processedComment = comment ? gpub.book.latex.renderMarkdown(comment) : {
      preamble: '',
      text: ''
    };
    processedComment.text = gpub.diagrams.renderInline(
        diagramType, processedComment.text);

    var latexLabel = gpub.book.latex.context._createLatexLabel(ctx, flattened, ref);

    var processedLabel = gpub.book.latex.context._processLabel(
        diagramType, label, ctx, flattened, ref);

    var renderer = gpub.book.latex.context.rendering[ctx.contextType];
    if (!renderer) {
      // Should this check be removed? Why do we need it?
      renderer = gpub.book.latex.context.rendering[DESCRIPTION];
    }
    if (!intSize) {
      throw new Error('Intersection size in points not defined. Was' +
          intSize);
    }

    // Add in debug info to the comment-text.
    processedComment.text = processedComment.text +
        gpub.book.latex.context._debugInfo(ctx.debug);

    return renderer(
        diagram, ctx, processedComment, processedLabel, intSize, pageSize,
        latexLabel);
  },

  /**
   * Create a latex label for cross-referencing. Note: Labels are considered
   * annotations and thus illegal for PDF/X-1a purposes.
   */
  _createLatexLabel: function(ctx, flattened, ref) {
    if (flattened.isOnMainPath() && ref && !ctx.pdfx1a) {
      return '\\phantomsection\n\\label{' + ref + '}';
    }
    return '';
  },

  /**
   * When the debug option is set, we attach diagram-level debugging into the
   * comments.
   */
  _debugInfo: function(debug) {
    if (!gpub.global.debug) {
      return '';
    }
    var base = [
        '', // for extra spacing between original comment.
        '{\\scriptsize']
    if (debug.initialPosition) {
      base.push('ip:' + debug.initialPosition);
    }
    if (debug.nextMoves) {
      base.push('nm:' + debug.nextMoves);
    }
    if (debug.boardRegion ||
        debug.autoBoxCrop ||
        debug.regionRestrictions) {
      var buf = [];
      if (debug.boardRegion) {
        buf.push('inrg:' + debug.boardRegion)
      }
      if (debug.autoBoxCrop) {
        buf.push('boxcp:' + debug.autoBoxCrop)
      }
      if (debug.regionRestrictions) {
        buf.push('regres:' + JSON.stringify(debug.regionRestrictions));
      }
      base.push(buf.join(';'));
    }

    base.push('}');
    return base.join('\n');
  },

  /**
   * Process the label to make it appropriate for LaTeX.
   */
  _processLabel: function(diagramType, label, ctx, flattened, ref) {
    // By default we use gofigure -- which is a mainline-digaram style label.
    var baseLabel = '\\gofigure';

    if (!flattened.isOnMainPath()) {
      // We use the next main move for variations: in terms of tree-structure,
      // variations are usually commentary on their directly siblings (in the
      // 0th/top position) rather than commentary on their parents.
      //
      // Note: that this can be null if we're at the end of the tree.
      var nextMove = flattened.nextMainlineMove();
      // We're on a variation. Add a comment below the diagram and create a
      // reference label.
      baseLabel = '';
      baseLabel = '\\centerline{\\govariation'

      if (nextMove) {
        var moveNum = flattened.nextMainlineMoveNum();
        var readableColor = '';
        if (nextMove.color && nextMove.color === 'BLACK') {
          readableColor = 'Black';
        } else if (nextMove.color && nextMove.color === 'WHITE') {
          readableColor = 'White';
        }
        if (ref) {
          baseLabel += '\\hyperref[' + ref + ']{'
        }
        baseLabel += '\\textit{for} '
        baseLabel += readableColor + ' ' + moveNum;
        if (ref) {
          baseLabel += '}';
        }
      }
      baseLabel += '}';
    }

    if (label) {
      // Convert newlines into latex-y newlines
      var splat = label.split('\n');
      for (var i = 0; i < splat.length; i++ ) {
        if (i == 0) {
          baseLabel += '\n\\subtext{' + splat[i] + '}';
        } else {
          baseLabel += '\n\n\\subtext{' + splat[i] + '}';
        }
      }
    }
    baseLabel = gpub.diagrams.renderInline(diagramType, baseLabel);
    return baseLabel;
  },

  /** Render the specific digaram context. */
  rendering: {

    EXAMPLE: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
      if (!pageSize) {
        throw new Error('Page size must be defined. Was:' + pageSize);
      }
      var widthPt = gpub.util.size.inToPt(pageSize.widthIn);
      var debug = this.renderDebug
      if (pcomment.preamble) {
        return [
          pcomment.preamble,
          latexLabel,
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
          '\\begin{minipage}[t]{' + 20*pts + 'pt}',
          latexLabel,
          diagram,
          label,
          '\\end{minipage}',
          '\\begin{minipage}[t]{' + (0.85*widthPt - 21*pts) +'pt}',
          '\\setlength{\\parskip}{0.5em}',
          pcomment.text,
          '\\end{minipage}',
          '\\vfill'].join('\n');
      }
    },

    DESCRIPTION: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
      return [
        pcomment.preamble,
        pcomment.text,
        '\\vfill'
      ].join('\n');
    },

    PROBLEM: function(
        diagram, ctx, pcomment, label, pts, pageSize, latexLabel) {
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

    // Diagram Options
    var diagOpt = {
      // Intersection size in pt.
      size: gpub.util.size.parseSizeToPt(opts.goIntersectionSize)
    };

    var pages = new gpub.book.latex.Paging(
      opts.pageSize, diagOpt.size);

    view.init = [
      gpub.diagrams.getInit(opts.diagramType, 'LATEX'),
      pages.pagePreamble()
    ].join('\n');

    if (this.usePdfx1a()) {
      view.pdfx1a = this.usePdfx1a();
      view.pdfxHeader = gpub.book.latex.pdfx.header(
          view.title, opts.colorProfileFilePath, opts.pageSize);
    }

    this.forEachSgf(spec, function(idx, mt, flattened, ctx, sgfId) {
      var diagram = gpub.diagrams.create(flattened, opts.diagramType, diagOpt);
      pages.addDiagram(opts.diagramType, diagram, ctx, flattened, sgfId);
    }.bind(this));

    view.content = pages.flushAll();

    this._processBookSections(view.frontmatter);
    this._processBookSections(view.appendices);

    return gpub.Mustache.render(this.template(), view);
  },

  /**
   * Processes the frontmatter or appendices. In otherwords, does escaping and,
   * in particular for the copyright object, constructs a couple new fields.
   *
   * TODO(kashomon): Clean this up. The generateToc and copyright sections are,
   * in particular, ugly and non-standard.
   */
  _processBookSections: function(section) {
    var escape = function(val) {
      return val.replace(/([${%}&#\\])/g, function(m, g1) { return '\\' + g1 });
    };

    // Convert all frontmatter/appendices from markdown to LaTeX.
    for (var key in section) {
      if (section[key]
          && key !== 'copyright'
          && key !== 'generateToc' ) {
        section[key] =
            gpub.book.latex.renderMarkdown(section[key]);
      } else if (key === 'copyright') {
        for (var ckey in section.copyright) {
          var val = section.copyright[ckey];
          if (ckey === 'addressLines') {
            var publisher = section.copyright.publisher ?
                [section.copyright.publisher] : [];
            var constructed = publisher.concat(val);
            section.copyright.constructedAddress = constructed
                .map(escape)
                .join('\n\\\\');
          } else if (ckey === 'printingRunNum' &&
              glift.util.typeOf(val) === 'number') {
            var out = [];
            var end = 10;
            if (end - val < 5) {
              end = val + 5;
            }
            for (var i = val; i <= end; i++) {
              out.push(i);
            }
            section.copyright.constructedPrintingRun = out.join(' ');
          } else if (glift.util.typeOf(val) === 'string') {
            section.copyright[ckey] = escape(val);
          }
        }
      }
    }
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return gpub.book.latex.options();
  }
};
gpub.book.latex.defaultTemplate = [
'{{=<% %>=}}', // Change the tag-type to ERB
'\\documentclass[letterpaper,12pt]{memoir}',
'\\usepackage{color}',
'\\usepackage{wrapfig}',
'\\usepackage{setspace}',
'\\usepackage[cmyk]{xcolor}',
'\\usepackage{graphicx}',
'<%^pdfx1a%>',
'\\usepackage{hyperref}',
'<%/pdfx1a%>',
'\\usepackage{xmpincl}',
'<%#frontmatter.copyright.showPermanenceOfPaper%>',
'\\usepackage{tikz}',
'<%/frontmatter.copyright.showPermanenceOfPaper%>',
'',
'\\usepackage[margin=1in]{geometry}',
'',
'<%#pdfx1a%>',
'%%% PDF/X-1a Header',
'<%&pdfxHeader%>',
'<%/pdfx1a%>',
'',
'%%% Define any extra packages %%%',
'<%init%>',
'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',
'%%% Diagram Figure defs.',
'% Must expose two commands',
'%  \\gofigure  (mainline diagrams)',
'%  \\godiagram (variation diagrams)',
'% Mainline Diagrams. reset at parts',
'\\newcounter{GoFigure}[part]',
'',
'\\newcommand{\\gofigure}{%',
' \\stepcounter{GoFigure}',
' \\centerline{\\textit{\\textbf{Diagram \\arabic{GoFigure}}}}',
'}',
'',
'% Variation Diagrams. reset at parts.',
'\\newcounter{GoVariation}[part]',
'',
'\\newcommand{\\govariation}{%',
' \\stepcounter{GoVariation}',
' \\textit{Variation \\arabic{GoVariation}}',
'}',
'',
'\\newcommand{\\subtext}[1]{\\centerline{\\textit{#1}}}',
'',
'%%% Define the main title %%%',
'\\definecolor{light-gray}{gray}{0.55}',
'\\newcommand*{\\mainBookTitle}{\\begingroup',
'  \\raggedleft',
'  <%#authors%>',
'     {\\Large{<%.%>}} \\\\',
'     \\vspace*{1 em}',
'  <%/authors%>',
'  \\vspace*{5 em}',
'  {\\textcolor{light-gray}{\\Huge{<%title%>}}}\\\\',
'  \\vspace*{\\baselineskip}',
'  <%#subtitle%>',
'  {\\small \\bfseries <%subtitle%> }\\par',
'  <%/subtitle%>',
'  \\vfill',
'  <%#publisher%>',
'  {\\Large{<%publisher%>}}\\par',
'  \\vspace*{2\\baselineskip}',
'  <%/publisher%>',
'  <%#year%>',
'  {\\large{<%year%>}}\\par',
'  \\vspace*{2\\baselineskip}',
'  <%/year%>',
'\\endgroup}',

' %%% Chapter settings %%%',
//'\\pagestyle{empty}',
//'\\chapterstyle{section}', -- the old style
//'\\chapterstyle{demo2}', -- 2 hrules
// other options for chapter styles:
// bringhurst,crosshead,default,dowding,memman,komalike,ntglike,tandh,wilsondob
'\\chapterstyle{madsen}',
// Muck with the chapter number. The standard madsen style has the numbers off
// the edge of the header box. That works fine until you want to print at
// smaller sizes (e.g., 6x9).
'\\renewcommand*{\\printchapternum}{%',
'  \\resizebox{!}{3ex}{%',
'      {\\hspace{0.2em}\\chapnamefont\\bfseries\\sffamily\\thechapter}%',
'  }%',
'}%',

// openany, openright, openleft
'\\openany',
'\\makepagestyle{headings}',
'\\setlength{\\headwidth}{\\textwidth}',
'\\makeevenhead{headings}{\\thepage}{}{\\slshape\\leftmark}',
'\\makeoddhead{headings}{\\slshape\\rightmark}{}{\\thepage}',
'\\makerunningwidth{headings}[\\textwidth]{\\textwidth}',
'',
'\\pagestyle{companion}',
'\\makerunningwidth{companion}{\\headwidth}',
//'\\renewcommand{\\printchapternum}{\\space}', -- Force no chapter nums

'',
////////////////////////
// Start the document //
////////////////////////
'\\begin{document}',
'%%% The Frontmatter. %%%',
'\\pagestyle{empty}',
'\\mainBookTitle',
'\\cleartoverso',
'',
'<%#frontmatter.copyright%>',
'% Copyright Page',
'\\begin{vplace}[0.7]',
'\\footnotesize{',
'\\textcopyright\\ <%frontmatter.copyright.publishYear%> by <%frontmatter.copyright.publisher%> \\\\',
'<%frontmatter.copyright.license%> Published <%frontmatter.copyright.publishYear%> \\\\',
'First edition published <%frontmatter.copyright.firstEditionYear%>.\\\\',
'\\\\',
'<%&frontmatter.copyright.constructedAddress%>\\\\',
'\\\\',
'<%#frontmatter.copyright.constructedPrintingRun%>',
'<%frontmatter.copyright.constructedPrintingRun%>\\\\',
'<%/frontmatter.copyright.constructedPrintingRun%>',
'\\\\',
'<%#frontmatter.copyright.isbn%>',
'ISBN: <%frontmatter.copyright.isbn%> \\\\',
'<%/frontmatter.copyright.isbn%>',
'<%#frontmatter.copyright.issn%>',
'ISSN: <%frontmatter.copyright.issn%> \\\\',
'<%/frontmatter.copyright.issn%>',
'\\\\',
'\\\\',
'<%#frontmatter.copyright.showPermanenceOfPaper%>',
'\\tikz\\node[circle,draw,inner sep=.1ex] {\\tiny{$\\infty$}};',
'This paper meets or exceeds the requirements',
'of \\textsc{ansi/niso z39.48-1992} \\\\',
'(Permanence of Paper). \\\\',
'<%/frontmatter.copyright.showPermanenceOfPaper%>',
'\\\\',
'\\\\',
'\\\\',
'Created using LaTeX generated by GPub.js.',
'}\\\\',
'\\end{vplace}',
'<%/frontmatter.copyright%>',
'\\cleartorecto',
//'\\cleartoverso',
'',
'<%#frontmatter.generateToc%>',
'\\tableofcontents*',
'<%/frontmatter.generateToc%>',
'\\pagestyle{companion}',
'\\frontmatter',
'',
'<%#frontmatter.foreword%>',
'\\chapter{Foreward}',
'<%&frontmatter.foreword.text%>',
'<%/frontmatter.foreword%>',
'',
'<%#frontmatter.preface%>',
'\\chapter{Preface}',
'<%&frontmatter.preface.text%>',
'<%/frontmatter.preface%>',
'',
'<%#frontmatter.acknowledgements%>',
'\\chapter{Acknowledgments}',
'<%&frontmatter.acknowledgements.text%>',
'<%/frontmatter.acknowledgements%>',
'',
'<%#frontmatter.introduction%>',
'\\chapter{Introduction}',
'<%&frontmatter.introduction.text%>',
'<%/frontmatter.introduction%>',
'',
'%%% The content. %%%',
'\\mainmatter',
'<%&content%>',
'',
'\\appendix',
'<%#appendices.glossary%>',
'\\chapter{Glossary}',
'<%&appendices.glossary.text%>',
'<%/appendices.glossary%>',
'',
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

  // Now we need to post-process and escape #
  text = text.replace(/#/g, '\\#');

  return {
    preamble: renderer.extractPreamble(),
    text: text
  };
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
    } else if (level === 4) {
      this._preamble.push('\\section{' + text + '}');
    } else {
      // A chapter heading without
      this._preamble.push('\\section*{' + text + '}');
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
    return '\\newline{}';
  },

  /** href: string, title: string, text: string */
  // requires: \usepackage{hyperref}
  link: function(href, title, text) {
    // For new, we just return the url.
    return href;
  },

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
/**
 * Latex options defaults.
 */
gpub.book.latex.options = function() {
  return {
    diagramType: gpub.diagrams.diagramType.GNOS,
    bookOptions: {
    }
  }
}
/**
 * (Currently Experimental) Page wrapper.
 *
 * A page is just that: a representation of a page. The page has knowledge of
 * its margins, bleed, trim, and stock size. From that we can determine where
 * to place text and go diagrams.
 *
 * How they work together:
 *  |Bleed |Trim |Margin
 *
 * Bleed: the part that will be cut off. Note that bleed should only apply to
 *    the outside edges.
 * Trim: the part of the book actually shown (not trimmed). This is also known
 *    as the 'final size'.
 * Margin: the whitespace border around the text.
 *
 * Sometimes you'll see the term 'stock size'.  This simply refers to the paper
 * size.
 *
 * Note: by default, we don't assume bleed.
 */

/**
 * The paging instance is a factory for pages.  We want all pages to share the
 * same properties.  Thus, the purpose of this factory.
 *
 * pageType: A member of gpub.book.page.type;
 * intersectionSize: In point-size. Note that 1 pt = 1/72 of an inch. Note: Not
 *    all diagram styles support all point sizes.
 * margins: Optional. Right/Left margin in inches. Currently pretty crude.
 * bleed: Optional. Not used at the moment.
 */
gpub.book.latex.Paging = function(
    pageType,
    intersectionSize,
    margins,
    bleed) {
  this.buffer = [];

  /** Size of the pages produced by the paging factory. */
  // TODO(kashomon): why is this guarded?
  this.pageSize = pageType ||
      gpub.book.page.type.LETTER;

  if (!gpub.book.page.type[this.pageSize] ||
      !gpub.book.page.size[this.pageSize]) {
    throw new Error('Unknown page size: ' + this.pageSize);
  }

  // TODO(kashomon): Support margins.
  this.margins = margins ||
      gpub.book.latex.defaultMargins;

  /** Size of the go-board intersections in pt. */
  this.intSize = intersectionSize;

  /** The bleed amount in inches. Exterior edges only. */
  this.bleed = bleed || 0;

  /** The current page, for the purposes of adding diagrams */
  // CURRENTLY UNUSED
  this.currentPage = null;

  /** Total pages, minus the current page*/
  // CURRENTLY UNUSED
  this.pages = [];

  /**
   * Map from some key to some reference value. For games this might be
   * movenumber > diagram Id
   */
  this._diagramRefMap = {};
};

gpub.book.latex.Paging.prototype = {
  /**
   * Adds a diagram to the paging tracker.
   */
  addDiagram: function(
      diagramType,
      diagramString,
      context,
      flattened,
      sgfId) {
    this._populateRefMap(flattened, sgfId, context);
    var ref = this._getReference(flattened, context);
    var contextualized = gpub.book.latex.context.typeset(
        diagramType,
        diagramString,
        context,
        flattened,
        this.intSize,
        gpub.book.page.size[this.pageSize],
        ref);
    this.buffer.push(contextualized);
  },

  /** Populate the reference map based on the context type. */
  _populateRefMap: function(flattened, sgfId, context) {
    sgfId = gpub.book.latex.sanitize(sgfId);
    if (context.contextType === gpub.book.contextType.EXAMPLE) {
      if (flattened.isOnMainPath()) {
        // We have to choose some move number to represent the diagram. Might as
        // well be the starting number.
        var label = sgfId + ':mainmove-' + flattened.startingMoveNum();
        for (var i = flattened.startingMoveNum();
            i <= flattened.endingMoveNum();
            i++) {
          this._diagramRefMap[i] = label;
        }
      }
    }
  },

  /** Gete the reference label for latex. Return null if no ref can be found. */
  _getReference: function(flattened, context) {
    if (context.pdfx1a) {
      return null;
    }
    if (context.contextType === gpub.book.contextType.EXAMPLE) {
      var mainMove = flattened.mainlineMove();
      if (!flattened.isOnMainPath() && mainMove !== null) {
        return this._diagramRefMap[flattened.nextMainlineMoveNum()] || null;
      } else if (flattened.isOnMainPath()) {
        return this._diagramRefMap[flattened.startingMoveNum()] || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  /** Flush the pages buffer as a string. */
  flushAll: function() {
    return this.buffer.join('\n');
  },

  /**
   * Returns the relevant latex preamble. Should be added to the document
   * before page construction.
   */
  pagePreamble: function() {
    var size = gpub.book.page.size[this.pageSize];
    return [
      '%%% Page Settings Preamble %%%',
      // this.bleed ? this._trimSetting() : '',
      '\\setstocksize{' + size.heightIn + 'in}{' + size.widthIn + 'in}',
      '\\settrimmedsize{\\stockheight}{\\stockwidth}{*}',
      '\\settypeblocksize{0.85\\stockheight}{0.85\\stockwidth}{*}',
      '\\setulmargins{*}{*}{1.618}',
      '\\setlrmargins{*}{*}{1}',
      '\\setheaderspaces{*}{*}{1.618}',
      '\\checkandfixthelayout', // Must be last

      '%%% End Page Settings Preamble %%%'
    ].join('\n');
  },

  /**
   * Sets the page size for the memoir class. I.e., returns the relevant latex
   * command.
   */
  _pageSizeSetting: function() {
    var size = gpub.book.page.size[this.pageSize];
    return '\\setstocksize' +
      '{' + size.heightIn + 'in}' +
      '{' + size.widthIn + 'in}';
  },

  /**
   * Sets the margins on the page: Returns the relevant latex command.
   * Note: this is probably the least elegant way of setting the margins. The
   * memoir class has lots of machinery for set margins using a ratio setting.
   */
  _marginSetting: function() {
    // Currently we don't set the vertical margin, but could be set with
    // \setulmarginsandblock
    return '\\setlrmarginsandblock{' + this.margins + 'in}{' +
        this.margins + 'in}{*}';
  },

  /**
   * Set the trims/bleeds. This is the amount that's cut (or trimmed) from the
   * page and thus doesn't show up in the finished product.
   *
   * Since professional printers can print at trim (no bleed), we
   */
  _trimSetting: function() {
    // For now we assume that we're printing at trim. In otherwords, that we're
    // not using bleed.
    return '\\settrims{' + this.bleed + 'in}{' + this.bleed + 'in}';
  },

  /**
   * Returns
   * {
   *  rows: X (as float).
   *  cols: X (as float).
   * }
   */
  _calculateUnits: function() {
    var intPt = this.intersectionSize;
    var inchesPer = initPt / 72;
    var sizeObj = gpub.book.page.sizeMapping[this.pageSize];
    var interiorWidth = (sizeObj.widthIn - 2 * this.margins) / inchesPer;
    var interiorHeight  = (sizeObj.heightIn- 2 * this.margins) / inchesPer;
    return {
      cols: interiorWidth,
      rows: interiorHeight
    };
  }
};


/**
 * Default margin amounts, in inches.
 */
gpub.book.latex.defaultMargins = 0.5;

/**
 * Base bleed amount, in inches. Note: This is not the default, simple the
 * standard bleed amount. Note that printers want bleed on only exterior
 * edges
 */
gpub.book.latex.standardBleed  = 0.125;
/**
 * Package for Pdf/X-1a:2001 compatibility.
 *
 * This is a package to add support for the above mentioned compatibility, which
 * is required by some professional printers.
 *
 * Requirements (from http://www.prepressure.com/pdf/basics/pdfx-1a):
 *
 * http://tex.stackexchange.com/questions/242303/pdf-x-1a-on-tex-live-2014-for-publishing-with-pod-lightining-source
 *
 * Requirements that we care about:
 * - PDF/X-1a files are regular PDF 1.3 or PDF 1.4
 * - All color data must be grayscale, CMYK or named spot colors. The file
 *   should not contain any RGB, LAB,… data.
 * - Can't use hyperref annotations.
 * - Have to change the stream compression to 0.
 *
 * Requirements should be taken care of
 * - All fonts must be embedded in the file. -- Handled by LaTeX by default
 * - OPI is not allowed in PDF/X-1a files.
 *
 * Should be irrelevant:
 * - If there are annotations (sticky notes) in the PDF, they should be located
 *   outside the bleed area.
 * - The file should not contain forms or Javascript code.
 * - Compliant files cannot contain music, movies or non-printable annotations.
 * - Only a limited number of compression algorithms are supported.
 * - Encryption cannot be used.
 * - Transfer curves cannot be used.
 *
 * For details, see https://github.com/Kashomon/gpub/issues/23
 */
gpub.book.latex.pdfx = {
  /**
   * Fixes this error:
   * "Compressed object streams used"
   */
  compressLevel: '\\pdfobjcompresslevel=0',

  /**
   * Fixes this error:
   * "PDF version is newer than 1.3"
   */
  pdfMinorVersion: '\\pdfminorversion=3',

  /**
   * Fixes the error:
   * "OutputIntent for PDF/X missing"
   *
   * typicacally, the colorProfileFilePath should be something like:
   * 'ISOcoated_v2_300_eci.icc'
   */
  outputIntent: function(colorProfileFilePath) {
    colorProfileFilePath = colorProfileFilePath || 'ISOcoated_v2_300_eci.icc';
    return [
      '\\immediate\\pdfobj stream attr{/N 4} file{' + colorProfileFilePath + '}',
      '\\pdfcatalog{%',
      '/OutputIntents [ <<',
      '/Type /OutputIntent',
      '/S/GTS_PDFX',
      '/DestOutputProfile \\the\\pdflastobj\\space 0 R',
      '/OutputConditionIdentifier (ISO Coated v2 300 (ECI))',
      '/Info(ISO Coated v2 300 (ECI))',
      '/RegistryName (http://www.color.org/)',
      '>> ]',
      '}'
    ];
  },

  /**
   * Returns the PDF Info, which contains the title and spec (PDF/X-1a:2101)
   * Fixes:
   *  - "Document title empty/missing",
   *  - "PDF/X version key (GTS_PDFXVersion) missing"
   */
  pdfInfo: function(title) {
    return [
      '\\pdfinfo{%',
      '/Title(' + title + ')%',
      '/GTS_PDFXVersion (PDF/X-1:2001)%',
      '/GTS_PDFXConformance (PDF/X-1a:2001)%',
      '}'
    ];
  },

  /**
   * Returns the relevant page boxes.
   */
  pageBoxes: function(pageSize) {
    var pageObj  = gpub.book.page.size[pageSize];
    var hpt = gpub.util.size.mmToPt(pageObj.heightMm);
    var wpt = gpub.util.size.mmToPt(pageObj.widthMm);
    return [
      '\\pdfpageattr{/MediaBox[0 0 ' + wpt + ' ' + hpt + ']',
      '              /BleedBox[0 0 ' + wpt + ' ' + hpt + ']',
      '              /TrimBox[0 0 ' + wpt + ' ' + hpt + ']}'
    ];
  },

  header: function(title, colorProfile, pageSize) {
    var pdfx = gpub.book.latex.pdfx;
    if (!colorProfile) {
      throw new Error('Color profile file path not specified:' + colorProfile);
    }
    if (!pageSize || !gpub.book.page.size[pageSize]) {
      throw new Error('Pagesize not defined or invalid:' + pageSize);
    }
    return [
      pdfx.pdfMinorVersion,
      pdfx.compressLevel
    ]
      .concat(pdfx.pageBoxes(pageSize))
      .concat(pdfx.pdfInfo(title))
      .concat(pdfx.outputIntent(colorProfile))
      .join('\n');
  }
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
 * Generate an EPub book.
 *
 * A Hello-World EPub Book is a zip file that has the following structure:
 *
 * mimetype
 * META-INF/container.xml
 * Content/HelloWorld.opf
 * Content/HelloWorld.xhtml
 *
 * EPUb Overview: http://www.idpf.org/epub/30/spec/epub30-overview.html
 * See http://www.idpf.org/epub/301/spec/ for more details.
 *
 * Notes:
 * - EPub 3 supports fixed layouts: http://www.idpf.org/epub/301/spec/#sec-fxl
 */
gpub.book.epub = {};

/**
 * Generator methods for the EPub page.
 */
gpub.book.epub.generator = {
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
      case 'PROBLEM_BOOK':
        return gpub.spec.problemBook;
      default:
        throw new Error('Unsupported book purpose: ' + bookPurpose);
        break;
    }
  },

  /**
   * Creates a glift spec from an array of sgf data. At this point, we assume
   * the validity of the options passed in. In other words, we expect that the
   * options have been processed by the API.
   *
   * sgfs: Array of SGF strings.
   * options: Options object.
   *
   * - bookPurpose: required
   * - boardRegion: required. Usually AUTO or ALL.
   */
  create: function(sgfs, options) {
    var spec = glift.util.simpleClone(gpub.spec._defaultSpec);
    if (!options.bookPurpose) {
      throw new Error('Book Purpose must be defined');
    }
    var processor = gpub.spec._getSpecProcessor(options.bookPurpose);

    spec.sgfDefaults = glift.util.simpleClone(
        glift.widgets.options.baseOptions.sgfDefaults);
    processor.setHeaderInfo(spec);

    for (var i = 0; sgfs && i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      var mt = glift.parse.fromString(sgfStr);
      var alias = 'sgf:' + i;
      if (mt.properties().contains('GN')) {
        alias = mt.properties().getOneValue('GN') + ':' + i;
      }
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
      if (!mt.properties().getComment() && node.numChildren() > 0) {
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
 * A gpub spec processor for problem meant to go into books. I expect that this
 * will be used as a just-in-time processor during book generation.
 */
gpub.spec.problemBook = {
  setHeaderInfo: function(spec, options) {
    spec.sgfDefaults.widgetType = glift.enums.widgetTypes.EXAMPLE;
    return spec;
  },

  processOneSgf: function(mt, alias, options) {
  },

  processProblemDef: function(mt, alias, options) {
  },

  processCorrect: function(mt, alias, options) {
  },

  processIncorrect: function(mt, alias, options) {
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
     * Sensei's library ASCII variant.
     */
    SENSEIS_ASCII: 'SENSEIS_ASCII',
    /**
     * GPUB's ASCII variant.
     */
    GPUB_ASCII: 'GPUB_ASCII',

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
    PDF: 'PDF',
    /**
     * Generate SVG Diagrams.
     */
    SVG: 'SVG'
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

  /** Renders go stones that exist in a block of text. */
  renderInline: function(diagramType, text) {
    return this._getPackage(diagramType).renderInline(text);
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
   * A flattener helper.  Returns a glift Flattened object, which is key for
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
   * Regex for determining if a text should be considered an inline label.
   *
   * Roughly we look for Black or White followed by a valid label. Then, we
   * check to make sure the next character is one of:
   * 1. The end of the line
   * 2. Whitespace
   * 3. Some form of punctuation
   *
   * Valid labels
   * - Black A blah
   * - White 32
   * - Black (A)
   * - White (126)
   * - Black (x)
   */
  inlineLabelRegex: new RegExp(
      '(Black|White) ' +
      '([A-Z]|([0-9]{1,3})|(\\(([A-Za-z]|[0-9]{1,3})\\)))' +
      '(?=($|\\n|\\r|\\s|["\',:;.$?~`<>{}\\[\\]()!@_-]))',
      ''),

  /**
   * Supply a fn to replace stones found within text.
   *
   * Functions passed to inlineReplacer should have the form:
   * - Fullmatch,
   * - Black/White
   * - Label
   *
   * Returns new text with the relevant replacements.
   */
  inlineLabelRegexGlobal_: null,
  replaceInline: function(text, fn) {
    if (!gpub.diagrams.inlineLabelRegexGlobal_) {
      gpub.diagrams.inlineLabelRegexGlobal_ = new RegExp(
          gpub.diagrams.inlineLabelRegex.source, 'g');
    }
    var reg = gpub.diagrams.inlineLabelRegexGlobal_;
    return text.replace(reg, function(full, player, label) {
      if (/^\(.\)$/.test(label)) {
        label = label.replace(/^\(|\)$/g, '');
      }
      return fn(full, player, label);
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
   * {
   *    color: <color>,
   *    mvnum: <number>,
   *    label: <str label>,
   *    collisionStoneColor: <str label>,
   * }
   *
   * returns: stringified label format.
   */
  _constructLabel: function(collisions, isOnMainline, startNum, endNum) {
    var baseLabel = '';

    if (isOnMainline) {
      // If we're on the mainline branch, construct a label that's like:
      // (Moves: 1-12)
      // or 
      // (Move: 32)
      var nums = [startNum];
      if (startNum !== endNum) {
        // Note: Currently the API is such that if there's only one move, then
        // startNum == endNum.
        nums.push(endNum);
      }
      var moveLabel = nums.length > 1 ? 'Moves: ' : 'Move: ';
      baseLabel += '(' + moveLabel + nums.join('-') + ')';
    }

    // No Collisions! Woohoo
    if (collisions == null || collisions.length === 0) {
      return baseLabel;
    }

    // First we collect all the labels by type, being careful to perserve the
    // ordering in which the labels came in.
    var labelToColArr = {};
    var labelToColStoneColor = {};
    var labelOrdering = [];
    for (var i = 0; i < collisions.length; i++) {
      var c = collisions[i];
      if (!labelToColArr[c.label]) {
        labelOrdering.push(c.label);
        labelToColArr[c.label] = [];
      }
      if (!labelToColStoneColor[c.label]) {
        labelToColStoneColor[c.label] = c.collisionStoneColor;
      }
      labelToColArr[c.label].push(c);
    }

    // Now we construct rows that look like:
    //
    // Black 13, White 16, Black 19 at White (a)
    // Black 14, White 17, Black 21 at Black 3
    var allRows = []
    for (var k = 0; k < labelOrdering.length; k++) {
      var label = labelOrdering[k];
      var colArr = labelToColArr[label];
      var row = [];
      for (var i = 0; i < colArr.length; i++) {
        var c = colArr[i];
        var color = c.color === glift.enums.states.BLACK ? 'Black' : 'White';
        row.push(color + ' ' + c.mvnum);
      }
      var colStoneColor = labelToColStoneColor[label];
      colStoneColor = (colStoneColor === glift.enums.states.BLACK ?
          'Black' : 'White');

      // In the rare case where we construct labels, convert a to (a) so it can
      // be inline-rendered more easily. This has the downside that it makes
      // labels non-uniform, so we may eventually want to make all labels have
      // the form (<label>).
      if (/^[a-z]$/.test(label)) {
        label = '(' + label + ')';
      }
      var rowString = row.join(', ') + ' at ' + colStoneColor + ' ' + label;
      allRows.push(rowString);
    }
    if (baseLabel) { baseLabel += '\n'; }

    if (allRows.length >= 4) {
      // This means there are collisions at 4 separate locations, so to reduce
      // space, concerns, try to squash some of the lines together.  Note that
      // this is, usually pretty rare. It means that the user is generating
      // diagrams with lots of moves (see examples/yearbook_example).
      allRows = gpub.diagrams._compactifyLabels(allRows);
    }

    baseLabel += allRows.join(',\n') + '.';
    return baseLabel;
  },

  /**
   * Compactify collision rows from _constructLabel. This is an uncommon
   * edgecase for the majority of diagrams; it means that there were captures +
   * plays at many locations.
   *
   * To preserve space, this method collapses labels that look like Black 5 at
   * White 6\n, Black 7, White 10 at Black 3. into one line.
   */
  _compactifyLabels: function(collisionRows) {
    var out = [];
    var buffer = null;
    // Here we overload the usage of replaceInline to count the number labels in
    // a row.
    var numInlineLabels = function(row) {
      var count = 0;
      gpub.diagrams.replaceInline(row, function() {
        count += 1;
      });
      return count;
    };
    for (var i = 0; i < collisionRows.length; i++) {
      var row = collisionRows[i];
      var rowIsShort = true;
      var numLabels = numInlineLabels(row);
      // Note 2 labels is the minimum. Here, we arbitrarily decide that 3 labels
      // also counts as a short label.
      if (numLabels > 3) {
        rowIsShort = false;
      }
      if (!buffer && !rowIsShort) {
        out.push(row);
        buffer = null;
      } else if (!buffer && rowIsShort) {
        buffer = row;
      } else if (buffer && rowIsShort) {
        out.push(buffer + '; ' + row);
        buffer = null;
      } else if (buffer && !rowIsShort) {
        out.push(buffer);
        out.push(row);
        buffer = null;
      }
    }
    if (buffer) {
      // Flush any remaining buffer;
      out.push(buffer);
    }
    return out;
  }
};
/**
 * The diagrams creator interface.
 */
gpub.diagrams.creator = {
  /**
   * Create diagram from a flattened display.
   */
  create: function(flattened, options) {},

  /** Renders go stones that exist in a block of text. */
  renderInline: function(text, options) {}
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

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // TODO(kashomon): Implement at some point. See gnos for an example.
    return text;
  },

  ///////////////////////
  // 'private' helpers //
  ///////////////////////

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
  BSTONE_TRIANGLE: '\\0??T',
  WSTONE_TRIANGLE: '\\0??t',
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
gpub.diagrams.gpubAscii = {
  create: function(flattened, opts) {
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gpubAscii.symbolMap;

    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base());
      if (i.textLabel() &&
          i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        var label = i.textLabel();
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
    });

    var out = [];
    for (var i = 0, arr = newBoard.boardArray(); i < arr.length; i++) {
    }
    return out;
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for ascii rendering.
    return text;
  }
};
gpub.diagrams.gpubAscii.symbolMap = {
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
   * Marks and StoneMarks layer.
   */
  BSTONE_TRIANGLE: 'D',
  WSTONE_TRIANGLE: 'd',
  TRIANGLE: 'T',

  BSTONE_SQUARE: 'Q',
  WSTONE_SQUARE: 'q',
  SQUARE: 'S',

  BSTONE_CIRCLE: 'E',
  WSTONE_CIRCLE: 'e',
  CIRCLE: 'C',

  BSTONE_XMARK: 'A',
  WSTONE_XMARK: 'a',
  XMARK: 'M',

  // Note: BStone and WStone text labels don't really work and should be ignored
  // and just rendered as stones, unless they're numbers between 1-10
  BSTONE_TEXTLABEL: '#',
  WSTONE_TEXTLABEL: '*',
  TEXTLABEL: '@'
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
   * We expect flattened and options to be defined.
   */
  create: function(flattened, options) {
    options.size = options.size || gpub.diagrams.gnos.sizes['12'];
    return gpub.diagrams.gnos.gnosStringArr(flattened, options.size).join('\n');
  },

  _inlineWrapper: '{\\raisebox{-.17em}{\\textnormal{%s}}}',

  /**
   * Render go stones that exist in a block of text.
   *
   * In particular, replace the phrases Black \d+ and White \d+ with
   * the relevant stone symbols i.e. Black 123 => \\gnosbi\\char23
   */
  renderInline: function(text, options) {
    var options = options || {}; // TODO(kashomon): Remove hack. Push up a level.
    var fontsize = gpub.util.size.parseSizeToPt(
        options.goIntersectionSize || gpub.diagrams.gnos.sizes['12']);
    fontsize = Math.round(fontsize);
    // TODO(kashomon): The font size needs to be passed in here so we can select
    // the correct label size. Moreover, we need to use get getLabelDef to be
    // consistent between the diagram and inlined moves.
    return gpub.diagrams.replaceInline(text, function(full, player, label) {
      var stone = null;
      if (player === 'Black') {
        stone = glift.flattener.symbols.BSTONE;
      } else if (player === 'White') {
        stone = glift.flattener.symbols.WSTONE;
      } else {
        return fullmatch; // Shouldn't ever happen.
      }
      var labelSymbol = gpub.diagrams.gnos.getLabelDef(label, stone, fontsize);
      var labelSymbolVal = gpub.diagrams.gnos.symbolMap[labelSymbol];
      var processed = gpub.diagrams.gnos._processTextLabel(
          labelSymbol, labelSymbolVal, label, fontsize);
      return gpub.diagrams.gnos._inlineWrapper.replace('%s', processed);
    });
  },

  ///////////////////////
  // 'private' helpers //
  ///////////////////////
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

  /**
   * Returns a flattener-symbol-board that's been transformed for into a
   * series of latex/gnos symbols.
   */
  gnosBoard: function(flattened, size) {
    var size = size || '12';
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gnos.symbolMap;
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // By default: Show the base symbol
      if (i.textLabel() && i.mark() &&
          i.mark() === glift.flattener.symbols.TEXTLABEL) {
        symbol = gpub.diagrams.gnos.getLabelDef(
            flattened.autoTruncateLabel(i.textLabel()), i.stone(), size);
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
      var lbl = flattened.autoTruncateLabel(i.textLabel());
      if (lbl) {
        out = gpub.diagrams.gnos._processTextLabel(
            symbol, out, lbl, size, true);
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
      } else {
        return toStr(stone) + '_' + 'TEXTLABEL';
      }
    } else if (stone && label) {
      return toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      return 'TEXTLABEL';
    }
  },

  /**
   * Apply the label to the symbol value. There are two cases:
   *
   * (1) Numbers using built-in Gnos NUMBLABEL fonts
   * We have special fonts for (gnosbi,gnoswii, etc.) that use the format
   * \\gnosbi\char{2}\d. Tho Gnos fonts accept precisely two characters.
   *
   * (2) Everything else. In this case, the characters are just overlayed
   * on the stone directly.
   */
  _processTextLabel: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      // NUMLABEL are  a special categories of number-labeling where we use the
      // built-in font.  Each of these NUMLABEL fonts accept two characters.
      lbl = parseInt(label) % 100;
      return symbolVal.replace('%s', lbl);
    } else {
      // Here, we just overlay text on a stone.
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
  LATEX: [
    '\\usepackage{gnos}'
  ].join('\n')
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
  BSTONE_TRIANGLE: 'T',
  WSTONE_TRIANGLE: 't',
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
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // TODO(kashomon): Implement at some point. See gnos for an example.
    return text;
  }
};
/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(flattened, options) {
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for PDF rendering.
    return text;
  }
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
  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for ascii rendering.
    return text;
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
   * Marks and StoneMarks layer.
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
 * Generate SVG go diagrams.
 *
 * The primary reason we support SVG is so that we can support images in EPub
 * books. As of writing this (2015-9-12), eReaders usually disable JavaScript,
 * so that precludes the use of Canvas and Glift directly. However, Glift relies
 * on SVG, so we can piggyback on the existing SVG generation.
 *
 * Notes about generation:
 * It's usually useful to print a viewbox:
 *
 * <svg xmlns="http://www.w3.org/2000/svg"
 *      version="1.1" width="100%" height="100%"
 *      viewBox="0 0 844 1200">
 *    …
 * </svg>
 *
 * Restrictions:
 * - SVG for Ebooks must be static SVG -- no animation.
 * - svg:foreignObject element must contain either [HTML5] flow content or
 *   exactly one [HTML5] body element.
 * - The [SVG] svg:title element must contain only valid XHTML.
 *
 * Some Resources:
 * - EPub SVG Spec: http://www.idpf.org/epub/301/spec/epub-contentdocs.html#sec-svg
 * - EPub Standard: http://idpf.org/epub
 * - EPub 3.0.1 standard: http://idpf.org/epub/301
 * - http://svgmagazine.com/oct2014/Adventures%20With%20SVG%20In%20ePub.html
 */
gpub.diagrams.svg = {
  create: function(flattened, options) {

  },

  /** Render go stones that exist in a block of text. */
  renderInline: function(text) {
    // We probably don't want to modifify inline go stones for SVG rendering.
    return text;
  }
};
/**
 * Stub namespace. Not really used because all the API should exist at the top
 * level.
 */
gpub.api = {};
/**
 * Default options for GPub API.
 */
gpub.defaultOptions = {
  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   */
  sgfs: null,

  /**
   * A Glift Spec (Phase 2.) can be passed in, bypasing spec creation.
   */
  spec: null,

  /**
   * Book generation happens in 3 phases: SPEC, DIAGRAMS, BOOK.
   * See gpub.outputPhase.
   */
  outputPhase: 'BOOK',

  /**
   * The format of the 'book' output that is produced by GPub.
   * See gpub.outputFormat.
   */
  outputFormat: 'LATEX',

  /**
   * What is the purpose for the book? I.e., Commentary, Problem book,
   * Combination-book.
   * See gpub.bookPurpose.
   */
  bookPurpose: 'GAME_COMMENTARY',

  /**
   * Default board region for cropping purposes.
   * See glift.enums.boardRegions.
   */
  // TODO(kashomon): Should this even be here?
  boardRegion: 'AUTO',

  /**
   * The type of diagrams produced by GPub.
   *
   * Ideally you would be able to use any diagramType in an outputFormat, but
   * that is not currently the case.  Moreover, some output formats (e.g.,
   * glift, smartgo) take charge of generating the diagrams.
   *
   * However, there are some types that are output format independent:
   *  - ASCII,
   *  - PDF,
   *  - EPS
   *
   * See gpub.diagrams.diagramType.
   */
  diagramType: 'GNOS',

  /**
   * The size of the page. Element of gpub.book.page.type.
   */
  pageSize: 'LETTER',

  /**
   * Size of the intersections in the diagrams. If no units are specified, the
   * number is assumed to be in pt.
   */
  goIntersectionSize: '12pt',

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

  /**
   * Whether or not to perform box-cropping on variations.
   */
  autoBoxCropOnVariation: false,

  /**
   * List of autocropping preferences. Each element in the array should be a
   * member of glift.enums.boardRegions.
   *
   * Note: this may change if we ever support minimal/close-cropping.
   */
  regionRestrictions: [],

  ////////////////////////////
  // DiagramSpecificOptions //
  ////////////////////////////

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (latex).
   */
  pdfx1a: false,

  /**
   * An option only for PDF/X-1a. For this spceification, you must specify a
   * color profile file (e.g., ISOcoated_v2_300_eci.icc).
   */
  colorProfileFilePath: null,

  //////////////////
  // Book Options //
  //////////////////

  /** Options specifically for book processors */
  bookOptions: {
    /**
     * init: Any additional setup that needs to be done in the header. I.e.,
     * for diagram packages.
     */
    init: '',

    title: 'My Book',
    subtitle: null,
    publisher: 'GPub',
    authors: [
      // 'Created by GPub'
    ],
    year: null,

    /**
     * Frontmatter is text supporting the bulk of the the work that comes
     * before/after the mainmatter of the book.
     *
     * Note: It's expected that the frontmatter (except for the copyright page)
     * will be specified as a markdown-string.
     *
     * Not all of these will be supported by all the book-generators. For those
     * that do support the relevant sections, the frontmatter and backmatter are
     * dumped into the book options.
     */
    frontmatter: {
      // copyright: null, // AKA Colophon Page
      // epigraph: null, // AKA Quote Page
      foreword: null, // Author or unrelated person
      preface: null, // Author
      acknowledgements: null,
      introduction: null,

      /** Generate the Table of Contents or just 'Contents'. */
      generateToc: true,

      /**
       * Generates the copyright page. Copyright should be an object with the
       * format listed below:
       *
       *  {
       *     "publisher": "Foo Publisher",
       *     "license": "All rights reserved.",
       *     "publishYear": 2015,
       *     "firstEditionYear": 2015,
       *     "isbn": "1-1-123-123456-1",
       *     "issn": "1-123-12345-1",
       *     "addressLines": [
       *        "PO #1111",
       *        "1111 Mainville Road Rd, Ste 120",
       *        "Fooville",
       *        "CA 90001",
       *        "www.fooblar.com"
       *     ],
       *     "showPermanenceOfPaper": true,
       *     "printingRunNum": 1
       *  }
       */
      copyright: null
    },

    appendices: {
      glossary: null
    }
  },

  /**
   * Whether or not debug information should be displayed.
   */
  debug: false
};


////////////////////////
// Methods in the API //
////////////////////////


/**
 * Create a 'book' output from SGFs.
 *
  options: A book options array. See gpub.defaultOptions for the format.
 *
 * Returns: The completed book or document.
 */
gpub.create = function(options) {
  // Validate input and create the options array.
  gpub._validateInputs(options);

  // Process the options and fill in any missing values or defaults.
  options = gpub.processOptions(options);

  var sgfs = options.sgfs;

  // TODO(kashomon): This is a little weird, but we delete the SGFs out of the
  // object so and choose to explicitly the SGFs around for clarity.
  delete options.sgfs;

  // Ensure debugging mode reflects the options mode. Also ensure that debug is
  // boolean.
  gpub.global.debug = !!options.debug;

  // Create the glift specification.
  var spec = gpub.spec.create(sgfs, options);

  // Create the finished book (or whatever that means).
  var book = gpub.book.create(spec, options);

  // TODO(kashomon): return { contents: ..., diagrams: ... }
  return book;
};


/////////////
// Private //
/////////////

/**
 * Validates that the relevant parameters are available and returns the
 * processed options.
 */
gpub._validateInputs = function(options) {
  if (!options) {
    throw new Error('No options defined');
  }
  var sgfs = options.sgfs;
  if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || !sgfs.length) {
    throw new Error('SGF array must be defined and non-empty');
  }
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
};

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
