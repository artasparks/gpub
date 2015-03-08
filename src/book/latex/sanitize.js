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
