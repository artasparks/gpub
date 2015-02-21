gpub.book.ascii.generator = function() {
  return new gpub.book.ascii._Generator();
};

/**
 * Generator that implements gpub.book.generator interface.
 */
gpub.book.ascii._Generator = function() {}

gpub.book.ascii._Generator.prototype = {
  generate: function(spec, options) {
  },

  defaultTemplate: function() {
  },

  processBookOptions: function() {
  }
};

gpub.book.ascii._template = [
'Title: {{title}}',
'Authors {{#authors}}{{.}}{{/authors}}',
'--------------------------------------',
'{{content}}'
].join('\n');
