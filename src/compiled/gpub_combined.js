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
 * Markdown for Gpub.
 */
gpub.markdown = {
  // TODO(kashomon): Write a 'marked' render.
};
/** * Initialize the Mustache templating library into gpub.Mustache; */gpub.__initMustache = function(fn) {  fn.call(this); // Init };gpub.__initMustache(function() {(function(global,factory){if(typeof exports==="object"&&exports){factory(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],factory)}else{factory(global.Mustache={})}})(this,function(mustache){var Object_toString=Object.prototype.toString;var isArray=Array.isArray||function(object){return Object_toString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var RegExp_test=RegExp.prototype.test;function testRegExp(re,string){return RegExp_test.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tags){if(typeof tags==="string")tags=tags.split(spaceRe,2);if(!isArray(tags)||tags.length!==2)throw new Error("Invalid tags: "+tags);openingTagRe=new RegExp(escapeRegExp(tags[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tags[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tags[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function(){return this.tail===""};Scanner.prototype.scan=function(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view==null?{}:view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function(view){return new Context(view,this)};Context.prototype.lookup=function(name){var cache=this.cache;var value;if(name in cache){value=cache[name]}else{var context=this,names,index;while(context){if(name.indexOf(".")>0){value=context.view;names=name.split(".");index=0;while(value!=null&&index<names.length)value=value[names[index++]]}else if(typeof context.view=="object"){value=context.view[name]}if(value!=null)break;context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function(){this.cache={}};Writer.prototype.parse=function(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template)};Writer.prototype.renderTokens=function(tokens,context,partials,originalTemplate){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this._renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this._renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this._renderPartial(token,context,partials,originalTemplate);else if(symbol==="&")value=this._unescapedValue(token,context);else if(symbol==="name")value=this._escapedValue(token,context);else if(symbol==="text")value=this._rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype._renderSection=function(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype._renderInverted=function(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype._renderPartial=function(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value),context,partials,value)};Writer.prototype._unescapedValue=function(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype._escapedValue=function(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value)};Writer.prototype._rawValue=function(token){return token[1]};mustache.name="mustache.js";mustache.version="1.1.0";mustache.tags=["{{","}}"];var defaultWriter=new Writer;mustache.clearCache=function(){return defaultWriter.clearCache()};mustache.parse=function(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function(template,view,partials){return defaultWriter.render(template,view,partials)};mustache.to_html=function(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer});}); // __initMustache/**
 * Package for creating the 'books'! A book, in this context, is simply defined
 * as a generated string that contains rendered SGF data.
 */
gpub.book = {
  /** Creates a book! */
  create: function(spec, options) {
    this._validate(spec);
    var gen = this.generator(options.outputFormat, options);
    return gen.generate(spec, options);
  },

  _validate: function(spec) {
    if (spec.sgfCollection.length < 1) {
      throw new Error('sgfCollection must be non-empty');
    }
  }
};
//
// Tentative ideas about how to insert diagrams into the page.
//


/**
 * The diagram context. How should the diagram be wrapped?
 */
gpub.book.diagramContext = {
  NONE: 'NONE',
  SECTION_INTRO: 'SECTION_INTRO',
  GAME_REVIEW: 'GAME_REVIEW',
  GAME_REVIEW_CHAPTER: 'GAME_REVIEW_CHAPTER',
  PROBLEM: 'PROBLEM',
  ANSWER: 'ANSWER'
};

/**
 * Not entirely sure what to put here
 */
gpub.book.pageContext = {

};
/**
 * Constructs a book generator.
 */
gpub.book.generator = function(outputFormat, options) {
  if (!outputFormat) { throw new Error('No output format defined'); }
  if (!options) { throw new Error('Options not defined'); }

  var package = gpub.book[outputFormat.toLowerCase()];
  if (!package) {
    throw new Error('No package defined for: ' + outputFormat);
  }
  if (!package.generator) {
    throw new Error('No generator impl for: ' + outputFormat);
  }

  var gen = new gpub.book._Generator();

  // Copy over the methods from the implementations;
  for (var key in package.generator) {
    if (key && package.generator[key]) {
      gen[key] = package.generator[key].bind(gen);
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
  defaultOptions: function() {},
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
        if (globalMetadata[key] && !view[key]) {
          view[key] = globalMetadata[key];
        }
      }
    }
    return view
  },

  /** Returns a Glift SGF Manager instance. */
  manager: function(spec) {
    return glift.widgets.createNoDraw(spec);
  },

  /**
   * Helper function for looping over each SGF in the SGF collection.
   *
   * The function fn should expect two params:
   *  - the index
   *  - The movetree.
   *  - The 'flattened' object.
   */
  forEachSgf: function(spec, fn) {
    var mgr = this.manager();
    for (var i = 0; i < mgr.sgfCollection.length; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var mt = this.getMovetree(sgfObj);
      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: sgfObj.nextMovesPath,
          boardRegion: sgfObj.boardRegion
      });
      fn(i, mt, flattened);
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
    for (var key in defOpts) {
      if (defOpts[key] && !this._opts[key]) {
        this._opts[key] = defOpts[key];
      }
      // Step one level deeper into book options and copy the keys there.
      if (key === 'bookOptions') {
        var bookOptions = defOpts[key];
        for (var bkey in bookOptions) {
          if (bookOptions[bkey] && !this._opts.bookOptions[bkey]) {
            this._opts.bookOptions[bkey] = bookOptions[bkey];
          }
        }
      }
    }
    return this;
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
 * NodeData object.
 */
gpub.book.NodeData = function(purpose) {
  if (!gpub.diagrams.diagramPurpose[purpose]) {
    throw new Error(
        'Purpose not defined in gpub.diagrams.diagramPurpose: ' + purpose)
  }
  this.purpose = purpose;

  this.sectionTitle = null;
  this.sectionNumber = -1;

  this.chapterTitle = null;
  this.chapterNumber = -1;
};

/** Methods */
gpub.book.NodeData.prototype = {
  /** Sets the section title from the context. */
  setSectionFromCtx: function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.SECTION_INTRO) {
      // We're at the beginning of the game. Create a new section
      this.sectionTitle =
          mt.getTreeFromRoot().properties().getOneValue('GN') || '';
      this.sectionNumber = idx;
      return idx + 1;
    }
    return idx;
  },

  /** Sets the chapter title from the context. */
  setChapterFromCtx : function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.GAME_REVIEW_CHAPTER) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    } else if ((this.purpose === diagramPurpose.PROBLEM || 
        this.purpose === diagramPurpose.ANSWER) &&
        this.purpose !== previousPurpose) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    }
    return idx;
  }
};

