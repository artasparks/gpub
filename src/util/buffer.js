goog.provide('gpub.util.Buffer');

/**
 * Buffer Helper. Used to manage groupings items. This implementation allows
 * users to fill up the buffer past the maximum capacity -- it us up to the user
 * to check whether the buffer should be flushed via the atCapacity method.
 * @constructor @struct @final
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
