/**
 * Mutable container for tracking which stones and marks have been processed, in
 * a way that's useful for Igo.
 */
gpub.diagrams.igo.Intersections = function() {
  /**
   * You can only declare stones once. You get to do this either as a mark
   * declaration, sequence declaraton, or no-label declaration.
   */
  this.seenStones = {};

  /**
   * Igo has an unusual idea of move-sequences where moves are automatically
   * numbered based of a starting black/white stone and a starting number.
   *
   * Note that sequences is an array of arrays, where the inner arrays are the
   * relevant sequences. The inner arrays are arrays of modified-moves, which
   * are simple objects of the form
   *    {igopt: <string>, color: <BLACK|WHITE>, label: <number-string>}
   *    {igopt: a1, color: BLACK, label: 12}
   * The modified-moves may be null, which indicase a skipped move (in the case
   * of collisions)
   *
   * Note that since Igo doesn't have a concept of non-numbered labels on
   * stones, this should completely conever TEXTLABEL marks for stones
   */
  this.sequences = [];

  /**
   * Pretty self explanatory contains two arrays for black and white, each
   * containing an array of point strings.
   */
  this.blankStones = { WHITE: [], BLACK: [] };

  /**
   * Labels for empty intersections. Because of the way Igo works, this is a map
   * from label to array of pts
   */
  this.emptyTextLabels = {};

  /** The marks, processed for Igo. */
  this.marks = {
    BLACK: { XMARK: [], SQUARE: [], TRIANGLE: [], CIRCLE: [] },
    WHITE: { XMARK: [], SQUARE: [], TRIANGLE: [], CIRCLE: [] }
  }
};

/**
 * Define the methods on Intersections.
 */
gpub.diagrams.igo.Intersections.prototype = {
  /** Adds a mark to the mark map. */
  addMark: function(color, mark, ptstr) {
    if (color == null) { throw new Error('No color'); }
    if (mark == null) { throw new Error('No mark'); }
    if (ptstr == null) { throw new Error('No ptstr'); }
    this.marks[color][mark].push(ptstr);
    this.seenStones[ptstr] = true;
    return this;
  },

  /** Adds a textlabel mark for empty intersections. */
  addEmptyTextLabel: function(ptstr, label) {
    if (ptstr == null) { throw new Error('No ptstr'); }
    if (label == null) { throw new Error('No label'); }
    if (!this.emptyTextLabels[label]) {
      this.emptyTextLabels[label] = [];
    }
    this.emptyTextLabels[label].push(ptstr);
    return this;
  },

  /** Adds a stone without label or mark if it hasn't already been seen. */
  addBlankStoneIfNotSeen: function(ptstr, stone) {
    if (this.seenStones[ptstr]) {
      // Already been processed.
      return this;
    } else if (ptstr && stone.color) {
      this.blankStones[stone.color].push(ptstr);
      this.seenStones[ptstr] = true;
    } else {
      // Don't process stones if there is no associated color.
    }
    return this;
  },

  /**
   * Adds an array of numeric stone labels, processing them into sequences.
   *
   * It it's expected that items in the stoneLabelArr have the form:
   *  {
   *    ptstr: '1,3',
   *    color: 'BLACK',
   *    label: '3'
   *  }
   */
  addStoneTextLabels: function(stoneLabelArr) {
    var arrCopy = [];
    var colors = {BLACK:'BLACK', WHITE:'WHITE'};
    for (var i = 0; i < stoneLabelArr.length; i++) {
      var item = stoneLabelArr[i];
      if (!colors[item.color]) {
        throw new Error('Unknown color:' + item.color);
      }

      // Conservatively, check here that the labels are numeric. ignore if
      if (item.label && item.ptstr && item.color && /^\d+$/.test(item.label)) {
        item.label = parseInt(item.label, 10);
        arrCopy.push(item);
      } else {
        throw new Error('Invalid item:'
            + item.ptstr + ',' + item.color + ',' + iteem.label);
      }
    }

    // First, sort the stone label array by
    arrCopy.sort(function(a, b) {
      return a.label - b.label;
    });

    // Now that it's sorted, we can construct the sequences.
    var curSequence = [];
    for (var i = 0; i < arrCopy.length; i++) {
      var item = arrCopy[i];
      this.seenStones[item.ptstr] = true;
      if (curSequence.length === 0) {
        curSequence.push(item);
        continue;
      }

      var last = curSequence[curSequence.length-1];
      if (item.color !== last.color && item.label === (last.label+1)) {
        // It's a sequence!
        curSequence.push(item);
      } else if (item.color === last.color && item.label === (last.label+2)) {
        // It's a sequence with a gap!
        curSequence.push(null);
        curSequence.push(item);
      } else if (item.color !== last.color && item.label === (last.label+3)) {
        // It's a sequence with two gaps (should be rare)
        curSequence.push(null);
        curSequence.push(null);
        curSequence.push(item);
      } else {
        // Big gap or non-alternating color (both would be weird, but whatever).
        // Terminate the existing sequence and make a new one.
        this.sequences.push(curSequence);
        curSequence = [item];
      }
    }

    if (curSequence.length > 0) {
      this.sequences.push(curSequence);
    }
    return this;
  }
};

/**
 * Process the marks into something more useful for Igo.
 * Takes the following maps:
 * - markMap : map from ptString to mark type (flattened enum).
 * - stoneMap : map from ptString to stone obj
 * - labelMap : map from ptString to label string
 */
gpub.diagrams.igo.processIntersections =
    function( markMap, stoneMap, labelMap) {
  var tracker = new gpub.diagrams.igo.Intersections();

  var stoneTextLabels = [];

  var number = /^\d+$/;

  var symbolStr = glift.flattener.symbolStr;

  // With stoneTextLabels, we attempt find sequences of stones, which allows for
  // more compact diagram descriptions. First, we just collect all the text
  // labels. Then, we
  var stoneTextLabels = [];

  for (var ptstr in markMap) {
    var mark = markMap[ptstr];
    if (stoneMap[ptstr] && stoneMap[ptstr].color) {
      var stone = stoneMap[ptstr];
      if (stone.point.toString() !== ptstr) {
        throw new Error('Points not equal. ' +
            stone.point.toString() + ' != ' + ptstr);
      }
      var color = stone.color;
      // Note: Igo does not support marks (except for number-labels) on
      // empty intersections.
      if (mark !== glift.flattener.symbols.TEXTLABEL) {
        var markstr = symbolStr(mark);
        tracker.addMark(color, markstr, ptstr);
      } else if (mark === glift.flattener.symbols.TEXTLABEL &&
          labelMap[ptstr] &&
          number.test(labelMap[ptstr])) {
        // Only number-labels are support on stones.
        stoneTextLabels.push({
          ptstr: ptstr,
          color: color,
          label: labelMap[ptstr]
        });
      }
    } else if (mark == glift.flattener.symbols.TEXTLABEL) {
      // Limited ascii text labels are supported for empty intersections.
      tracker.addEmptyTextLabel(ptstr, labelMap[ptstr]);
    }
    // There are several opportunities for marks to not get caught here. Igo
    // doesn't have support for:
    // - Empty intersections with marks
    // - Stones with labels other than numbers
  }

  tracker.addStoneTextLabels(stoneTextLabels);

  for (var ptstr in stoneMap) {
    var stone = stoneMap[ptstr];
    tracker.addBlankStoneIfNotSeen(ptstr, stone);
  }

  return tracker;
};