/**
 * Staticly creates NodeData based on some context.  Basically, this uses
 * hueristics
 *
 * This method is pretty hacky and may need to be rethought.
 */
gpub.book.NodeData.fromContext = function(
    mt, flattened, sgfMetadata, nextMovesPath) {
  var diagramPurpose = gpub.diagrams.diagramPurpose;
  var exampleType = gpub.spec.exampleType;
  var purpose = diagramPurpose.GAME_REVIEW;
  sgfMetadata = sgfMetadata || {};

  if (diagramPurpose[sgfMetadata.exampleType]) {
    purpose = sgfMetadata.exampleType;
  }

  // We're at the beginning of a game. Don't display a board, but display the
  // comment (assuming there is one).
  if (mt.node().getNodeNum() === 0 &&
      nextMovesPath.length === 0 &&
      purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.SECTION_INTRO;
  }

  // Try out the chapter-title stuff.
  if (flattened.isOnMainPath() && purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.GAME_REVIEW_CHAPTER;
  }

  return new gpub.book.NodeData(purpose);
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
    var view = this.options().bookOptions;
    var content = [];
    this.forEachSgf(spec, function(mt, flattened) {

    });
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
'--------------------------------------',
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
'<html>',
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
 * LaTeX book processor. Should implement methods present in
 * gpub.book.processor.
 */
gpub.book.latex = {
  /**
   * Generate a LaTeX book!
   *
   * We assume that the options have already been generated.
   *
   * spec: A bookSpec -- i.e., a set of glift options.
   * templateString: the book template to use for the book
   * diagramType: The diagram format.
   * options: optional parameters. Including:
   *    Title: The title of the book
   *    Subtitle: Optional Subtitle
   *    Authors: Array of author names
   *    Publisher: Publisher Name
   *
   * Note: these parameters can also be specified in the spec metadata.
   */
  generate: function(spec, templateString, diagramType, options) {
    if (!spec) {
      throw new Error('Options must be defined. Was: ' + spec);
    }

    var diagramsPerPage = 2;

    var templateString = templateString || gpub.templates.latexBase;
    var diagramType = diagramType || gpub.diagrams.diagramType.GOOE

    var mgr = glift.widgets.createNoDraw(spec);
    var template = gpub.templates.parseLatexTemplate(templateString);
    var diagramTypePkg = gpub.diagrams[glift.enums.toCamelCase(diagramType)];
    var diagramTypeHeaders = diagramTypePkg.latexHeaders;

    var latexDefs = gpub.diagrams.latex;

    template.setExtraPackages(diagramTypeHeaders.packageDef())
        .setDiagramTypeDefs(diagramTypeHeaders.extraDefs())
        .setDiagramWrapperDefs(latexDefs.diagramDefs())
        .setTitleDef(this.basicTitleDef(
            'Relentless',
            'Gu Li vs Lee Sedol',
            ['Younggil An', 'David Ormerod', 'Josh Hoak'],
            'Go Game Guru'));

    var content = [];
    var diagramBuffer = []
    var chapter = 1;
    var section = 1;
    var lastPurpose = null;
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    for (var i = 0; i < mgr.sgfCollection.length; i++) {
      var sgfObj = mgr.loadSgfStringSync(mgr.getSgfObj(i));
      var mt = glift.rules.movetree.getFromSgf(
          sgfObj.sgfString, sgfObj.initialPosition);
      var flattened = glift.flattener.flatten(mt, {
          nextMovesTreepath: sgfObj.nextMovesPath,
          boardRegion: sgfObj.boardRegion
      });

      var nodeData = gpub.book.NodeData.fromContext(
          mt, flattened, sgfObj.metadata, sgfObj.nextMovesPath || []);
      section = nodeData.setSectionFromCtx(mt, lastPurpose, section);
      chapter = nodeData.setChapterFromCtx(mt, lastPurpose, chapter);

      var diagram = gpub.diagrams.forPurpose(
          flattened,
          diagramType,
          gpub.book.bookFormat.LATEX,
          nodeData.purpose,
          nodeData);

      if (nodeData.purpose === diagramPurpose.SECTION_INTRO ||
          nodeData.purpose === diagramPurpose.GAME_REVIEW_CHAPTER ||
          nodeData.purpose !== lastPurpose) {
        // Flush the previous buffer centent to the page.
        content.push(gpub.book.latex.renderPage(diagramBuffer));

        diagramBuffer = [];
        diagramBuffer.push(diagram);
        content.push(gpub.book.latex.renderPage(diagramBuffer));
        diagramBuffer = [];
      } else {
        diagramBuffer.push(diagram);
        if (diagramBuffer.length === diagramsPerPage) {
          content.push(gpub.book.latex.renderPage(diagramBuffer));
          diagramBuffer = [];
        }
      }
      lastPurpose = nodeData.purpose;
    }
    return template.setContent(content.join('\n')).compile();
  },

  renderPage: function(buffer) {
    buffer.push('\\newpage');
    return buffer.join('\n');
  }
};
/**
 * Methods implementing gpub.book.generater. These will get attached to a
 * generic generator instance.
 */
gpub.book.latex.generator = {
  generate: function(spec) {
    var template = this.template();
    var view = this.view();

    var content = [];
    this.forEachSgf(function(idx, mt, flattened) {
      var diagramStr = gpub.diagrams.create(flattened, diagramType);
      content.push(diagramStr);
    });

    view.content = content.join('\n');

    return gpub.Mustache.render(template, view);
  },

  defaultTemplate: function() {
    return gpub.book.latex.defaultTemplate;
  },

  defaultOptions: function() {
    return {
      diagramType: gpub.diagrams.diagramType.GNOS,
      bookOptions: {
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
'\\usepackage{unicode}',
'\\usepackage[margin=1in]{geometry}',

'%%% Define any extra packages %%%',
'{{extraPackages}}',
'',
'\\setlength{\\parskip}{0.5em}',
'\\setlength{\\parindent}{0pt}',
'',

'%%% Extra defs',
'% Necessary for the particular digaram type.',
'{{diagramTypeDefs}}',
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
'     {\\Large {{name}} }',
'  {{/authors}}',
'  \\vspace*{5 em}',
'  {\\textcolor{light-gray}{\\Huge {{title}} }\\\\',
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
'{{content}}',
'',
'\\end{document}'].join('\n');
  /**
   * Sanitizes latex input. This isn't particularly robust, but it is meant to
   * protect us against accidental problematic characters rather than malicious
   * user input.
   */
gpub.book.latex.sanitize = function(text) {
  return text.replace(/[$#}{]/g, function(match) {
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
    return null;
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
      boardRegion: region
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
    options = options || {};
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
    if (!pkg.create) {
      throw new Error('No create method for diagram type: ' + diagramType);
    }

    return pkg.create(flattened, options);
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
  constructLabelFromFlattened: function(flattened) {
    return gpub.diagrams.constructLabel(
        collisions = flattened.collisions(),
        isOnMainline = flattened.isOnMainline(),
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
  constructLabel: function(collisions, isOnMainline, startNum, endNum) {
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
gpub.diagrams.gooe.latexHeaders = {
  packageDef: function() {
    return '\\usepackage{gooemacs}';
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
    var defs = gpub.diagrams.gooe.latexHeaders.defs;
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
}
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
gpub.diagrams.gnos.latexHeaders = {
  packageDef: function(){ 
    return '\\usepackage{gnos}';
  },

  extraDefs: function(baseFont) {
    return '';
  }
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
  create: function(flattened) {

  }
};
/**
 * Create a PDF diagram.
 */
gpub.diagrams.pdf = {
  create: function(sgfobj) {

  }
};
/**
 * Some basic LaTeX definitions. This should perhaps be its own directory, once
 * more styles are added.
 */
gpub.diagrams.latex = {
  /**
   * Typeset the diagram into LaTeX
   */
  typeset: function(str, purpose, comment, label, isMainLine, bookData) {
    comment = this.sanitize(comment);
    var camelCaseName = glift.enums.toCamelCase(purpose)
    var func = gpub.diagrams.latex[camelCaseName];
    switch(purpose) {
      case 'GAME_REVIEW':
      case 'GAME_REVIEW_CHAPTER':
        var baseLabel = isMainLine ? '\\gofigure' : '\\godiagram';
        if (label) {
          var splat = label.split('\n');
          for (var i = 0; i < splat.length; i++ ) {
            baseLabel += '\n\n\\subtext{' + splat[i] + '}';
          }
        }
        var label = baseLabel;
        break;
      default:
        // Do nothing.  This switch is for processing the incoming label.
    }
    return func(str, comment, label, bookData);
  },

  /**
   * Return a section intro.
   */
  sectionIntro: function(diagramString, comment, label, bookData) {
    var part = bookData.sectionTitle || '';
    var chapter = bookData.chapterTitle || '';
    return [
      '\\part{' + part + '}',
      '\\chapter{' + chapter + '}',
      comment
    ].join('\n');
  },

  /**
   * Generate a GAME_REVIEW diagram.
   *
   * diagramString: Literal string for the diagram
   * comment: Comment for diagram
   * label: Diagram label
   *
   * returns: filled-in latex string.
   */
  gameReview: function(diagramString, comment, label) {
    return [
      '',
      '\\rule{\\textwidth}{0.5pt}',
      '',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      diagramString,
      label,
      '\\end{minipage}',
      '\\begin{minipage}[t]{0.5\\textwidth}',
      '\\setlength{\\parskip}{0.5em}',
      comment,
      '\\end{minipage}',
      '\\vfill'].join('\n');
  },

  /**
   * Generate a Game Review Chapter Diagram.
   */
  gameReviewChapter: function(diagramString, comment, label, bookdata) {
    return [
      '\\chapter{' + bookdata.chapterTitle + '}',
      '{\\centering',
      diagramString,
      '}',
      label,
      '',
      comment,
      '\\vfill'].join('\n');
  },

  problem: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
  },

  answer: function(diagramString, comment, label, bookdata) {
    return [
      diagramString,
      label,
      '',
      comment].join('\n');
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
  ASCII: 'ASCII',

  /** Construct a book in Smart Go format. */
  // SMART_GO: 'SMART_GO'

  // Future Work:
  // - ONLY_DIAGRAMS
  // - ASCII
  // - SmartGo Books
};
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
  var book = gpub.book.generate

  return spec;
};

/**
 * 
 */
gpub.createDiagrams = function(sgfs, options) {

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

  /** A false-y template will resulti in using the default template */
  template: null,

  /** Options specificaly for book processors */
  bookOptions: {}
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
  return options;
};
