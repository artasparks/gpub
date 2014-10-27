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
