/**
 * Interface for book processors. This describes the method signature for all
 * book processors.
 */
gpub.book.generator = {
  /**
   * Generate a 'book', whatever that means in the relevant context.
   *
   * Arguments:
   *  spec: The glift spec.
   *  options: The gpub options.
   *
   * Returns a string: the completed book.
   */
  generate: function(spec, options) {},

  /**
   * Return the default template string for the book processor.
   */
  defaultTemplate: function() {},

  /**
   * Process the book-specific options.  Usually, this relies on some
   * understanding of the current template.
   */
  processBookOptions: function(options) {}
};
