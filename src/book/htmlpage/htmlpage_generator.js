gpub.book.htmlpage.generator = function() {
  return new gpub.book.htmlpage._Generator();
};

gpub.book.htmlpage._Generator = function() {}

gpub.book.htmlpage._Generator.prototype = {
  generate: function(spec, options) {
  },

  defaultTemplate: function() {
    return gpub.book.htmlBook._template;
  },

  processBookOptions: function() {
  }
}
