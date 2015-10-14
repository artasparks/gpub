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
