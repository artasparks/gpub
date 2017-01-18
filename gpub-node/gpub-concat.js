/**
 * @preserve Glift: A Responsive Javascript library for the game Go.
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * --------------------------------------
 */

// Define some closure primitives for compatibility with dev mode. Closure
// compiler works off of regular expressions, so this shouldn't be an issue.
// This allows us to use goog.require and goog.provides in dev mode.
if (window && !window['goog']) {
  window['goog'] = {}
  window['goog']['require'] = function(ns) {
  };
  window['goog']['scope'] = function(fn) { fn() };
  window['goog']['provide'] = function(ns) {
  };
}

goog.provide('glift');

(function(w) {

var g;
if (typeof glift !== 'undefined') {
  g = glift;
} else if (typeof w.glift !== 'undefined') {
  g = w.glift
} else {
  g = {};
}
if (w) {
  // expose Glift as a global.
  w.glift = g ;
}
})(window);

goog.provide('glift.util');

glift.util = {
  /**
   * Log a message. Allows the for the possibility of overwriting for tests.
   */
  logz: function(msg) {
    console.log(msg);
    return null; // default value to return.
  },

  /**
   * Via Crockford / StackOverflow: Determine the type of a value in robust way.
   * @param {*} value
   * @return {string}
   */
  typeOf: function(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (value instanceof Array) {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  },

  /**
   * Checks to make sure a number is inbounds.  In other words, whether a number
   * is between 0 (inclusive) and bounds (exclusive).
   * @param {number} num
   * @param {number} bounds
   * @return {boolean}
   */
  inBounds: function(num, bounds) {
    return ((num < bounds) && (num >= 0));
  },

  /**
   * Checks to make sure a number is out-of-bounds
   * returns true if a number is outside a bounds (inclusive) or negative
   * @param {number} num
   * @param {number} bounds
   * @return {boolean}
   */
  outBounds: function(num, bounds) {
    return ((num >= bounds) || (num < 0));
  },

  // Init a key if the obj is undefined at the key with the given value.
  // Return the value
  getKeyWithDefault: function(obj, key, value) {
    if (obj[key] === undefined) {
      obj[key] = value;
    }
    return obj[key];
  },

  /*
   * Get the size of an object
   */
  sizeOf: function(obj) {
    var size = 0;
    for (var key in obj) {
      size += 1;
    }
    return size;
  },

  /**
   * Set methods in the base object.  Usually used in conjunction with beget.
   */
  setMethods: function(base, methods) {
    for (var key in methods) {
      base[key] = methods[key].bind(base);
    }
    return base;
  },

  /**
   * A utility method -- for prototypal inheritence.
   *
   * @template T
   * @param {T} o
   * @return {T}
   */
  beget: function (o) {
    /** @constructor */
    var F = function () {};
    F.prototype = o;
    return new F();
  },

  /**
   * Simple Clone creates copies for all string, number, boolean, date and array
   * types.  It does not copy functions (which it leaves alone), nor does it
   * address problems with recursive objects.
   *
   * @template T
   * @param {T} obj
   * @return {T}
   */
  simpleClone: function(obj) {
    // Handle immutable types (null, Boolean, Number, String) and functions.
    if (glift.util.typeOf(obj) !== 'array' &&
        glift.util.typeOf(obj) !== 'object') return obj;
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (glift.util.typeOf(obj) === 'array') {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = glift.util.simpleClone(obj[i]);
      }
      return copy;
    }
    if (glift.util.typeOf(obj) === 'object') {
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] =
            glift.util.simpleClone(obj[attr]);
      }
      return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
};

goog.provide('glift.array');

/**
 * Collection of utility methods for arrays
 */
glift.array = {
  remove: function(arr, elem) {
    var index = arr.indexOf(elem);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  },

  replace: function(arr, elem, elemRep) {
    var index = arr.indexOf(elem);
    if (index > -1) {
      arr[index] = elemRep;
    }
    return arr;
  }
};

goog.provide('glift.util.colors');

glift.util.colors = {
  /**
   * @param {glift.enums.states} color
   * @return {glift.enums.states} The opposite color
   */
  oppositeColor: function(color) {
    if (color === glift.enums.states.BLACK) return glift.enums.states.WHITE;
    if (color === glift.enums.states.WHITE) return glift.enums.states.BLACK;
    else return color;
  }
};

goog.provide('glift.enums');

/**
 * Various constants used throughout glift.
 */
glift.enums = {
  /**
   * Camel cases an enum. Can be useful for things that have functions or
   * packages named from enum names.
   *
   * @param {string} input The enum to input
   * @return {string} transformed enum name.
   */
  toCamelCase: function(input) {
    return input.toLowerCase().replace(/_(.)?/g, function(match, group1) {
      return group1 ? group1.toUpperCase() : '';
    });
  },
};

/**
 * Also sometimes referred to as colors.
 * @enum{string}
 */
glift.enums.states = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
  EMPTY: 'EMPTY'
};

/**
 * @enum{string}
 */
glift.enums.boardAlignments = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  CENTER: 'CENTER'
};


/**
 * List of directions. Used for a variety of tasks.
 * @enum{string}
 */
glift.enums.directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};

/**
 * List of board regions. Usually used for cropping.
 * @enum{string}
 */
glift.enums.boardRegions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  ALL: 'ALL',
  // Automatically determine the board region.
  AUTO: 'AUTO',
  // Minimal cropbox, modulo some heuristics. To do this, you usually need a
  // movetree, and usually, you need next-path information.
  MINIMAL: 'MINIMAL'
};

/**
 * @enum {string}
 */
glift.enums.marks = {
  CIRCLE: 'CIRCLE',
  SQUARE: 'SQUARE',
  TRIANGLE: 'TRIANGLE',
  XMARK: 'XMARK',
  // STONE_MARKER marks the last played stone
  STONE_MARKER: 'STONE_MARKER',
  LABEL: 'LABEL',

  // These last few 'marks' are variations on the LABEL mark type.
  // TODO(kashomon): Consolidate these somehow.
  //
  // Neither LABEL_ALPHA nor LABEL_NUMERIC are used for rendering, but they
  // are extremly convenient to have this distinction when passing information
  // from the display to the controller
  LABEL_ALPHA: 'LABEL_ALPHA',
  LABEL_NUMERIC: 'LABEL_NUMERIC',

  // There last two are variations on the LABEL mark. VARIATION_MARKER is used
  // so we can color labels differently for variations.
  VARIATION_MARKER: 'VARIATION_MARKER',

  // We color 'correct' variations differently in problems,
  CORRECT_VARIATION: 'CORRECT_VARIATION',

  // We color 'correct' variations differently in problems,
  KO_LOCATION: 'KO_LOCATION'
};

/**
 * Enum to indicate how a move for a problem was resolved.
 * @enum {string}
 */
glift.enums.problemResults = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  INDETERMINATE: 'INDETERMINATE',
  FAILURE: 'FAILURE' // i.e., none of these (couldn't place stone).
};

/**
 * Whether or not to show variations in the UI.
 * @enum {string}
 */
glift.enums.showVariations = {
  ALWAYS: 'ALWAYS',
  NEVER: 'NEVER',
  MORE_THAN_ONE: 'MORE_THAN_ONE'
};

/**
 * Rotations we can apply to Go Boards. Doesn't rotate the fundamental data (the
 * SGF points), but rotates at the time the board is drawn.
 * @enum {string}
 */
glift.enums.rotations = {
  NO_ROTATION: 'NO_ROTATION',
  CLOCKWISE_90: 'CLOCKWISE_90',
  CLOCKWISE_180: 'CLOCKWISE_180',
  CLOCKWISE_270: 'CLOCKWISE_270'
};

goog.provide('glift.util.obj');

glift.util.obj = {
  /**
   * A helper for merging obj information (typically CSS or SVG rules).  This
   * method is non-recursive and performs only shallow copy.
   *
   * @param {!Object} base object
   * @param {...!Object} var_args
   */
  flatMerge: function(base, var_args) {
    var newObj = {};
    if (glift.util.typeOf(base) !== 'object') {
      return newObj;
    }
    for (var key in base) {
      newObj[key] = base[key];
    }
    for (var i = 1; arguments.length >= 2 && i < arguments.length; i++) {
      var arg = arguments[i];
      if (glift.util.typeOf(arg) === 'object') {
        for (var key in arg) {
          newObj[key] = arg[key];
        }
      }
    }
    return newObj;
  },

  /**
   * Returns true if an object is empty. False otherwise.
   * @param {!Object} obj
   */
  isEmpty: function(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }
};

goog.provide('glift.util.point');
goog.provide('glift.Point');
goog.provide('glift.PtStr');

/**
 * A point string is just a string with the format '<Number>,<Number>'. We use
 * this special type as a reminder to the reader of the code.
 *
 * Example: '12,5'
 *
 * @typedef {string}
 */
glift.PtStr;

/**
 * Create a point.  We no longer cache points
 * @param {number} x
 * @param {number} y
 * return {!glift.Point}
 */
glift.util.point = function(x, y) {
  return new glift.Point(x, y);
};

/**
 * @param {number} x
 * @param {number} y
 * return {!glift.PtStr}
 */
glift.util.coordToString = function(x, y) {
  return x + ',' + y;
};

/**
 * @param {glift.PtStr} str
 * @return {!glift.Point}
 */
glift.util.pointFromString = function(str) {
  try {
    var split = str.split(",");
    var x = parseInt(split[0], 10);
    var y = parseInt(split[1], 10);
    return glift.util.point(x, y);
  } catch(e) {
    throw "Parsing Error! Couldn't parse a point from: " + str;
  }
};

/**
 * Convert SGF data from SGF data.
 *
 * Returns an array of points. This exists to handle point-rectangle data sets
 * and point data sets uniformly.
 *
 * Example: TR[aa][ab]... vs TR[aa:cc]
 *
 * @param {string} str The sgf string to pars.
 * @return {!Array<!glift.Point>} An array of points.
 */
glift.util.pointArrFromSgfProp = function(str) {
  if (str.length === 2) {
    // Assume the properties have the form [ab].
    return [glift.util.pointFromSgfCoord(str)];
  } else if (str.length > 2) {
    // Assume a point rectangle. This a weirdness of the SGF spec and the reason
    // why this function exists. See http://www.red-bean.com/sgf/sgf4.html#3.5.1
    var splat = str.split(':');
    if (splat.length !== 2) {
      throw new Error('Expected two points: TopLeft and BottomRight for ' +
        'point rectangle. Instead found: ' + str);
    }
    var out = [];
    var tl = glift.util.pointFromSgfCoord(splat[0]);
    var br = glift.util.pointFromSgfCoord(splat[1]);
    if (br.x() < tl.x() || br.y() < br.y()) {
      throw new Error('Invalid point rectangle: tl: ' + tl.toString() +
          ', br: ' + br.toString());
    }
    var delta = br.translate(-tl.x(), -tl.y());
    for (var i = 0; i <= delta.y(); i++) {
      for (var j = 0; j <= delta.x(); j++) {
        var newX = tl.x() + j, newY = tl.y() + i;
        out.push(glift.util.point(newX, newY));
      }
    }
    return out;
  } else {
    throw new Error('Unknown pointformat for property data: ' + str);
  }
};


/**
 * Take an SGF point (e.g., 'mc') and return a GliftPoint.
 * SGFs are indexed from the Upper Left:
 *    _  _  _
 *   |aa ba ca ...
 *   |ab bb
 *   |.
 *   |.
 *   |.
 * @param {string} str The SGF string point
 * @return {!glift.Point} the finished point.
 */
glift.util.pointFromSgfCoord = function(str) {
  if (str.length !== 2) {
    throw 'Unknown SGF Coord length: ' + str.length +
        'for property ' + str;
  }
  var a = 'a'.charCodeAt(0)
  return glift.util.point(str.charCodeAt(0) - a, str.charCodeAt(1) - a);
};


/**
 * Basic Point class.
 *
 * As a historical note, this class has transformed more than any other class.
 * It was originally cached, with private variables and immutability.  However,
 * I found that all this protection was too tedious.
 *
 * @constructor
 * @struct
 * @final
 */
glift.Point = function(xIn, yIn) {
  /**
   * @private {number}
   * @const
   */
  this.x_ = xIn;
  /**
   * @private {number}
   * @const
   */
  this.y_ = yIn;
};

glift.Point.prototype = {
  /** @return {number} x value */
  x: function() { return this.x_ },
  /** @return {number} y value */
  y: function() { return this.y_ },
  /**
   * @param {?Object} inpt
   * @return {boolean} Whether this point equals another obj.
   */
  equals: function(inpt) {
    if (!inpt) { return false; };
    if (!inpt.x && !inpt.y) { return false; }
    var pt = /** @type {!glift.Point} */ (inpt);
    return this.x_ === pt.x() && this.y_ === pt.y();
  },

  /** @return {!glift.Point} */
  clone: function() {
    return glift.util.point(this.x(), this.y());
  },

  /**
   * @return {string}  an SGF coord, e.g., 'ab' for (0,1)
   */
  toSgfCoord: function() {
    var a = 'a'.charCodeAt(0);
    return String.fromCharCode(this.x() + a) +
        String.fromCharCode(this.y() + a);
  },

  /**
   * Return a string representation of the coordinate.  I.e., "12,3".
   * @return {!glift.PtStr}
   */
  toString: function() {
    return glift.util.coordToString(this.x(), this.y());
  },

  /**
   * @param {number} x
   * @param {number} y
   * @return {!glift.Point} a new point that's a translation from this one.
   */
  translate: function(x, y) {
    return glift.util.point(this.x() + x, this.y() + y);
  },

  /**
   * Rotate an (integer) point based on the board size.
   * Note: This is an immutable transformation on the point.
   *
   * @param {number} maxIntersections The max intersections of the uncropped
   *    board. Typically 19, 13, or 9.
   * @param {glift.enums.rotations} rotation To perform on the point.
   * @return {!glift.Point} A new point that has possibly been rotated.
   */
  rotate: function(maxIntersections, rotation) {
    var rotations = glift.enums.rotations;
    if (maxIntersections < 0 ||
        rotation === undefined ||
        rotation === rotations.NO_ROTATION) {
      return this;
    }
    var point = glift.util.point;
    var mid = (maxIntersections - 1) / 2;
    var normalized = point(this.x() - mid, mid - this.y());

    if (glift.util.outBounds(this.x(), maxIntersections) ||
        glift.util.outBounds(this.x(), maxIntersections)) {
      throw new Error("rotating a point outside the bounds: " +
          this.toString());
    }

    var rotated = normalized;
    if (rotation === rotations.CLOCKWISE_90) {
      rotated = point(normalized.y(), -normalized.x());

    } else if (rotation === rotations.CLOCKWISE_180) {
      rotated = point(-normalized.x(), -normalized.y());

    } else if (rotation === rotations.CLOCKWISE_270) {
      rotated = point(-normalized.y(), normalized.x());
    }

    // renormalize
    return point(mid + rotated.x(), -rotated.y() + mid);
  },

  /**
   * The inverse of rotate (see above)}
   * @param {number} maxIntersections Usually 9, 13, or 19.
   * @param {glift.enums.rotations} rotation Usually 9, 13, or 19.
   * @return {!glift.Point} A rotated point.
   */
  antirotate: function(maxIntersections, rotation) {
    var rotations = glift.enums.rotations
    if (rotation === rotations.CLOCKWISE_90) {
      return this.rotate(maxIntersections, rotations.CLOCKWISE_270)
    } else if (rotation === rotations.CLOCKWISE_180) {
      return this.rotate(maxIntersections, rotations.CLOCKWISE_180)
    } else if (rotation === rotations.CLOCKWISE_270) {
      return this.rotate(maxIntersections, rotations.CLOCKWISE_90)
    } else {
      return this.rotate(maxIntersections, rotation);
    }
  },
};

goog.provide('glift.global');

glift.global = {
  /**
   * Semantic versioning of the core Glift rules/logic.
   * See: http://semver.org/
   *
   * Not yet stable.
   */
  'core-version': '0.9.1'
};

goog.provide('glift.flattener');

/**
 * Helps flatten a go board into a diagram definition. The flattened go board is
 * useful for all sorts of go-board rendering, be it print-rendering or a
 * dynamic UI.
 */
glift.flattener = {};

/**
 * Flattener Options
 *
 * Some notes about the parameters:
 *
 * Optional parameters:
 *  - goban: used for extracting all the inital stones.
 *  - nextMovesPath.  Defaults to [].  This is typically only used for
 *    printed diagrams.
 *  - initPosition.  Defaults to undefined. If not defined, we rely on the
 *    initial position provided by the movetree.
 *  - startingMoveNum.  Optionally override the move number. If not set, it's
 *    automatically determined based on whether the position is on the
 *    mainpath or a variation.
 *
 *  Optional cropping params.
 *  - boardRegion: indicates what region to crop on.
 *  - autoBoxCropOnNextMoves. If set, will automatically crop based on the
 *    nextmoves path.
 *  - regionRestrictions. Array of allowed boardRegions. If the calculated
 *    region is not an member of this set, default to using 'ALL'.
 *  - autoBoxCropOnNextMoves. Whether or not to perform auto-box cropping.
 *
 *  Options for marks
 *  - showNextVariationsType: Whether or not to show variations.
 *  - markLastMove: Whether or not to put a special mark on the last move
 *  - markKo: Whether or not to show the Ko location with a mark.
 *
 *  Options for problems
 *  - problemConditions: determine how to evaluate whether or not a position is
 *    considered 'correct'. Obviously, only useful for problems. Currently only
 *    for showing correct/incorrect moves in the explorer.
 *
 * @typedef {{
 *  goban: (!glift.rules.Goban|undefined),
 *  initPosition: (!glift.rules.Treepath|string|!Array<number>|undefined),
 *  nextMovesPath: (!glift.rules.Treepath|string|!Array<number>|undefined),
 *  startingMoveNum: (number|undefined),
 *  boardRegion: (glift.enums.boardRegions|undefined),
 *  regionRestrictions: (!Array<glift.enums.boardRegions>|undefined),
 *  showNextVariationsType: (glift.enums.showVariations|undefined),
 *  autoBoxCropOnNextMoves: (boolean|undefined),
 *  markLastMove: (boolean|undefined),
 *  selectedNextMove: (?glift.rules.Move|undefined),
 *  showKoLocation: (boolean|undefined),
 *  problemConditions: (!glift.rules.ProblemConditions|undefined)
 * }}
 */
glift.flattener.Options;


/**
 * This data is meant to be used like the following:
 *    '<color> <mvnum> at <collisionStoneColor> <label>'
 * as in this example:
 *    'Black 13 at White 2'
 *
 * Description:
 *  {
 *    color: <color of the move to be played>,
 *    mvnum: <move number>,
 *    label: <label where the collision occured>,
 *    collisionStoneColor: <color of the stone under the label>
 *  }
 *
 * @typedef {{
 *  color: glift.enums.states,
 *  mvnum: number,
 *  label: (string|undefined),
 *  collisionStoneColor: (glift.enums.states|undefined)
 * }}
 */
glift.flattener.Collision;

/**
 * Flatten the combination of movetree, goban, cropping, and treepath into an
 * array (really a 2D array) of symbols, (a Flattened object).
 *
 * @param {!glift.rules.MoveTree} movetreeInitial The movetree is used for
 *    extracting:
 *    -> The marks
 *    -> The next moves
 *    -> The previous move
 *    -> subsequent stones, if a nextMovesPath is present.  These are
 *    given labels.
 * @param {!glift.flattener.Options=} opt_options
 *
 * @return {!glift.flattener.Flattened}
 */
glift.flattener.flatten = function(movetreeInitial, opt_options) {
  // Create a new ref to avoid changing original tree ref.
  var mt = movetreeInitial.newTreeRef();
  var options = opt_options || {};

  if (options.initPosition !== undefined) {
    var initPos = glift.rules.treepath.parseInitialPath(options.initPosition || '');
    mt = mt.getTreeFromRoot(initPos);
  }

  // Use the provided goban, or reclaculate it.  This is somewhat inefficient,
  // so it's recommended that the goban be provided.
  var goban = options.goban || glift.rules.goban.getFromMoveTree(
      mt.getTreeFromRoot(), mt.treepathToHere()).goban;
  var showVars =
      options.showNextVariationsType  || glift.enums.showVariations.NEVER;

  // Note: NMTP is always defined and will, at the very least, be an empty
  // array.
  var nmtp = glift.rules.treepath.parseFragment(options.nextMovesPath || '');

  var optStartingMoveNum = options.startingMoveNum || null;
  // Find the starting move number before applying the next move path.
  if (optStartingMoveNum === null) {
    optStartingMoveNum = glift.flattener.findStartingMoveNum_(mt, nmtp);
  }

  // Starting move num must be defined, so let's get the types right.
  var startingMoveNum = /** @type {number} */ (optStartingMoveNum);

  var boardRegion = glift.flattener.getBoardRegion_(mt, nmtp, options);
  var cropping = glift.orientation.cropbox.get(
      boardRegion, mt.getIntersections());


  // The move number before applying the next move path.
  var baseMoveNum = mt.node().getNodeNum();

  // The move number of the first mainline move in the parent-chain.
  var mainlineMoveNum = mt.getMainlineNode().getNodeNum();

  // Like the above, except in stne format. In other words: {color: <color>,
  // point: <pt>}. null if at the root (or due to weirdness like placements).
  var mainlineMove = mt.getMainlineNode().properties().getMove();

  // We also grab the next mainline move. For variations (for display), we
  // usually want to reference the _next_ move rather than the parent mainline
  // move. As with the mainline move above, the next move can be null.
  var nextMainlineMove = null;
  var nextMainlineNode = mt.getMainlineNode().getChild(0);
  if (nextMainlineNode) {
    nextMainlineMove = nextMainlineNode.properties().getMove();
  }

  // Initial move number -- used to calculate the ending move number.
  var initNodeNumber = mt.node().getNodeNum();

  // Map of ptString to move.
  var applied = glift.rules.treepath.applyNextMoves(mt, goban, nmtp);

  // Map of ptString to stone obj.
  var stoneMap = glift.flattener.stoneMap_(goban, applied.stones);

  // Replace the movetree reference with the new position.  This movetree
  // should be equivalent to applying the initial treepath and then applying
  // the nextmoves treepath.
  mt = applied.movetree;

  // Calculate the ending move number. Since starting move num is only used
  // in conjunction with next moves paths, we can just look at the next moves
  // path array.
  var endingMoveNum = startingMoveNum + nmtp.length - 1;
  if (endingMoveNum < startingMoveNum) {
    // This can occur if we haven't move anywhere. In that case, we won't be
    // using the starting / ending move numbers for labeling the next moves,
    // but it's nice to keep the starting/ending moves coherent.
    endingMoveNum = startingMoveNum;
  }

  var correctNextMoves = glift.flattener.getCorrectNextMoves_(
      mt, options.problemConditions);

  // Get the marks at the current position
  var markMap = glift.flattener.markMap_(mt);

  // Optionally update the labels with labels used to indicate variations.
  var sv = glift.enums.showVariations
  if (showVars === sv.ALWAYS || (
      showVars === sv.MORE_THAN_ONE && mt.node().numChildren() > 1)) {
    glift.flattener.updateLabelsWithVariations_(
        mt, markMap, correctNextMoves, options.selectedNextMove);
  }

  // Calculate the collision stones and update the marks / labels maps if
  // necessary.
  var collisions = glift.flattener.createStoneLabels_(
      applied.stones, stoneMap, markMap, startingMoveNum);

  // Optionally mark the last move played. Existing labels get preference.
  if (options.markLastMove) {
    glift.flattener.markLastMove_(markMap, mt.getLastMove());
  }

  if (options.markKo && !nmtp.length) {
    // We don't mark Ko for when the nextMovesPath (nmtp) is specified. If
    // there's a Ko & nmtp is defined, then stones will be captured but the
    // stones will be left on the board. So there's no point in putting a mark
    // or indicator at that location.
    glift.flattener.markKo_(markMap, goban.getKo());
  }


  // Finally! Generate the intersections double-array.
  var board = glift.flattener.board.create(cropping, stoneMap, markMap);

  var comment = mt.properties().getComment() || '';

  return new glift.flattener.Flattened({
      board: board,
      collisions: collisions,
      comment: comment,
      isOnMainPath: mt.onMainline(),
      baseMoveNum: baseMoveNum,
      startingMoveNum: startingMoveNum,
      endMoveNum: endingMoveNum,
      mainlineMoveNum: mainlineMoveNum,
      mainlineMove: mainlineMove,
      nextMainlineMove: nextMainlineMove,
      stoneMap: stoneMap,
      markMap: markMap,
      // ProblemSpecific fields.
      correctNextMoves: correctNextMoves,
      // TODO(kashomon): Add support directly in the flattener params.
      problemResult: null,
  });
};


/**
 * Returns the board region for a movetree. Relevant configurability:
 *
 * mt: The movetree at the relevant position.
 * nmtp: The next moves treepath.
 *
 * options vars:
 * options.autoBoxCropOnNextMoves: auto-crop based on the just the nextmoves
 *    rather than the whole tree.
 * options.regionRestrictions: AN array
 *
 * This is probably too configurable at the moment.
 *
 * @param {!glift.rules.MoveTree} mt
 * @param {!glift.rules.Treepath} nmtp
 * @param {!glift.flattener.Options} options
 *
 * @return {glift.enums.boardRegions} The board region.
 */
glift.flattener.getBoardRegion_ = function(mt, nmtp, options) {
  var boardRegion =
      options.boardRegion || glift.enums.boardRegions.ALL;
  var autoBoxCropOnNextMoves = options.autoBoxCropOnNextMoves || false;
  if (autoBoxCropOnNextMoves) {
    boardRegion = glift.orientation.getQuadCropFromMovetree(mt, nmtp);
  }
  if (boardRegion === glift.enums.boardRegions.AUTO) {
    boardRegion = glift.orientation.getQuadCropFromMovetree(mt);
  }
  var regionRestrictions = options.regionRestrictions || null;

  if (regionRestrictions) {
    if (glift.util.typeOf(regionRestrictions) !== 'array') {
      throw new Error('Invalid type for options.regionRestrictions: ' +
          'Must be array; was: ' + glift.util.typeOf(regionRestrictions));
    }
    // The user has decided to manuall specify a set of region restrictions.
    for (var i = 0; i < regionRestrictions.length; i++) {
      // We return the first region that matches. The order of the array
      // should give the preference of regions.
      if (boardRegion.indexOf(regionRestrictions[i]) > -1) {
        return regionRestrictions[i];
      }
    }
    return glift.enums.boardRegions.ALL;
  }
  return boardRegion;
};


/**
 * Note: This contains ALL stones for a given position.
 *
 * @param {!glift.rules.Goban} goban The current-state of the goban.
 * @param {!Array<glift.rules.Move>} nextStones that are the result of applying
 *    a next-moves path.
 * @return {!Object<!glift.PtStr, !glift.rules.Move>} Map from point string to stone.
 * @private
 */
glift.flattener.stoneMap_ = function(goban, nextStones) {
  var out = {};
  // Array of {color: <color>, point: <point>}
  var gobanStones = goban.getAllPlacedStones();
  for (var i = 0; i < gobanStones.length; i++) {
    var stone = gobanStones[i];
    out[stone.point.toString()] = stone;
  }

  for (var i = 0; i < nextStones.length; i++) {
    var stone = nextStones[i];
    var mv = { point: stone.point, color: stone.color };
    var ptstr = mv.point.toString();
    if (!out[ptstr]) {
      out[ptstr] = mv;
    }
  }
  return out;
};


/**
 * Example value:
 * {
 *  marks: {
 *    "12,5": 13
 *    "12,3": 23
 *  },
 *  labels: {
 *    "12,3": "A"
 *    "12,4": "B"
 *  }
 * }
 *
 * @typedef{{
 *  marks: !Object<!glift.PtStr, !glift.flattener.symbols>,
 *  labels: !Object<!glift.PtStr, string>
 * }}
 */
glift.flattener.MarkMap;

/**
 * Get the relevant marks.  Returns an object containing two fields: marks,
 * which is a map from ptString to Symbol ID. and labels, which is a map
 * from ptString to text label.
 *
 * If there are two marks on the same intersection specified, the behavior is
 * undefined. Either mark might succeed in being placed. We consider this to be
 * an incorrectly specified SGF/movetree.
 *
 * @param {glift.rules.MoveTree} movetree
 * @return {!glift.flattener.MarkMap}
 * @private
 */
glift.flattener.markMap_ = function(movetree) {
  /** @type {!glift.flattener.MarkMap} */
  var out = { marks: {}, labels: {} };
  var symbols = glift.flattener.symbols;
  /** @type {!Object<glift.rules.prop, !glift.flattener.symbols>} */
  var propertiesToSymbols = {
    CR: symbols.CIRCLE,
    LB: symbols.TEXTLABEL,
    MA: symbols.XMARK,
    SQ: symbols.SQUARE,
    TR: symbols.TRIANGLE
  };
  for (var prop in propertiesToSymbols) {
    var symbol = propertiesToSymbols[prop];
    if (movetree.properties().contains(prop)) {
      var data = movetree.properties().getAllValues(prop);
      for (var i = 0; i < data.length; i++) {
        if (prop === glift.rules.prop.LB) {
          var lblPt = glift.sgf.convertFromLabelData(data[i]);
          var key = lblPt.point.toString();
          out.marks[key] = symbol;
          out.labels[key] = lblPt.value;
        } else {
          var newPts = glift.util.pointArrFromSgfProp(data[i])
          for (var j = 0; j < newPts.length; j++) {
            out.marks[newPts[j].toString()] = symbol;
          }
        }
      }
    }
  }
  return out;
};

/**
 * Automatically finds the starting move number given a movetree position. This
 * is meant to be for well-formed variation paths.  That is, if we are
 * currently on the main path, we expect the next move paths will immediately
 * start on the variation or stay on the main path.
 *
 * Given this, there are three cases to consider:
 *    1. The movetree is on the mainpath and the next moves path stays on the
 *    main path:  Return the nodenum + 1 (this is the
 *    2. The movetere is on the mainpath, but the next move puts us on a
 *    variation. Return 1 (start over)
 *    3.  The movetree starts on a variation.  Count the number of moves since
 *    the mainpath branch.
 *
 * Note: The starting move is only interesting in the case where there's a
 * next-moves-path. If there's no next-moves-path specified, this number is
 * effectively unused.
 *
 * @param {!glift.rules.MoveTree} mt
 * @param {!glift.rules.Treepath} nextMovesPath
 * @return {number}
 * @private
 */
glift.flattener.findStartingMoveNum_ = function(mt, nextMovesPath) {
  mt = mt.newTreeRef();
  if (mt.onMainline()) {
    if (nextMovesPath.length > 0 && nextMovesPath[0] > 0) {
      return 1;
    } else {
      return mt.node().getNodeNum() + 1;
    }
  }
  var mvnum = 1;
  while (!mt.onMainline()) {
    mvnum++;
    mt.moveUp();
  }
  return mvnum;
};

/**
 * Returns a map of ptstr to correct next moves. Usually used for creating marks
 * or other such display-handling.
 *
 * @param {!glift.rules.MoveTree} mt
 * @param {!glift.rules.ProblemConditions|undefined} conditions
 * @return {!Object<glift.PtStr, glift.rules.Move>} object of correct next moves.
 * @private
 */
glift.flattener.getCorrectNextMoves_ = function(mt, conditions) {
  var correctNextMap = {};
  if (conditions && !glift.util.obj.isEmpty(conditions)) {
    var correctNextArr = glift.rules.problems.correctNextMoves(mt, conditions);
    for (var i = 0; i < correctNextArr.length; i++) {
      var move = correctNextArr[i];
      if (move.point) {
        correctNextMap[move.point.toString()] = move;
      }
    }
  }
  return correctNextMap;
};

/**
 * Update the labels with variations numbers of the next movez. This is an
 * optional step and usually isn't done for diagrams-for-print.
 *
 * @param {!glift.rules.MoveTree} mt
 * @param {!glift.flattener.MarkMap} markMap
 * @param {!Object<glift.PtStr, glift.rules.Move>} correctNext Map of
 *    point-string to move, where the moves are moves identified as 'correct'
 *    variations. Will be empty unless problemConditions is defined in the input
 *    options.
 * @param {?glift.rules.Move|undefined} selectedNext For UIs: the selected next
 *    move. If defined, we'll mark the selected next move (somehow).
 * @private
 */
glift.flattener.updateLabelsWithVariations_ = function(
    mt, markMap, correctNext, selectedNext) {
  for (var i = 0; i < mt.node().numChildren(); i++) {
    var move = mt.node().getChild(i).properties().getMove();
    if (move && move.point) {
      var pt = move.point;
      var ptStr = pt.toString();
      if (markMap.labels[ptStr] === undefined) {
        var markValue = '' + (i + 1);
        if (selectedNext &&
            selectedNext.point &&
            ptStr == selectedNext.point.toString()) {
          // Mark the 'selected' variation as active.
          markValue += '.';
          //'\u02D9';
          // -- some options
          // '\u02C8' => ˈ simple
          // '\u02D1' => ˑ kinda cool
          // '\u02D9' => ˙ dot above (actually goes to the right)
          // '\u00B4' => ´
          // '\u0332' => underline
        }
        markMap.labels[ptStr] = markValue;
      }
      if (correctNext[ptStr]) {
        markMap.marks[ptStr] = glift.flattener.symbols.CORRECT_VARIATION;
      } else {
        markMap.marks[ptStr] = glift.flattener.symbols.NEXTVARIATION;
      }
    }
  }
};

/**
 * Create or apply labels to identify collisions that occurred during apply.
 *
 * labels: map from ptstring to label string.
 * startingMoveNum: The number at which to start creating labels
 *
 * returns: an array of collision objects:
 *
 * Sadly, this has has the side effect of altering the marks / labels maps --
 * not in the underlying movetree, but in the ultimate representation in the
 * board.
 *
 * @param {!Array<!glift.rules.Move>} appliedStones The result of applying the
 *    treepath.
 * @param {!Object<!glift.PtStr, !glift.rules.Move>} stoneMap Map of ptstring
 *    to the move.
 * @param {!glift.flattener.MarkMap} markMap
 * @param {number} startingMoveNum
 *
 * @return {!Array<!glift.flattener.Collision>}
 * @private
 */
glift.flattener.createStoneLabels_ = function(
    appliedStones, stoneMap, markMap, startingMoveNum) {
  if (!appliedStones || appliedStones.length === 0) {
    return []; // Don't perform relabeling if no stones are found.
  }
  // Collision labels, for when stone.collision = null.
  var extraLabs = 'abcdefghijklmnopqrstuvwxyz';
  var labsIdx = 0; // Index into extra labels string above.
  var symb = glift.flattener.symbols;
  var collisions = []; // {color: <color>, mvnum: <number>, label: <lbl>}

  // Remove any number labels currently existing in the marks map.
  var digitRegex = /[0-9]/;
  for (var ptstr in markMap.labels) {
    if (digitRegex.test(markMap.labels[ptstr])) {
      delete markMap.labels[ptstr];
      delete markMap.marks[ptstr];
    }
  }

  // Create labels for each stone in the next moves treepath.  Note -- we only
  // add labels in the case when there's a next moves path.
  for (var i = 0; i < appliedStones.length; i++) {
    var stone = appliedStones[i];
    var ptStr = stone.point.toString();
    var nextMoveNum = i + startingMoveNum;
    var colStone = stoneMap[ptStr];
    // If there's a stone in the stone map (which there _should_ be since
    // there's a collision), then we store that in the collision object
    var colStoneColor = undefined;
    if (colStone && colStone.color) {
      colStoneColor = colStone.color;
    }

    // This is a collision stone. Perform collision labeling.
    if (stone.hasOwnProperty('collision')) {
      var col = {
        color: stone.color,
        mvnum: (nextMoveNum),
        label: undefined,
        collisionStoneColor: colStoneColor
      };
      if (markMap.labels[ptStr]) { // First see if there are any available labels.
        col.label = markMap.labels[ptStr];
      } else if (glift.util.typeOf(stone.collision) === 'number') {
        var collisionNum = stone.collision + startingMoveNum;
        col.label = (collisionNum) + ''; // label is idx.
      } else { // should be null
        var lbl = extraLabs.charAt(labsIdx);
        labsIdx++;
        col.label = lbl;
        markMap.marks[ptStr] = symb.TEXTLABEL;
        markMap.labels[ptStr] = lbl;
      }
      collisions.push(col);

    // This is not a collision stone. Perform standard move-labeling.
    } else {
      // Create new labels for our move number.
      markMap.marks[ptStr] = symb.TEXTLABEL; // Override labels.
      markMap.labels[ptStr] = (nextMoveNum) + ''
    }
  }
  return collisions;
};

/**
 * Update the mark map with the last move if:
 *
 * 0. The last move is defined.
 * 1. There is no existing mark in the markMap at the location.
 *
 * @param {!glift.flattener.MarkMap} markMap
 * @param {?glift.rules.Move} lastMove
 */
glift.flattener.markLastMove_ = function(markMap, lastMove) {
  if (lastMove && lastMove.point) {
    var ptstr = lastMove.point.toString();
    if (!markMap.marks[ptstr]) {
      markMap.marks[ptstr] = glift.flattener.symbols.LASTMOVE;
    }
  }
};

/**
 * Optionally mark the Ko move. This only updates the map if:
 *
 * 0. The ko is defined
 * 1. There is no existing mark in the markMap at the location.
 *
 * @param {!glift.flattener.MarkMap} markMap
 * @param {?glift.Point} koLocation
 */
glift.flattener.markKo_ = function(markMap, koLocation) {
  if (koLocation) {
    var ptstr = koLocation.toString();
    if (!markMap.marks[ptstr]) {
      markMap.marks[ptstr] = glift.flattener.symbols.KO_LOCATION;
    }
  }
};

goog.provide('glift.flattener.board');
goog.provide('glift.flattener.Board');
goog.provide('glift.flattener.BoardDiffPt');

glift.flattener.board = {
  /**
   * Constructs a board object: a 2D array of intersections.
   *
   * @param {!glift.orientation.Cropbox} cropping A cropping object, which says
   *    how to crop the board.
   * @param {!Object<!glift.rules.Move>} stoneMap A map from pt-string to
   *    move.
   * @param {!glift.flattener.MarkMap} markMap A map from pt-string to
   *    mark symbol, and a map from pt-string to label string.
   *
   * @return {!glift.flattener.Board<Intersection>}
   */
  create: function(cropping, stoneMap, markMap) {
    var point = glift.util.point;
    var board = [];
    var bbox = cropping.bbox;
    for (var y = bbox.top(); y <= bbox.bottom(); y++) {
      var row = [];
      for (var x = bbox.left(); x <= bbox.right(); x++) {
        var pt = point(x, y);
        var ptStr = pt.toString();
        var stone = stoneMap[ptStr];
        var stoneColor = stone ? stone.color : glift.enums.states.EMPTY;
        var mark = markMap.marks[ptStr];
        var label = markMap.labels[ptStr]
        row.push(glift.flattener.intersection.create(
            pt, stoneColor, mark, label, cropping.size));
      }
      board.push(row);
    }
    return new glift.flattener.Board(board, bbox, cropping.size);
  },

  /**
   * A specialized diffing function to be used for display. This differ checkes
   * whether the stone-layer as different OR the the new intersection has a mark
   * (even if it's the same).
   *
   * @param {!glift.flattener.Intersection} oldPoint
   * @param {!glift.flattener.Intersection} newPoint
   * @return {boolean} Whether or not these points are different
   */
  displayDiff:  function(oldPoint, newPoint) {
    if (newPoint.mark()) {
      // Any time there's a mark, we want to display it, so consider this point
      // as being different.
      return true;
    }
    return oldPoint.stone() !== newPoint.stone();
  },
};

/**
 * Board object.  Meant to be created with the static constuctor method 'create'.
 *
 * @param {!Array<!Array<!T>>} boardArray A matrix of
 *    intersection object of type T.
 * @param {!glift.orientation.BoundingBox} bbox The bounding box of the board
 *    (using board points).
 * @param {number} maxBoardSize Integer number denoting the max board size
 *    (i.e., usually 9, 13, or 19).
 *
 * @template T
 *
 * @constructor @final @struct
 */
glift.flattener.Board = function(boardArray, bbox, maxBoardSize) {
  /**
   * 2D Array of intersections. Generally, this is an array of intersections,
   * but could be backed by a different underlying objects based on a
   * transformation.
   *
   * @private {!Array<!Array<!T>>}
   */
  this.boardArray_ = boardArray;

  /**
   * Bounding box for the crop box.
   *
   * @private {!glift.orientation.BoundingBox}
   */
  this.bbox_ = bbox;

  /**
   * Maximum board size.  Generally 9, 13, or 19.
   *
   * @private {number}
   */
  this.maxBoardSize_ = maxBoardSize;
};

glift.flattener.Board.prototype = {
  /**
   * Returns the size of the board. Usually 9, 13 or 19.
   * @return {number}
   */
  maxBoardSize: function() {
    return this.maxBoardSize_;
  },

  /**
   * Gets the go-intersection at the top left, respecting cropping.
   * @return {!glift.Point}
   */
  topLeft: function() {
    return this.ptToBoardPt(new glift.Point(0,0));
  },

  /**
   * Gets the go-intersection at the bottom right, respecting cropping.
   * @return {!glift.Point}
   */
  botRight: function() {
    return this.topLeft().translate(this.width() - 1, this.height() - 1);
  },

  /**
   * Returns the bounding box (in intersections) of the board.
   * @return {!glift.orientation.BoundingBox}
   */
  boundingBox: function() {
    return new glift.orientation.BoundingBox(this.topLeft(), this.botRight());
  },

  /** @return {boolean} Returns whether the board is cropped. */
  isCropped: function() {
    return this.width() !== this.maxBoardSize() ||
        this.height() !== this.maxBoardSize();
  },

  /**
   * Returns the height of the Go board in intersections. Note that this won't
   * necessarily be the length of the board - 1 due to cropping.
   * @return {number}
   */
  height: function() {
    return this.boardArray_.length;
  },

  /**
   * Returns the width of the Go board in intersections. Note that this won't
   * necessarily be the length of the board - 1 due to cropping.
   * @return {number}
   */
  width: function() {
    // Here we assume that the Go board is rectangular.
    return this.boardArray_[0].length;
  },

  /**
   * Provide a SGF Point (indexed from upper left) and retrieve the relevant
   * intersection.  This  takes into account cropping that could be indicated by
   * the bounding box.
   *
   * In other words, in many diagrams, we may wish to show only
   * a small fraction of the board. Thus, this board will be cropping
   * accordingly.  However, getIntBoardPt allows the user to pass in the normal
   * board coordinates, but indexed from the upper left as SGF coordinates are.
   *
   * Example: For
   * [[ a, b, c, d],
   *  [ e, f, g, h],
   *  [ i, j, k, l]]
   * and this is the upper-right corner of a 19x19, if we getIntBoardPt(17, 2),
   * this would return 'k'. (17=2nd to last column, 2=3rd row down);
   *
   * @param {!glift.Point|number} ptOrX a Point object or, optionaly, a number.
   * @param {number=} opt_y If the first param is a number.
   *
   * @return {T} Intersection or null if the
   *    coordinate is out of bounds.
   */
  // TODO(kashomon): Replace with getBoardPt. It's too confusing to have getInt
  // and getBoardPt (and that is already extremely confusing).
  getIntBoardPt: function(ptOrX, opt_y) {
    if (glift.util.typeOf(ptOrX) === 'number' &&
        glift.util.typeOf(opt_y) === 'number') {
      var pt = glift.util.point(
          /** @type {number} */ (ptOrX), /** @type {number} */ (opt_y));
    } else {
      var pt = ptOrX;
    }
    return this.getInt(this.boardPtToPt(pt));
  },

  /**
   * Get an intersection from the board array. Uses the absolute array
   * positioning. Returns null if the pt doesn't exist on the board.
   *
   * If other words, the first parameter is a column (x), the second parameter
   * is the row (y). Optionally, a glift.Point can be passed in instead of the
   * first parameter
   *
   * Example: getInt(1,2) for
   * [[ a, b, c, d],
   *  [ e, f, g, h],
   *  [ i, j, k, l]]
   * returns j
   *
   * @param {!glift.Point|number} ptOrX a Point object or, optionaly, a number.
   * @param {number=} opt_y If the first param is a number.
   *
   * @return {T}
   */
  getInt: function(ptOrX, opt_y) {
    if (glift.util.typeOf(ptOrX) === 'number' &&
        glift.util.typeOf(opt_y) === 'number') {
      var pt = glift.util.point(
          /** @type {number} */ (ptOrX), /** @type {number} */ (opt_y));
    } else {
      var pt = ptOrX;
    }
    var row = this.boardArray_[pt.y()];
    if (!row) { return null };
    return row[pt.x()] || null;
  },

  /**
   * Turns a 0 indexed pt to a point that's board-indexed (i.e., that's offset
   * according to the bounding box).
   *
   * @param {!glift.Point} pt
   * @return {!glift.Point} The translated point
   */
  ptToBoardPt: function(pt) {
    return pt.translate(this.bbox_.left(), this.bbox_.top());
  },

  /**
   * Turns a 0 indexed pt to a point that's board-indexed. What this means, is
   * that we take into account the cropping that could be provided by the
   * bounding box. This could return the IntPt, but it could be different.
   *
   * @param {!glift.Point} pt
   * @return {!glift.Point} The translated point
   */
  boardPtToPt: function(pt) {
    return pt.translate(-this.bbox_.left(), -this.bbox_.top());
  },

  /**
   * Returns the board array.
   * @return {!Array<!Array<!T>>}
   */
  boardArray: function() {
    return this.boardArray_;
  },

  /**
   * Transforms the intersections into a board instance based on the
   * transformation function.
   *
   * Generally, expects a function of the form:
   *    fn(intersection, x, y);
   *
   * Where X and Y are indexed from the top left and range from 0 to the
   * cropping box width / height respectively.  Equivalently, you can think of x
   * and y as the column and row, although I find this more confusing.
   *
   * @param {function(T, number, number): U} fn Function that takes an
   *    Intersection, an x, and a y, and returns a new Intersection.
   * @return {!glift.flattener.Board<U>} A new board object.
   *
   * @template U
   */
  transform: function(fn) {
    var outArray = [];
    for (var y = 0; y < this.boardArray_.length; y++) {
      var row = [];
      // Assumes a rectangular double array but this should always be the case.
      for (var x = 0; x < this.boardArray_[0].length; x++) {
        var intersect = this.boardArray_[y][x];
        row.push(fn(intersect, x, y));
      }
      outArray.push(row);
    }
    return new glift.flattener.Board(outArray, this.bbox_, this.maxBoardSize_);
  },

  /**
   * Create a diff between this board and another board. Obviously for the board
   * diff to make sense, the boards must have the same type. This compares each
   * intersection and, if they are not equal, adds the intersection to the
   * output.
   *
   * It is required that the boards be the same dimensions, or else an error is
   * thrown.
   *
   * @param {!glift.flattener.Board<T>} newBoard
   * @return {!Array<!glift.flattener.BoardDiffPt<T>>}
   */
  diff: function(newBoard) {
    /**
     * @param {T} oldPoint
     * @param {T} newPoint
     * @return boolean Whether or not these points are different (or rather, not
     *    equal for this particular diffFn).
     */
    var diffFn = function(oldPoint, newPoint) {
      if (oldPoint.equals && typeof oldPoint.equals === 'function') {
        // Equals is defined, let's use it.
        return !oldPoint.equals(newPoint);
      } else {
        // Use regular !== since equals isn't defined
        return oldPoint !== newPoint;
      }
    };
    return this.differ(newBoard, diffFn);
  },

  /**
   * General method for performing diff-ing. Takes a newBoard and a function for
   * determining if the points are different.
   *
   * @param {!glift.flattener.Board<T>} newBoard
   * @param {!function(T, T):boolean} diffFn A diffFn is a function that takes
   *    two parameters: the old point and the new point. If they are
   *    different, the diffFn returns true (answering the question: 'are they
   *    different?') and returns false if they are thsame.
   */
  differ: function(newBoard, diffFn) {
    if (!newBoard|| !newBoard.boardArray_ || !newBoard.bbox_ || !newBoard.maxBoardSize_) {
      throw new Error('Diff board not defined or not a flattener board');
    }
    if (this.height() !== newBoard.height() || this.width() !== newBoard.width()) {
      throw new Error('Boards do not have the same dimensions.' +
        ' This: h:' + this.height() + ' w:' + this.width() +
        ' That: h:' + newBoard.height() + ' w:' + newBoard.width());
    }
    var out = [];
    for (var i = 0; i < this.boardArray_.length; i++) {
      var row = this.boardArray_[i];
      var thatrow = newBoard.boardArray_[i];

      for (var j = 0; j < row.length; j++) {
        var intp = row[j];
        var newIntp = thatrow[j];

        // Out of bounds. This shouldn't happen if the diff function is used in
        // a sane way.
        if (!newIntp) { break; }
        var ptsAreDifferent = diffFn(intp, newIntp);
        if (ptsAreDifferent) {
          var pt = new glift.Point(j, i);
          out.push(new glift.flattener.BoardDiffPt(
            intp, newIntp, pt, this.ptToBoardPt(pt)));
        }
      }
    }
    return out;
  }
};

/**
 * Container that indicates a place in the board where there was a difference
 * between two different boards.
 *
 * @param {T} prevValue
 * @param {T} newValue
 * @param {!glift.Point} colRowPt. A pt from the original array, where the x and
 *    and y are the col and row respectively.
 * @param {!glift.Point} boardPt. A point that's board-indexed (i.e., that's
 *    offset according to the bounding box).
 *
 * @template T
 *
 * @constructor @final @struct
 */
glift.flattener.BoardDiffPt = function(prevValue, newValue, colRowPt, boardPt) {
  this.prevValue = prevValue;
  this.newValue = newValue;
  this.colRowPt = colRowPt;
  this.boardPt = boardPt;
};

goog.provide('glift.flattener.BoardPoints');
goog.provide('glift.flattener.EdgeLabel');
goog.provide('glift.flattener.BoardPt');

/**
 * A collection of values indicating in intersection  on the board. The intPt is
 * the standard (0-18,0-18) point indexed from the upper left. The coordPt is
 * the float point in pixel space. Lastly, each intersection on the board 'owns'
 * an area of space, indicated by the bounding box.
 *
 * @typedef {{
 *  intPt: !glift.Point,
 *  coordPt: !glift.Point,
 * }}
 */
glift.flattener.BoardPt;

/**
 * A label on the edge of the board, for when the draw board coordinates option
 * is set.
 *
 * @typedef {{
 *  label: string,
 *  coordPt: !glift.Point
 * }}
 */
glift.flattener.EdgeLabel;


/**
 * Options for creating a BoardPoints instance.
 *
 * @typedef {{
 *  drawBoardCoords: (boolean|undefined),
 *  padding: (number|undefined),
 *  croppedEdgePadding: (number|undefined),
 *  offsetPt: (!glift.Point|undefined),
 * }}
 *
 * drawBoardCoords: whether to draw the board coordinates:
 * padding: Amount of extra spacing around the edge of the board. As a fraction
 *    of an intersection. Defaults to zero.
 *    Example: If padding = 0.75 and spacing = 20, then the actual
 *    padding around each edge will be 15.
 * croppedEdgePadding: Same as padding, but only for cropped-edges and in
 *    addition to normal padding.
 * offsetPt: It's possible that we may want to offset the board points (as in
 *    glift, for centering within a boardbox).
 */
glift.flattener.BoardPointsOptions;

/**
 * BoardPoints is a helper for actually rendering the board when pixel
 * representations are required.
 *
 * In more detail: board points maintains a mapping from an intersection on the
 * board to a coordinate in pixel-space. It also contains information about the
 * spacing of the points and the radius (useful for drawing circles).
 *
 * Later, this is directly to create everything that lives on an intersection.
 * In particular,
 *  - lines
 *  - star ponts
 *  - marks
 *  - stones
 *  - stone shadows
 *  - button bounding box.
 *
 * @param {!Array<!glift.flattener.BoardPt>} points
 * @param {number} spacing
 * @param {!glift.orientation.BoundingBox} intBbox
 * @param {number} numIntersections
 * @param {!Array<!glift.flattener.EdgeLabel>} edgeLabels
 *
 * @constructor @final @struct
 */
glift.flattener.BoardPoints = function(
    points, spacing, intBbox, coordBbox, numIntersections, edgeLabels) {
  /** @const {!Array<!glift.flattener.BoardPt>} */
  this.points = points;

  /** @const {!Object<!glift.PtStr, !glift.flattener.BoardPt>} */
  this.cache = {};
  for (var i = 0; i < this.points.length; i++) {
    var pt = points[i];
    this.cache[pt.intPt.toString()] = pt;
  }

  /** @const {number} */
  this.spacing = spacing;
  /** @const {number} */
  this.radius = spacing / 2;

  /**
   * Bounding box for the intersections.
   * @const {!glift.orientation.BoundingBox}
   */
  this.intBbox = intBbox;

  /**
   * Coordinate bounding box.
   * @const {!glift.orientation.BoundingBox}
   */
  this.coordBbox = coordBbox;

  /** @const {number} */
  this.numIntersections = numIntersections;

  /** @const {!Array<!glift.flattener.EdgeLabel>} */
  this.edgeLabels = edgeLabels;
};

glift.flattener.BoardPoints.prototype = {
  /** @return {number} intersection-width */
  intWidth: function() { return this.intBbox.width() + 1; },
  /** @return {number} intersection-width */
  intHeight: function() { return this.intBbox.height() + 1; },

  /**
   * Get the coordinate for a given integer point string.  Note: the integer
   * points are 0 indexed, i.e., 0->18 for a 19x19.  Recall that board points
   * from the the top left (0,0) to the bottom right (18, 18).
   *
   * @param {!glift.Point} pt
   * @return {!glift.flattener.BoardPt}
   */
  getCoord: function(pt) {
    return this.cache[pt.toString()];
  },

  /**
   * Return all the points as an array.
   * @return {!Array<!glift.flattener.BoardPt>}
   */
  data: function() {
    return this.points;
  },

  /**
   * Test whether an integer point exists in the points map.
   * @param {!glift.Point} pt
   * @return {boolean}
   */
  hasCoord: function(pt) {
    return this.cache[pt.toString()] !== undefined;
  },

  /**
   * Return an array on integer points (0-indexed), used to indicate where star
   * points should go. Ex. [(3,3), (3,9), (3,15), ...].  This only returns the
   * points that are actually present in the points mapping.
   *
   * @return {!Array<!glift.Point>}
   */
  starPoints: function() {
    var sp = glift.flattener.starpoints.allPts(this.numIntersections);
    var out = [];
    for (var i = 0; i < sp.length; i++) {
      var p = sp[i];
      if (this.hasCoord(p)) {
        out.push(p);
      }
    }
    return out;
  }
};

/**
 * Creates a beard points wrapper from a flattened object.
 *
 * @param {!glift.flattener.Flattened} flat
 * @param {number} spacing In pt.
 * @param {glift.flattener.BoardPointsOptions=} opt_options
 */
glift.flattener.BoardPoints.fromFlattened =
    function(flat, spacing, opt_options) {
  var opts = opt_options || {};
  var bbox = flat.board().boundingBox();
  return glift.flattener.BoardPoints.fromBbox(
      bbox,
      spacing,
      flat.board().maxBoardSize(),
      opts);
};

/**
 * Creates a board points wrapper.
 *
 * @param {glift.orientation.BoundingBox} bbox In intersections. For a typical board,
 *    TL is 0,0 and BR is 18,18.
 * @param {number} spacing Of the intersections. In pt.
 * @param {number} size
 * @param {!glift.flattener.BoardPointsOptions} opts
 * @return {!glift.flattener.BoardPoints}
 */
glift.flattener.BoardPoints.fromBbox =
    function(bbox, spacing, size, opts) {
  var tl = bbox.topLeft();
  var br = bbox.botRight();

  var half = spacing / 2;
  /** @type {!Array<!glift.flattener.BoardPt>} */
  var bpts = [];
  /** @type {!Array<!glift.flattener.EdgeLabel>} */
  var edgeLabels = [];

  var drawBoardCoords = !!opts.drawBoardCoords;
  var paddingFrac = opts.padding || 0;
  var paddingAmt = paddingFrac * spacing;

  // Note: Convention is to leave off the 'I' coordinate. Note that capital
  // letters are enough for normal boards.
  var xCoordLabels = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz';

  var offsetPt = opts.offsetPt || new glift.Point(0,0);

  var raggedEdgePaddingFrac = opts.croppedEdgePadding || 0;
  var raggedAmt = raggedEdgePaddingFrac * spacing;
  var raggedLeft = tl.x() === 0 ? 0 : raggedAmt;
  var raggedRight = br.x() === size-1 ? 0 : raggedAmt;
  var raggedTop = tl.y() === 0 ? 0 : raggedAmt;
  var raggedBottom = br.y() === size-1 ? 0 : raggedAmt;

  var offset = drawBoardCoords ? 1 : 0;
  var startX = tl.x();
  var endX = br.x() + 2*offset;
  var startY = tl.y();
  var endY = br.y() + 2*offset;

  var coordBbox = new glift.orientation.BoundingBox(
    new glift.Point(0,0),
    new glift.Point(
        (endX-startX+1)*spacing + 2*paddingAmt + raggedLeft + raggedRight,
        (endY-startY+1)*spacing + 2*paddingAmt + raggedTop + raggedBottom));

  var isEdgeX = function(val) { return val === startX || val === endX; }
  var isEdgeY = function(val) { return val === startY || val === endY; }

  for (var x = startX; x <= endX; x++) {
    for (var y = startY; y <= endY; y++) {
      var i = x - startX;
      var j = y - startY;
      var coordPt = new glift.Point(
          half + i*spacing + paddingAmt + offsetPt.x() + raggedLeft,
          half + j*spacing + paddingAmt + offsetPt.y() + raggedTop)

      if (drawBoardCoords && (isEdgeX(x) || isEdgeY(y))) {
        if (isEdgeX(x) && isEdgeY(y)) {
          // This is a corner; no coords here.
          continue;
        }

        if (raggedLeft && i === 0) {
          coordPt = coordPt.translate(-raggedLeft, 0);
        }
        if (raggedRight && x === endX) {
          coordPt = coordPt.translate(raggedRight, 0);
        }
        if (raggedTop && j === 0) {
          coordPt = coordPt.translate(0, -raggedTop);
        }
        if (raggedBottom && y === endY) {
          coordPt = coordPt.translate(0, raggedBottom);
        }

        var label = '';
        if (isEdgeY(y)) {
          label = xCoordLabels[x-1];
        } else if (isEdgeX(x)) {
          label = (size-y+1) + '';
        } else {
          throw new Error('Yikes! Should not happen! pt:' + x + ',' + y);
        }
        edgeLabels.push({
          label: label,
          coordPt: coordPt,
        });
      } else {

        bpts.push({
          intPt: new glift.Point(x - offset, y - offset),
          coordPt: coordPt,
        });
      }
    }
  }
  return new glift.flattener.BoardPoints(
      bpts,
      spacing,
      bbox,
      coordBbox,
      size,
      edgeLabels);
};

goog.provide('glift.flattener.Flattened');
goog.provide('glift.flattener.FlattenedParams');

/**
 * The Flattened object is complex. We pass in a strongly parameter object for
 * convenience.
 *
 * @typedef {{
 *  board: !glift.flattener.Board,
 *  collisions: !Array<!glift.flattener.Collision>,
 *  comment: string,
 *  isOnMainPath: boolean,
 *  baseMoveNum: number,
 *  startingMoveNum: number,
 *  endMoveNum: number,
 *  mainlineMoveNum: number,
 *  mainlineMove: ?glift.rules.Move,
 *  nextMainlineMove: ?glift.rules.Move,
 *  stoneMap: !Object<glift.PtStr, !glift.rules.Move>,
 *  markMap: !glift.flattener.MarkMap,
 *  correctNextMoves: !Object<glift.PtStr, !glift.rules.Move>,
 *  problemResult: ?glift.enums.problemResults
 * }}
 */
glift.flattener.FlattenedParams;


/** @private {!Object<number, !glift.flattener.Flattened>} */
glift.flattener.emptyFlattenedCache_ = {};

/**
 * Public method for returning an empty flattened object of a specific size.
 * Sometimes it's useful to have an empty flattened board, especially if one is
 * doing a 'diff' operation.
 *
 * @param {number} size
 * @return {!glift.flattener.Flattened}
 */
glift.flattener.emptyFlattened = function(size) {
  if (glift.flattener.emptyFlattenedCache_[size]) {
    return glift.flattener.emptyFlattenedCache_[size];
  }
  var mt = glift.rules.movetree.getInstance(size);
  var flat = glift.flattener.flatten(mt);
  glift.flattener.emptyFlattenedCache_[size] = flat;
  return flat;
};

/**
 * Data used to populate either a display or diagram.
 *
 * @param {!glift.flattener.FlattenedParams} params
 * @constructor @final @struct
 */
glift.flattener.Flattened = function(params) {
  /**
   * Board wrapper. Essentially a double array of intersection objects.
   * @private {!glift.flattener.Board}
   */
  this.board_ = params.board;

  /**
   * @private {!Array<!glift.flattener.Collision>}
   * @const
   */
  this.collisions_ = params.collisions;

  /**
   * @private {string}
   * @const
   */
  this.comment_ = params.comment;

  /**
   * Whether or not the position is on the 'top' (zeroth) variation.
   * @private {boolean}
   * @const
   */
  this.isOnMainPath_ = params.isOnMainPath;

  /**
   * The base move number before applying the next moves path. Equivalent to the
   * nodeNum of the movetree before applying the next move path.
   *
   * @private {number}
   * @const
   */
  this.baseMoveNum_ = params.baseMoveNum;

  /**
   * The starting and ending move numbers. These should be used for labeling
   * diagrams, and is only relevant in the context of a next-moves-path diagram.
   *
   * @private {number}
   * @const
   */
  this.startMoveNum_ = params.startingMoveNum;

  /** @const @private {number} */
  this.endMoveNum_ = params.endMoveNum;

  /**
   * The move number of the first mainline move in the parent-chain. Can be
   * useful for print-diagram creation, when referencing the mainlinemove.
   * @const @private {number}
   */
  this.mainlineMoveNum_ = params.mainlineMoveNum;

  /**
   * The move -- {color: <color>, point: <pt>} at the first mainline move in the
   * parent tree. Can be null if no move exists at the node.
   * @private {?glift.rules.Move}
   * @const
   */
  this.mainlineMove_ = params.mainlineMove;

  /**
   * The next mainline move after the mainline move above.. Usually variations
   * are variations on the _next_ move, so it's usually useful to reference the
   * next move.
   * @private {?glift.rules.Move}
   * @const
   */
  this.nextMainlineMove_ = params.nextMainlineMove;

  /**
   * All the stones for O(1) convenience =D.
   * @private {!Object<glift.PtStr, !glift.rules.Move>}
   * @const
   */
  this.stoneMap_ = params.stoneMap;

  /**
   * All the marks!
   * @private {!glift.flattener.MarkMap}
   * @const
   */
  this.markMap_ = params.markMap;

  /**
   * The variations that, according to the problem conditions supplied are
   * correct. By default, variations are considered incorrect.
   * @private {!Object<glift.PtStr, !glift.rules.Move>}
   * @const
   */
  this.correctNextMoves_ = params.correctNextMoves;

  /**
   * Problem result. Whether or not a particular problem position should be
   * considered correct or incorret.
   * @private {?glift.enums.problemResults}
   */
  this.problemResult_ = params.problemResult;
};

glift.flattener.Flattened.prototype = {
  /**
   * Return the constructed board.
   * @return {!glift.flattener.Board}
   */
  board: function() { return this.board_; },

  /**
   * The comment for the position.
   * @return {string}
   */
  comment: function() { return this.comment_; },

  /**
   * A structure illustrating the board collisions. Only relevant for positions
   * with a next moves path. Will always be defined, but could be empty.
   *
   * Array of collisions objects.  In other words, we record stones that
   * couldn't be placed on the board.
   *
   * Each object in the collisions array looks like:
   *    {color: <color>, mvnum: <number>, label: <label>}
   * (although the source of truth is in the typedef).
   *
   * @return {!Array<!glift.flattener.Collision>}
   */
  collisions: function() { return this.collisions_; },

  /**
   * Whether or not this position is on the main line or path variation.  For
   * game review diagrams, it's usually nice to distinguish between diagrams for
   * the real game and diagrams for exploratory variations.
   *
   * @return {boolean}
   */
  isOnMainPath: function() { return this.isOnMainPath_; },

  /**
   * Returns the base move number before applying the next moves path. In an
   * interactive viewer, this would be considered the current move number.
   *
   * @return {number}
   */
  baseMoveNum: function() { return this.baseMoveNum_; },

  /**
   * Returns the starting move number. Should only be used in the context of a
   * next-moves-path diagram.
   *
   * Note that the starting move number (and ending move numbers) are labeled
   * based on whether or not the variation is on the 'main path'. If on the main
   * path, the starting/ending move numbers are equivalent to the move-node
   * number. If on a variation, counting starts over based from 1, where 1 is
   * the first move off the main line.
   *
   * @return {number}
   */
  startingMoveNum: function() { return this.startMoveNum_; },

  /**
   * Returns the ending move number. Should be tha same as the starting move
   * number if no nextMovesPath is specified.
   *
   * @return {number}
   */
  endingMoveNum: function() { return this.endMoveNum_; },

  /**
   * Returns the first mainline move number in the parent-chain. This will be
   * equal to the startingMoveNum if isOnMainPath = true.
   *
   * @return {number}
   */
  mainlineMoveNum: function() { return this.mainlineMoveNum_; },

  /**
   * Returns the move number of the nextMainlineMove (regardless of whether or
   * not it exists.
   *
   * @return {number}
   */
  nextMainlineMoveNum: function() { return this.mainlineMoveNum() + 1; },

  /**
   * Returns the first mainline move in the parent-chain. Can be null if no move
   * exists and has the form {color: <color>, pt: <pt>} if defined.
   *
   * @return {?glift.rules.Move}
   */
  mainlineMove: function() { return this.mainlineMove_; },

  /**
   * Returns the next mainline move after the mainline move in the parent-chain.
   * Can be null if no move exists and has the form {color: <color>, pt: <pt>}
   * if defined.
   *
   * @return {?glift.rules.Move}
   */
  nextMainlineMove: function() { return this.nextMainlineMove_; },

  /**
   * Returns the stone map. An object with the following structure:
   *
   * @return {!Object<glift.PtStr, !glift.rules.Move>}
   */
  stoneMap: function() { return this.stoneMap_; },

  /**
   * Returns the labels map. An object with the following structure:
   *
   * @return {!Object<glift.PtStr, string>}
   */
  labels: function() {
    return this.markMap_.labels;
  },

  /**
   * Returns the marks map. An object with the following structure:
   * where the numbers correspond to an entry in glift.flattener.symbols.
   *
   * Note: This will include the TEXTLABEL symbol, even though the labels map
   * duplicates this information to some degree.
   *
   * @return {!Object<glift.PtStr, glift.flattener.symbols>}
   */
  marks: function() {
    return this.markMap_.marks;
  },

  /**
   * Currently, the flattener does not compute problem correctness, so it is up
   * to the user to manually set problem correctness.
   *
   * @param {glift.enums.problemResults} result
   */
  // TODO(kashomon): Remove once this is set from the flattener.
  setProblemResult: function(result) {
    this.problemResult_ = result;
  },

  /**
   * The problem-status. One of correct, incorrect, or indeterminate, if
   * specified; null, otherwise.
   *
   * @return {?glift.enums.problemResults} The problem correctness.
   */
  problemResult: function() { return this.problemResult_ },

  /**
   * Helper for truncating labels if the labels are numbers > 100, which
   * is typically helpful for diagram-display. A no-op for all other labels
   * This used to be done automatically, but there are cases where users may
   * wish to preserve full 3 digit labels.
   *
   * Note: This helper only truncates when branchLength = endNum - startNum <
   * 100.
   *
   * @param {(number|string)} numOrString: The number represented either as a
   *    string or a number (probably the former, but who are we to judge?).
   * @return {string} The processed string label.
   */
  autoTruncateLabel: function(numOrString) {
    var num = numOrString;
    if (typeof numOrString === 'number') {
      // noop
    } else if (typeof numOrString === 'string' && /\d+/.test(numOrString)) {
      num = parseInt(numOrString, 10);
    } else {
      return numOrString;
    }
    var branchLength = this.endingMoveNum() - this.startingMoveNum();
    if (num > 100 && branchLength < 100 && num % 100 !== 0) {
      // Truncation time!
      num = num % 100;
    }
    return num + '';
  }
};

goog.provide('glift.flattener.intersection');
goog.provide('glift.flattener.Intersection');

glift.flattener.intersection = {
  /**
   * Creates an intersection obj.
   *
   * @param {!glift.Point} pt 0-indexed and bounded by the number
   *    of intersections.  Thus, typically between 0 and 18. Note, the zero for
   *    this point is the top-left rather than the more traditional
   *    bottom-right, as it is for kifus.
   * @param {glift.enums.states} stoneColor EMPTY here is used to indicate that
   *    we don't want to set the stone.
   * @param {!glift.flattener.symbols} mark Mark for the stone
   * @param {string} textLabel text label for the stone. Should really only be
   *    set when the mark is TEXTLABEL.
   * @param {number} maxInts The maximum number of intersections on the board.
   *    Typically 9, 13 or 19.
   *
   * @return {!glift.flattener.Intersection}
   */
  create: function(pt, stoneColor, mark, textLabel, maxInts) {
    var sym = glift.flattener.symbols;
    var intsect = new glift.flattener.Intersection(pt);

    if (pt.x() < 0 || pt.y() < 0 ||
        pt.x() >= maxInts || pt.y() >= maxInts) {
      throw new Error('Pt (' + pt.x() + ',' + pt.y() + ')' + ' is out of bounds.');
    }

    var intz = maxInts - 1;
    var baseSymb = sym.EMPTY;
    if (pt.x() === 0 && pt.y() === 0) {
      baseSymb = sym.TL_CORNER;
    } else if (pt.x() === 0 && pt.y() === intz) {
      baseSymb = sym.BL_CORNER;
    } else if (pt.x() === intz && pt.y() === 0) {
      baseSymb = sym.TR_CORNER;
    } else if (pt.x() === intz && pt.y() === intz) {
      baseSymb = sym.BR_CORNER;
    } else if (pt.y() === 0) {
      baseSymb = sym.TOP_EDGE;
    } else if (pt.x() === 0) {
      baseSymb = sym.LEFT_EDGE;
    } else if (pt.x() === intz) {
      baseSymb = sym.RIGHT_EDGE;
    } else if (pt.y() === intz) {
      baseSymb = sym.BOT_EDGE;
    } else if (glift.flattener.starpoints.isPt(pt, maxInts)) {
      baseSymb = sym.CENTER_STARPOINT;
    } else {
      baseSymb = sym.CENTER;
    }
    intsect.setBase(baseSymb);

    if (stoneColor === glift.enums.states.BLACK) {
      intsect.setStone(sym.BSTONE);
    } else if (stoneColor === glift.enums.states.WHITE) {
      intsect.setStone(sym.WSTONE);
    }

    if (mark !== undefined) {
      intsect.setMark(mark);
    }

    if (textLabel !== undefined) {
      intsect.setTextLabel(textLabel);
    }

    return intsect;
  },
};

/**
 * Represents a flattened intersection. Separated into 3 layers: 
 *  - Base layer (intersection abels)
 *  - Stone layer (black, white, or empty)
 *  - Mark layer (shapes, text labels, etc.)
 *
 * Shouldn't be constructed directly outside of this file.
 *
 * @param {!glift.Point} pt
 *
 * @constructor @final @struct
 */
glift.flattener.Intersection = function(pt) {
  var EMPTY = glift.flattener.symbols.EMPTY;

  /** @private {!glift.Point} */
  this.pt_ = pt;
  /** @private {glift.flattener.symbols} */
  this.baseLayer_ = EMPTY;
  /** @private {glift.flattener.symbols} */
  this.stoneLayer_ = EMPTY;
  /** @private {glift.flattener.symbols} */
  this.markLayer_ = EMPTY;

  /**
   * Optional text label. Should only be set when the mark layer symbol is some
   * sort of text-symbol (e.g., TEXTLABEL, NEXTVARIATION)
   * @private {?string}
   */
  this.textLabel_ = null;
};

/**
 * Static maps to evaluate symbol validity.
 */
glift.flattener.intersection.layerMapping = {
  base: {
    EMPTY: true, TL_CORNER: true, TR_CORNER: true, BL_CORNER: true,
    BR_CORNER: true, TOP_EDGE: true, BOT_EDGE: true, LEFT_EDGE: true,
    RIGHT_EDGE: true, CENTER: true, CENTER_STARPOINT: true
  },
  stone: {
    EMPTY: true, BSTONE: true, WSTONE: true
  },
  mark: {
    EMPTY: true, TRIANGLE: true, SQUARE: true, CIRCLE: true, XMARK: true,
    TEXTLABEL: true, LASTMOVE: true, NEXTVARIATION: true,
    CORRECT_VARIATION: true, KO_LOCATION: true,
  }
};

glift.flattener.Intersection.prototype = {
  /**
   * @param {glift.flattener.symbols} s Symbol to validate
   * @param {string} layer
   * @private
   */
  validateSymbol_: function(s, layer) {
    var str = glift.flattener.symbolStr(s);
    if (!str) {
      throw new Error('Symbol Val: ' + s + ' is not a defined symbol.');
    }
    if (!glift.flattener.intersection.layerMapping[layer][str]) {
      throw new Error('Incorrect layer for: ' + str + ',' + s +
          '. Layer was ' + layer);
    }
    return s;
  },

  /**
   * Test whether this intersection is equal to another intersection.
   * @param {!Object} thatint
   * @return {boolean}
   */
  equals: function(thatint) {
    if (thatint == null) {
      return false;
    }
    var that = /** @type {!glift.flattener.Intersection} */ (thatint);
    return this.pt_.equals(that.pt_) &&
        this.baseLayer_ === that.baseLayer_ &&
        this.stoneLayer_ === that.stoneLayer_ &&
        this.markLayer_ === that.markLayer_ &&
        this.textLabel_ === that.textLabel_;
  },

  /** @return {glift.flattener.symbols} Returns the base layer. */
  base: function() { return this.baseLayer_; },

  /** @return {glift.flattener.symbols} Returns the stone layer. */
  stone: function() { return this.stoneLayer_; },

  /** @return {glift.flattener.symbols} Returns the mark layer. */
  mark: function() { return this.markLayer_; },

  /** @return {?string} Returns the text label. */
  textLabel: function() { return this.textLabel_; },

  /**
   * Sets the base layer.
   * @param {!glift.flattener.symbols} s
   * @return {!glift.flattener.Intersection} this
   */
  setBase: function(s) {
    this.baseLayer_ = this.validateSymbol_(s, 'base');
    return this;
  },

  /**
   * Sets the stone layer.
   * @param {!glift.flattener.symbols} s
   * @return {!glift.flattener.Intersection} this
   */
  setStone: function(s) {
    this.stoneLayer_ = this.validateSymbol_(s, 'stone');
    return this;
  },

  /**
   * Sets the mark layer.
   * @param {!glift.flattener.symbols} s
   * @return {!glift.flattener.Intersection} this
   */
  setMark: function(s) {
    this.markLayer_ = this.validateSymbol_(s, 'mark');
    return this;
  },

  /**
   * Sets the text label.
   * @param {string} t
   * @return {!glift.flattener.Intersection} this
   */
  setTextLabel: function(t) {
    this.textLabel_ = t + '';
    return this;
  },

  /**
   * Clears the text label
   * @return {!glift.flattener.Intersection} this
   */
  clearTextLabel: function() {
    this.textLabel_ = null;
    return this;
  }
};

/**
 * Helpers for constructing better labels. This contains logic for creating
 * label annotanions from collisions and helpers for replacing the stone labels
 * (i.e., with icons/images/etc.)
 *
 * This is largely designed for print (IRL books!) since it is only relevant for
 * a next-moves-path style Diagram, but also can be useful for Game-Figure-style
 * UIs.
 */
glift.flattener.labels = {
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
   * @type {!RegExp}
   */
  // TODO(kashomon): Support symbols? Ex: Black Triangle.
  inlineLabelRegex: new RegExp(
      '(Black|White) ' +
      '([A-Z]|([0-9]{1,3})|(\\(([A-Za-z]|[0-9]{1,3})\\)))' +
      '(?=($|\\n|\\r|\\s|["\',:;.$?~`<>{}\\[\\]()!@_-]))',
      ''),

  /**
   * Global version of the above. Must be defined lazily due the dependence on
   * the previous regex.
   * @private {?RegExp}
   */
  inlineLabelRegexGlobal_: null,

  /**
   * Supply a fn to replace stones found within text. In other words, we look
   * through comment text, replacing occurences of substrings like 'Black 12'.
   * What to replace these with is left up to the caller, but implicitly, the
   * expectation as that the caller will replace these with images (like an
   * image of a Black stone overlayed with a 12 label). This is less useful for
   * UIs, but is essential for Print diagrams.
   *
   *
   * Returns new text with the relevant replacements.
   *
   * @param {string} text The input text.
   * @param {function(string, string, string): string} fn A function that takes
   *    - Fullmatch, (Ex: Black 10)
   *    - Player (Ex: Black)
   *    - Label (ex: 10)
   * @return {string} processed text
   */
  replaceInline: function(text, fn) {
    if (!glift.flattener.labels.inlineLabelRegexGlobal_) {
      glift.flattener.labels.inlineLabelRegexGlobal_ = new RegExp(
          glift.flattener.labels.inlineLabelRegex.source, 'g');
    }
    var reg = glift.flattener.labels.inlineLabelRegexGlobal_;
    return text.replace(reg, function(full, player, label) {
      // Handle the case like 'Black (123)' so that we just pass the label and
      // not the (123)
      if (label.charAt(0) === '(' && label.charAt(label.length - 1) === ')') {
        label = label.substring(1, label.length - 1);
      }
      return fn(full, player, label);
    });
  },

  /**
   * Construct a label based on the collisions in the flattened object.
   * In the end, this will look something like
   *
   *  Black 10, White 13 and a.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @return {string}
   */
  createCollisionLabel: function(flattened) {
    return glift.flattener.labels.labelFromCollisions(
        flattened.collisions());
  },

  /**
   * Construct the label based on the flattened object *and* the move numbers.
   * In the end, this will look something like
   *
   *    (Moves 1-3)
   *    Black 10, White 13 and a.
   *
   * Notes:
   *    - The move label is only generated when on the main path.
   *    - The collision label is only generated when there are collisions.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @return {string}
   */
  createFullLabel: function(flattened) {
    return glift.flattener.labels.fullLabelFromCollisions(
        flattened.collisions(),
        flattened.isOnMainPath(),
        flattened.startingMoveNum(),
        flattened.endingMoveNum());
  },

  /**
   * @param {!Array<!glift.flattener.Collision>} collisions
   * @param {boolean} isOnMainPath
   * @param {number} startNum
   * @param {number} endNum
   * @return {string} the processed move label or an empty string if no label
   *    should be created.
   */
  fullLabelFromCollisions: function(collisions, isOnMainPath, startNum, endNum) {
    var label = ''
    if (isOnMainPath) {
      label += glift.flattener.labels.constructMoveLabel(startNum, endNum);
    }
    var col = glift.flattener.labels.labelFromCollisions(collisions);
    if (label && col) {
      // If both move label and the collision label is defined, join with a
      // newline.
      return label + '\n' + col;
    }
    return label + col;
  },

  /**
   * Create a move label. This is generally intended only for mainline
   * sequences, but can be used anywhere.
   *
   * @param {number} startNum
   * @param {number} endNum
   * @return {string} the processed move label or an empty string if it 
   */
  constructMoveLabel: function(startNum, endNum) {
    var baseLabel = '';
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
    return baseLabel;
  },

  /**
   * Construct the collision label based on the flattened object. From the
   * flattened object, we must extract the collisions and the move numbers.
   *
   * @param {!Array<!glift.flattener.Collision>} collisions
   * @return {string} the processed collisions label.
   */
  labelFromCollisions: function(collisions) {
    var baseLabel = '';

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
    /** @type {!Array<string>} */
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
      // diagrams with lots of moves.
      allRows = glift.flattener.labels.compactifyLabels_(allRows);
    }

    baseLabel += allRows.join(',\n') + '.';
    return baseLabel;
  },

  /**
   * Compactify collision rows from _constructLabel. This is an uncommon
   * edgecase for the majority of diagrams; it means that there were captures +
   * plays at many locations.
   *
   * To preserve space, this method collapses labels that look like "Black 5 at
   * White 6\n, Black 7, White 10 at Black 3." into one line.
   *
   * @param {!Array<string>} collisionRows
   * @return {!Array<string>}
   */
  compactifyLabels_: function(collisionRows) {
    var out = [];
    var buffer = null;
    // Here we overload the usage of replaceInline to count the number labels in
    // a row.
    var numInlineLabels = function(row) {
      var count = 0;
      glift.flattener.labels.replaceInline(row, function(full, player, label) {
        count += 1;
        return full;
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

goog.provide('glift.flattener.starpoints');

glift.flattener.starpoints = {
  /**
   * @const {!Object<number, !Array<!Array<number>>>}
   * @private
   */
  pts_: {
    9: [[4,4]],
    13: [
          [3,3], [3,9],
             [6,6],
          [9,3], [9,9],
        ],
    19: [
          [3,3],  [3,9],  [3,15],
          [9,3],  [9,9],  [9,15],
          [15,3], [15,9], [15,15],
        ],
  },

  /**
   * Lookup map for pts.
   * @private {!Object<number, !Object<glift.PtStr, boolean>>}
   */
  map_: {},

  /**
   * @param {glift.Point} pt
   * @param {number} size
   * @return {boolean} Whether the point is a starpoint.
   */
  isPt: function(pt, size) {
    var map = glift.flattener.starpoints.map_[size];
    if (!map) {
      var newmap = {};
      var allPts = glift.flattener.starpoints.allPts(size);
      for (var i = 0; i < allPts.length; i++) {
        newmap[allPts[i].toString()] = true;
      }
      glift.flattener.starpoints.map_[size] = newmap;
      map = newmap;
    }
    return !!map[pt.toString()];
  },

  /**
   * @param {number} size
   * @return {!Array<!glift.Point>} All the points that should be considered
   * starpoints.
   */
  allPts: function(size) {
    /** @type {!Array<glift.Point>} */
    var out = [];
    var ptz = glift.flattener.starpoints.pts_[size] || [];
    for (var i = 0; i < ptz.length; i++) {
      var p = ptz[i];
      out.push(new glift.Point(p[0], p[1]));
    }
    return out;
  },
};

goog.provide('glift.flattener.symbols');

/**
 * Symbolic representation of a Go Board display.
 * @enum {number}
 */
glift.flattener.symbols = {
  // Empty location.  Useful for creating dense arrays.  Can be used for any of
  // the three layers. Assigned to 0 for the usefulness of truthiness.
  EMPTY: 0,

  //
  // Board symbols.  This comprises the first layer.
  //
  TL_CORNER: 2,
  TR_CORNER: 3,
  BL_CORNER: 4,
  BR_CORNER: 5,
  TOP_EDGE: 6,
  BOT_EDGE: 7,
  LEFT_EDGE: 8,
  RIGHT_EDGE: 9,
  CENTER: 10,
  // Center + starpoint. Maybe should just be starpoint, but this is more clear.
  CENTER_STARPOINT: 11,

  //
  // Stone symbols. This comprises the second layer.
  //
  BSTONE: 20,
  WSTONE: 21,

  //
  // Labels and marks. This comprises the third layer.
  //
  TRIANGLE: 30,
  SQUARE: 31,
  CIRCLE: 32,
  XMARK: 33,

  // Text Labeling (numbers or letters)
  TEXTLABEL: 34,

  // Extra marks, used for display.  These are not specified by the SGF
  // specification, but they are often useful.
  LASTMOVE: 35,

  // It's useful to destinguish between standard TEXTLABELs and NEXTVARIATION
  // labels.
  NEXTVARIATION: 36,

  // Variation identified as correct
  CORRECT_VARIATION: 37,

  // Location for a Ko
  KO_LOCATION: 38,
};

/**
 * Mapping between flattener stone symbol and a glift color-state enum.
 * @type {!Object<glift.flattener.symbols, glift.enums.states>}
 */
glift.flattener.symbolStoneToState = {
  0: glift.enums.states.EMPTY,
  20: glift.enums.states.BLACK,  // BSTONE,
  21: glift.enums.states.WHITE, // WSTONE
};

/**
 * Mapping between flattener mark symbol and a glift mark enum.
 * @type {!Object<glift.flattener.symbols, glift.enums.marks>}
 */
glift.flattener.symbolMarkToMark = {
  30: glift.enums.marks.TRIANGLE,
  31: glift.enums.marks.SQUARE,
  32: glift.enums.marks.CIRCLE,
  33: glift.enums.marks.XMARK,

  34: glift.enums.marks.LABEL, // TEXTLABEL

  35: glift.enums.marks.STONE_MARKER, // LASTMOVE
  36: glift.enums.marks.VARIATION_MARKER, // NEXTVARIATION
  37: glift.enums.marks.CORRECT_VARIATION, // CORRECT_VARIATION
  38: glift.enums.marks.KO_LOCATION,
};

/**
 * Look-up map that allows us to determine a string key for a symbol number.
 * Lazily initialized via symbolStr.
 *
 * @private {Object<number, string>}
 */
glift.flattener.reverseSymbol_ = null;

/**
 * Convert a symbol number to a symbol string.
 * @param {number} num Symbol number
 * @return {string} Symbol name
 */
glift.flattener.symbolStr = function(num) {
  if (glift.flattener.reverseSymbol_ == null) {
    // Create and store a reverse mapping.
    var reverse = {};
    var symb = glift.flattener.symbols;
    for (var key in glift.flattener.symbols) {
      reverse[symb[key]] = key;
    }
    glift.flattener.reverseSymbol_ = reverse;
  }
  return glift.flattener.reverseSymbol_[num];
};

goog.provide('glift.markdown');
goog.provide('glift.markdown.Ast');

goog.require('glift.marked');

/**
 * Marked is dumped into this namespace. Just for reference
 * https://github.com/chjj/marked
 */
glift.markdown = {
  /** Render the AST from some text. */
  renderAst: function(text) {
    // We expect the markdown extern to be exposed.
    var lex = glift.marked.lexer(text);
    return new glift.markdown.Ast(lex);
  },

  render: function(text) {
    return glift.marked(text);
  }
};

/**
 * Wrapper object for the abstract syntax tree.
 *
 * @param {!Array<!glift.marked.Token>} tree Array of tokens.
 * @constructor @final @struct
 */
glift.markdown.Ast = function(tree) {
  /** The token array */
  this.tree = tree;
};

glift.markdown.Ast.prototype = {
  /**
   * Returns just the headers. We assume no nested headers.
   * @return{!Array<!glift.marked.Token>} Array of header tokens.
   */
  headers: function() {
    var out = [];
    for (var i = 0; i < this.tree.length; i++) {
      var elem = this.tree[i];
      if (elem.type === 'heading') {
        out.push(elem);
      }
    }
    return out;
  }
};

goog.provide('glift.marked');

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * Modified by Kashomon to include basic closure type checking.
 */
goog.scope(function() {

/**
 * Helpers
 * @param {string} html Content to encode
 * @param {boolean=} opt_encode Optional encode param
 */
function escape(html, opt_encode) {
  // TODO(kashomon): Currently I've disabled escaping because it's not language
  // agnostic. TODO(kashomon): Flag guardthis function to conditionally turn
  // auto-escaping off.
  return html;
  // return html
    // .replace(!opt_encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    // .replace(/</g, '&lt;')
    // .replace(/>/g, '&gt;')
    // .replace(/"/g, '&quot;')
    // .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

/**
 * An extremely clever function. Successively replaces content in the
 *
 * @param {!RegExp} regexBase Regexp object
 * @param {!string=} opt_flags Optional regex flags
 *
 * Note: The return type is complex and thus elided.
 */
function replace(regexBase, opt_flags) {
  var regex = regexBase.source;
  var opt = opt_flags || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

/**
 * @param {!Object} obj Base object
 * @param {...!Object} var_args Target objects to merge into
 */
function merge(obj, var_args) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked Parse Method.
 *
 * @param {string} src Source text to process
 * @param {(!glift.marked.Options|Function)=} opt_options Marked options or
 *    callback
 * @param {Function=} opt_callback
 */
var marked = function(src, opt_options, opt_callback) {
  /** @type {Function} */
  var callback;
  /** @type {glift.marked.Options|undefined} */
  var opt;

  if (opt_callback || typeof opt_options === 'function') {
    if (!opt_callback) {
      // opt_options must be the callback.
      callback = /** @type {Function} */ (opt_options);
      opt = undefined;
    }

    opt = /** @type {glift.marked.Options} */ (
        merge({}, glift.marked.defaults, opt_options || {}));

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    /**
     * Done callback
     * @param {string=} err Optional err message.
     */
    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    // No callback available.
    if (opt_options) {
      opt = merge({}, glift.marked.defaults, opt_options);
    }
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/kashomon/glift.';
    if ((opt_options || glift.marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
};

glift.marked = marked;
glift.marked.parse = marked;

/**
 * Noop function that acts like a Regex object.
 */
var noop = function() {};
noop.exec = noop;

/**
 * Block-Level Grammar
 * @constructor
 * @struct
 */
var Blocker = function() {
  this.newline = /^\n+/;
  this.code = /^( {4}[^\n]+\n*)+/;
  this.fences = noop;
  this.hr = /^( *[-*_]){3,} *(?:\n+|$)/;
  this.heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/;
  this.nptable = noop,
  this.lheading = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
  this.blockquote = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/;
  this.list = /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/;
  this.html = /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/;
  this.def = /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/;
  this.table = noop;
  this.paragraph = /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/;
  this.text = /^[^\n]+/;
  this.bullet = /(?:[*+-]|\d+\.)/;
  this.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
  this.item = replace(this.item, 'gm')
    (/bull/g, this.bullet)
    ();
  this.list = replace(this.list)
    (/bull/g, this.bullet)
    ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
    ('def', '\\n+(?=' + this.def.source + ')')
    ();
  this.blockquote = replace(this.blockquote)
    ('def', this.def)
    ();
  this._tag = '(?!(?:'
    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
    + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
    + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';
  this.html = replace(this.html)
    ('comment', /<!--[\s\S]*?-->/)
    ('closed', /<(tag)[\s\S]+?<\/\1>/)
    ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
    (/tag/g, this._tag)
    ();
  this.paragraph = replace(this.paragraph)
    ('hr', this.hr)
    ('heading', this.heading)
    ('lheading', this.lheading)
    ('blockquote', this.blockquote)
    ('tag', '<' + this._tag)
    ('def', this.def)
    ();
  /** Normal Block Grammar */
  this.normal = merge({}, this);
  /** GFM Block Grammar */
  this.gfm = merge({}, this.normal, {
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/
  });
  this.gfm.paragraph = replace(this.paragraph)
    ('(?!', '(?!'
      + this.gfm.fences.source.replace('\\1', '\\2') + '|'
      + this.list.source.replace('\\1', '\\3') + '|')
    ();
  /**
   * GFM + Tables Block Grammar
   */
  this.tables = merge({}, this.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
  });
};

var block = new Blocker();

/**
 * @typedef {{
 *  type: string,
 *  text: (string|undefined),
 *  lang: (string|undefined),
 *  depth: (number|undefined),
 *  header: (string|undefined),
 *  align: (string|undefined),
 *  cells: (string|undefined),
 *  ordered: (boolean|undefined),
 *  pre: (string|undefined),
 *  href: (string|undefined),
 *  title: (string|undefined)
 * }}
 */
glift.marked.Token;


/**
 * Block Lexer
 *
 * @constructor
 *
 * @param {glift.marked.Options=} opt_options
 */
glift.marked.Lexer = function(opt_options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = opt_options || glift.marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
};

var Lexer = glift.marked.Lexer;

/**
 * Expose Block Rules
 */
Lexer.rules = block;

/**
 * Static Lex Method
 *
 * @param {string} src
 * @param {glift.marked.Options=} opt_options
 *
 * @return {!Array<!glift.marked.Token>} Array of tokens
 */
Lexer.lex = function(src, opt_options) {
  var lexer = new Lexer(opt_options);
  return lexer.lex(src);
};

glift.marked.lexer = Lexer.lex;

/**
 * Preprocessing
 *
 * @return {!Array<!glift.marked.Token>} Array of tokens.
 */
Lexer.prototype.lex = function(src) {
  src = src
    // Convert carriage returns into newlines
    .replace(/\r\n|\r/g, '\n')
    // Convert tabs to 4 spaces
    .replace(/\t/g, '    ')
    // Convert No-break space to a normal space
    .replace(/\u00a0/g, ' ')
    // Weird Unicode newline codepoint
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing. Tokenize some source text
 *
 * (Kashomon:I have no idea what top or bq do. They look like hacky flags to
 * encode state).
 *
 * @param {string} src Source text
 * @param {boolean=} top
 * @param {boolean=} bq
 *
 * @return {!Array<!glift.marked.Token>}
 *
 */
Lexer.prototype.token = function(src, top, bq) {
  src = src.replace(/^ +$/gm, '')
  var next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 *
 * @constructor
 */
glift.marked.InlineLexer = function(links, options) {
  this.options = options || glift.marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

var InlineLexer = glift.marked.InlineLexer;

/**
 * Expose Inline Rules
 */
InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */
InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

glift.marked.inlineLexer = InlineLexer.output;

/**
 * Lexing/Compiling
 */
InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */
InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */
InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */
InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 *
 * @constructor
 * @param {glift.marked.Options=} opt_options
 */
glift.marked.Renderer = function(opt_options) {
  this.options = opt_options || {};
}

var Renderer = glift.marked.Renderer;

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

/**
 * Constructs an HTML Image string.
 * @param {string} href
 * @param {string} title
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 *
 * @constructor
 * @param {glift.marked.Options=} opt_options
 */
glift.marked.Parser = function(opt_options) {
  this.tokens = [];
  this.token = null;
  this.options = opt_options || glift.marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

var Parser = glift.marked.Parser;

/**
 * Static Parse Method
 * @param {!Array<glift.marked.Token>} src Array of tokens.
 * @param {glift.marked.Options=} opt_options Optional marked options
 */
Parser.parse = function(src, opt_options) {
  var parser = new Parser(opt_options);
  return parser.parse(src);
};

glift.marked.parse = Parser.parse;

/**
 * Parse Loop
 * @param {!Array<glift.marked.Token>} src Array of tokens.
 */
Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */
Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */
Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */
Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse the current token
 */
Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * @typedef {{
 *  gfm: (boolean|undefined),
 *  tables: (boolean|undefined),
 *  breaks: (boolean|undefined),
 *  pedantic: (boolean|undefined),
 *  sanitize: (boolean|undefined),
 *  smartLists: (boolean|undefined),
 *  silent: (boolean|undefined),
 *  highlight: (?Function|undefined),
 *  langPrefix: (string|undefined),
 *  smartypants: (boolean|undefined),
 *  headerPrefix: (string|undefined),
 *  renderer: (!glift.marked.Renderer|undefined),
 *  xhtml: (boolean|undefined)
 * }}
 */
glift.marked.Options;

/**
 * @type {!glift.marked.Options}
 */
glift.marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false
};

/**
 * Options
 */
glift.marked.setOptions = function(opt) {
  merge(glift.marked.defaults, opt);
  return glift.marked.parse;
};

glift.marked.options = glift.marked.setOptions;

});  // goog.scope

goog.provide('glift.markdown.Renderer');

goog.scope(function() {

/**
 * A renderer for use with Marked. This is a record type, so as to indicate the
 * types.
 *
 * @record
 */
glift.markdown.Renderer = function () {}

var Renderer = glift.markdown.Renderer;

/**
 * Renders a code block.
 * @param {string} code
 * @param {string} language
 * @return {string}
 */
Renderer.prototype.code = function(code, language) {};

/**
 * Renders a blockquote.
 * @param {string} quote
 * @return {string}
 */
Renderer.prototype.blockquote = function(quote) {};

/**
 * Renders HTML.
 * @param {string} html
 * @return {string}
 */
Renderer.prototype.html = function(html) {};

/**
 * Renders a header/heading.
 * @param {string} text The text
 * @param {number} level Of the header
 * @return {string}
 */
Renderer.prototype.heading = function(text, level) {};

/**
 * Renders a horizontal rule.
 * @return {string} The horizontal rule.
 */
Renderer.prototype.hr = function() {};

/**
 * Render a list
 * @param {string} body
 * @param {boolean} ordered Whether the list is an ordered list.
 * @return {string}
 */
Renderer.prototype.list = function(body, ordered) {};

/**
 * Render a list item
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.listitem = function(text) {};

/**
 * Render a paragraph
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.paragraph = function(text) {};

/**
 * @param {string} header
 * @param {string} body
 * @return {string}
 */
Renderer.prototype.table = function(header, body) {};

/**
 * @param {string} content
 * @return {string}
 */
Renderer.prototype.tablerow = function(content) {};

/**
 * @param {string} content
 * @param {!Object} flags
 * @return {string}
 */
Renderer.prototype.tablecell = function(content, flags) {};

///////////////////////////////////
// Inline level renderer methods //
///////////////////////////////////

/**
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.strong = function(text) {};

/**
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.em = function(text) {};

/**
 * @param {string} code
 * @return {string}
 */
Renderer.prototype.codespan = function(code) {};

/** @return {string} Rendered line break. */
Renderer.prototype.br = function() {};

/**
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.del = function(text) {};

/**
 * Render a link.
 * @param {string} href
 * @param {string} title
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.link = function(href, title, text) {};

/**
 * @param {string} image
 * @param {string} title
 * @param {string} text
 * @return {string}
 */
Renderer.prototype.image = function(image, title, text) {};

});

goog.provide('glift.orientation');

glift.orientation = {};

goog.provide('glift.orientation.bbox');
goog.provide('glift.orientation.BoundingBox');

glift.orientation.bbox = {
  /** Return a new bounding box with two points. */
  fromPts: function(topLeftPt, botRightPt) {
    return new glift.orientation.BoundingBox(topLeftPt, botRightPt);
  },

  /** Return a new bounding box with a top left point, a width, and a height. */
  fromSides: function(topLeft, width, height) {
    return new glift.orientation.BoundingBox(
        topLeft, glift.util.point(topLeft.x() + width, topLeft.y() + height));
  }
};

/**
 * A bounding box, represented by a top left point and bottom right point.
 * This is how we represent space in glift, from GoBoards to sections allocated
 * for widgets.
 *
 * @param {!glift.Point} topLeftPt The top-left point of the bounding box.
 * @param {!glift.Point} botRightPt The bottom right point of the bounding box.
 * @constructor @final @struct
 */
glift.orientation.BoundingBox = function(topLeftPt, botRightPt) {
  if (topLeftPt.x() > botRightPt.x() ||
      topLeftPt.y() > botRightPt.y()) {
    throw new Error('Topleft point must be less than the ' +
        'bottom right point. tl:' + topLeftPt.toString() +
        '; br:' + botRightPt.toString());
  }
  this._topLeftPt = topLeftPt;
  this._botRightPt = botRightPt;
};

glift.orientation.BoundingBox.prototype = {
  topLeft: function() { return this._topLeftPt; },
  botRight: function() { return this._botRightPt; },
  /** TopRight and BotLeft are constructed */
  topRight: function() {
    return glift.util.point(this.right(), this.top());
  },
  botLeft: function() {
    return glift.util.point(this.left(), this.bottom());
  },
  width: function() { return this.botRight().x() - this.topLeft().x(); },
  height: function() { return this.botRight().y() - this.topLeft().y(); },
  top: function() { return this.topLeft().y(); },
  left: function() { return this.topLeft().x(); },
  bottom: function() { return this.botRight().y(); },
  right: function() { return this.botRight().x(); },

  /**
   * Find the center of the box. Returns a point representing the center.
   */
  center: function() {
    return glift.util.point(
      Math.abs((this.botRight().x() - this.topLeft().x()) / 2)
          + this.topLeft().x(),
      Math.abs((this.botRight().y() - this.topLeft().y()) / 2)
          + this.topLeft().y());
  },

  /**
   * Test to see if a point is contained in the bounding box.  Points on the
   * edge count as being contained.
   *
   * We assume a canonical orientation of the top left being the minimum and the
   * bottom right being the maximum.
   */
  contains: function(point) {
   return point.x() >= this.topLeft().x()
      && point.x() <= this.botRight().x()
      && point.y() >= this.topLeft().y()
      && point.y() <= this.botRight().y();
  },

  /**
   * Test whether this bbox completely covers another bbox.
   */
  covers: function(bbox) {
    return this.contains(bbox.topLeft()) &&
        this.contains(bbox.botRight());
  },

  /**
   * Intersect this bbox with another bbox and return a new bbox that represents
   * the intersection.
   *
   * Returns null if the intersection is the emptyset.
   */
  intersect: function(bbox) {
    // Note: Boxes overlap iff one of the boxes contains at least one of
    // the corners.
    var bboxOverlaps =
        bbox.contains(this.topLeft()) ||
        bbox.contains(this.topRight()) ||
        bbox.contains(this.botLeft()) ||
        bbox.contains(this.botRight()) ||
        this.contains(bbox.topLeft()) ||
        this.contains(bbox.topRight()) ||
        this.contains(bbox.botLeft()) ||
        this.contains(bbox.botRight());
    if (!bboxOverlaps) {
      return null;
    }

    var top = Math.max(this.top(), bbox.top());
    var left = Math.max(this.left(), bbox.left());
    var bottom = Math.min(this.bottom(), bbox.bottom());
    var right = Math.min(this.right(), bbox.right());
    return glift.orientation.bbox.fromPts(
        glift.util.point(left, top),
        glift.util.point(right, bottom));
  },

  /**
   * Returns a new bounding box that has been expanded to contain the point.
   */
  expandToContain: function(point) {
    // Note that for our purposes the top left is 0,0 and the bottom right is
    // (+N,+N). Thus, by this definition, the top left is the minimum and the
    // bottom right is the maximum (true for both x and y).
    var tlx = this.topLeft().x();
    var tly = this.topLeft().y();
    var brx = this.botRight().x();
    var bry = this.botRight().y();
    if (point.x() < tlx) {
      tlx = point.x();
    }
    if (point.y() < tly) {
      tly = point.y();
    }
    if (point.x() > brx) {
      brx = point.x();
    }
    if (point.y() > bry) {
      bry = point.y();
    }
    return glift.orientation.bbox.fromPts(
        glift.util.point(tlx, tly),
        glift.util.point(brx, bry));
  },

  /**
   * Test to see if two bboxes are equal by comparing whether their points.
   */
  equals: function(other) {
    return other.topLeft() && this.topLeft().equals(other.topLeft()) &&
        other.botRight() && this.botRight().equals(other.botRight());
  },

  /**
   * Return a new bbox with the width and the height scaled by some fraction.
   * The TopLeft point is also scaled by the amount.
   */
  scale: function(amount) {
    var newHeight = this.height() * amount,
        newWidth = this.width() * amount,
        newTopLeft = glift.util.point(
            this.topLeft().x() * amount, this.topLeft().y() * amount);
    return glift.orientation.bbox.fromSides(newTopLeft, newWidth, newHeight);
  },

  /**
   * @returns {string} Stringified version of the bounding box.
   */
  toString: function() {
    return '(' + this.topLeft().toString() + '),(' +
        this.botRight().toString() + ')';
  },

  /**
   * Move the bounding box by translating the box
   * @param {number} dx
   * @param {number} dy
   * @return {glift.orientation.BoundingBox} A new bounding box.
   */
  translate: function(dx, dy) {
    return glift.orientation.bbox.fromPts(
        glift.util.point(this.topLeft().x() + dx, this.topLeft().y() + dy),
        glift.util.point(this.botRight().x() + dx, this.botRight().y() + dy));
  },

  // TODO(kashomon): Move this splitting methods out of the base class.

  /**
   * Split this bbox into two or more divs across a horizontal axis.  The
   * variable bboxSplits is an array of decimals -- the box will be split via
   * these decimals.
   *
   * In other words, splits a box like so:
   *
   * X ->  X
   *       X
   *
   * Note: There is always one less split decimal specified, so that we don't
   * have rounding errors.In other words: [0.7] uses 0.7 and 0.3 for splits and
   * [0.7, 0.2] uses 0.7, 0.2, and 0.1 for splits.
   */
  hSplit: function(bboxSplits) {
    return this._splitBox('h', bboxSplits);
  },

  /**
   * Split this bbox into two or more divs across a horizontal axis.  The
   * variable bboxSplits is an array of decimals -- the box will be split via
   * these decimals.  They must sum to 1, or an exception is thrown.
   *
   * In other words, splits a box like so:
   * X ->  X X
   *
   * Note: There is always one less split decimal specified, so that we don't
   * have rounding errors. In other words: [0.7] uses 0.7 and 0.3 for splits and
   * [0.7, 0.2] uses 0.7, 0.2, and 0.1 for splits.
   */
  vSplit: function(bboxSplits) {
    return this._splitBox('v', bboxSplits);
  },

  /**
   * Internal method for vSplit and hSplit.
   */
  _splitBox: function(d, bboxSplits) {
    if (glift.util.typeOf(bboxSplits) !== 'array') {
      throw "bboxSplits must be specified as an array. Was: "
          + glift.util.typeOf(bboxSplits);
    }
    if (!(d === 'h' || d === 'v')) {
      throw "What!? The only splits allowed are 'v' or 'h'.  " +
          "You supplied: " + d;
    }
    var totalSplitAmount = 0;
    for (var i = 0; i < bboxSplits.length; i++) {
      totalSplitAmount += bboxSplits[i];
    }
    if (totalSplitAmount >= 1) {
      throw "The box splits must sum to less than 1, but instead summed to: " +
          totalSplitAmount;
    }

    // Note: this is really just used as marker.  We use the final
    // this.botRight().x() / y() for the final marker to prevent rounding
    // errors.
    bboxSplits.push(1 - totalSplitAmount);

    var currentSplitPercentage = 0;
    var outBboxes = [];
    var currentTopLeft = this.topLeft().clone();
    for (var i = 0; i < bboxSplits.length; i++) {
      if (i === bboxSplits.length - 1) {
        currentSplitPercentage = 1;
      } else {
        currentSplitPercentage += bboxSplits[i];
      }

      // TODO(kashomon): All this switching makes me think there should be a
      // separate method for a single split.
      var nextBotRightX = d === 'h' ?
          this.botRight().x() :
          this.topLeft().x() + this.width() * currentSplitPercentage;
      var nextBotRightY = d === 'h' ?
          this.topLeft().y() + this.height() * currentSplitPercentage :
          this.botRight().y();
      var nextBotRight = glift.util.point(nextBotRightX, nextBotRightY);
      outBboxes.push(glift.orientation.bbox.fromPts(
          currentTopLeft, nextBotRight));
      var nextTopLeftX = d === 'h' ?
          currentTopLeft.x() :
          this.topLeft().x() + this.width() * currentSplitPercentage;
      var nextTopLeftY = d === 'h' ?
          this.topLeft().y() + this.height() * currentSplitPercentage :
          currentTopLeft.y();
      currentTopLeft = glift.util.point(nextTopLeftX, nextTopLeftY);
    }
    return outBboxes;
  }
};

goog.provide('glift.orientation.Cropbox');

/**
 * Definition of the cropbox
 *
 * @constructor @final @struct
 */
glift.orientation.Cropbox = function(bbox, size) {
  /**
   * Points in the bounding box are 0 indexed.
   * ex. 0,8, 0,12, 0,18
   */
  this.bbox = bbox;

  /** Size is 1 indexed (i.e., 19, 13, 9). */
  this.size = size;

  if (this.bbox.width() > this.size - 1) {
    throw new Error('BBox width cannot be bigger than the size:' +
        this.bbox.width() + ' -- ' + (this.size - 1));
  }

  if (this.bbox.height() > this.size - 1) {
    throw new Error('BBox height cannot be bigger than the size:' +
        this.bbox.height() + ' -- ' + (this.size - 1));
  }
};

glift.orientation.Cropbox.prototype = {
  /** Whether or not the top is ragged. */
  hasRaggedTop: function() {
    return this.bbox.topLeft().y() > 0;
  },
  /** Whether or not the left is ragged. */
  hasRaggedLeft: function() {
    return this.bbox.topLeft().x() > 0;
  },
  /** Whether or not the bottom is ragged. */
  hasRaggedBottom: function() {
    return this.bbox.botRight().y() < this.size - 1;
  },
  /** Whether or not the right is ragged. */
  hasRaggedRight: function() {
    return this.bbox.botRight().x() < this.size - 1;
  }
};

/**
 * Bounding boxes associated with the corpbox regions.
 */
glift.orientation.cropbox = {
  /**
   * Return a bounding box that indicates the cropbox. The logic is somewhat
   * nuanced:
   *
   * For corners:
   *   - the ragged top/bottom are +/- 1
   *   - the ragged right/left are +/- 2
   *
   * For edges:
   *   - the ragged top/bottom/right/eft are +/- 1
   *
   * For board sizes < 19, the cropbox is the whole board.
   *
   * @param {glift.enums.boardRegions} region
   * @param {number} intersects
   * @return {!glift.orientation.Cropbox}
   */
  get: function(region, intersects) {
    var point = glift.util.point,
        boardRegions = glift.enums.boardRegions,
        min = 0,
        max = intersects - 1,
        halfInts = Math.ceil(max / 2),
        top = min,
        left = min,
        bot = max,
        right = max;

    region = region || boardRegions.ALL;

    if (intersects < 19) {
      return new glift.orientation.Cropbox(
          glift.orientation.bbox.fromPts(
              point(min, min), point(max, max)),
          intersects);
    }

    switch(region) {
      // X X
      // X X
      case boardRegions.ALL:
          break;

      // X -
      // X -
      case boardRegions.LEFT:
          right = halfInts + 1;
          break;

      // - X
      // - X
      case boardRegions.RIGHT:
          left = halfInts - 1;
          break;

      // X X
      // - -
      case boardRegions.TOP:
          bot = halfInts + 1;
          break;

      // - -
      // X X
      case boardRegions.BOTTOM:
          top = halfInts - 1;
          break;

      // X -
      // - -
      case boardRegions.TOP_LEFT:
          bot = halfInts + 1;
          right = halfInts + 2;
          break;

      // - X
      // - -
      case boardRegions.TOP_RIGHT:
          bot = halfInts + 1;
          left = halfInts - 2;
          break;

      // - -
      // X -
      case boardRegions.BOTTOM_LEFT:
          top = halfInts - 1;
          right = halfInts + 2;
          break;

      // - -
      // - X
      case boardRegions.BOTTOM_RIGHT:
          top = halfInts - 1;
          left = halfInts - 2;
          break;

      default:
          // Note: this can happen if we've let AUTO or MINIMAL slip in here
          // somehow.
          throw new Error('Unknown board region: ' + region);
    }
    var bbox = glift.orientation.bbox.fromPts;
    var pt = glift.util.point;
    return new glift.orientation.Cropbox(
        bbox(pt(left, top), pt(right, bot)), intersects);
  }
};

/**
 * Takes a movetree and returns the optimal BoardRegion-Quad for cropping purposes.
 *
 * This isn't a minimal cropping: we split the board into 4 quadrants.
 * Then, we use the quad as part of the final quad-output. 
 *
 * Optionally, we allow a nextMovesPath so that we can 'optimally' crop just a
 * variation.
 *
 * Note: that we only allow convex shapes for obvious reasons.  Thus, these
 * aren't allowed (where the X's are quad-regions)
 * .X     X.
 * X. and XX
 *
 * @param {!glift.rules.MoveTree} movetree The movetree we want to find the
 *    optimal cropping-region for.
 * @param {!(glift.rules.Treepath|string)=} opt_nextMovesPath 
 *    Optional next moves path for cropping along a specific path.
 *
 * @return {!glift.enums.boardRegions} The resulting boardregion cropping.
 */
glift.orientation.getQuadCropFromMovetree =
    function(movetree, opt_nextMovesPath) {
  var br = glift.enums.boardRegions;
  var ints = movetree.getIntersections();
  // It's not clear to me if we should be cropping boards smaller than 19.  It
  // usually looks pretty weird, so hence this override.
  if (ints < 19) {
    return br.ALL;
  }

  var minimalBox = glift.orientation.minimalBoundingBox(
      movetree, opt_nextMovesPath);
  var boxMapping = glift.orientation.getCropboxMapping_();
  for (var i = 0; i < boxMapping.length; i++) {
    var obj = boxMapping[i];
    if (obj.bbox.covers(minimalBox)) {
      return obj.result;
    }
  }

  throw new Error('None of the boxes cover the minimal bbox!! ' +
      'This should never happen');
};

/**
 * An object contatin a pair: A bounding box and the board region it
 * corresponds to.
 *
 * @typedef {{
 *  bbox: !glift.orientation.BoundingBox,
 *  result: !glift.enums.boardRegions
 * }}
 */
glift.orientation.CropboxMapping;


/**
 * For 19x19, we cache the cropbox mappings.
 * @private {?Object<!glift.orientation.CropboxMapping>}
 */
glift.orientation.cropboxMappingCache_ = null;

/**
 * Gets the cropbox mapping. Only for 19x19 currently. I'm pretty sure it
 * doesn't make sense to crop a 9x9 and 13x13 is iffy.
 *
 * @private
 * @return {!Object<!glift.orientation.CropboxMapping>}
 */
glift.orientation.getCropboxMapping_ = function() {
  var br = glift.enums.boardRegions;
  // See glift.orientation.cropbox for more about how cropboxes are defined.
  var cbox = function(boardRegion) {
    return glift.orientation.cropbox.get(boardRegion, 19);
  };

  if (glift.orientation.cropboxMappingCache_ == null) {
    // The heart of this method. We know the minimal bounding box for the stones.
    // Then the question is: Which bbox best covers the minimal box? There are 4
    // cases:
    // -  The min-box is an 'in-between area'. First check the very middle of the
    //    board. then, check the edge areas.
    // -  The min-box lies within a corner
    // -  The min-box lies within a side
    // -  The min-box can only be covered by the entire board.
    var boxRegions = [
      // Check the overlap regions.
      // First, we check the very middle of the board.
      {
        bbox: cbox(br.TOP_LEFT).bbox.intersect(cbox(br.BOTTOM_RIGHT).bbox),
        result: br.ALL
      // Now, check the side-overlaps.
      }, {
        bbox: cbox(br.TOP_LEFT).bbox.intersect(cbox(br.TOP_RIGHT).bbox),
        result: br.TOP
      }, {
        bbox: cbox(br.TOP_LEFT).bbox.intersect(cbox(br.BOTTOM_LEFT).bbox),
        result: br.LEFT
      }, {
        bbox: cbox(br.BOTTOM_RIGHT).bbox.intersect(cbox(br.TOP_RIGHT).bbox),
        result: br.RIGHT
      }, {
        bbox: cbox(br.BOTTOM_RIGHT).bbox.intersect(cbox(br.BOTTOM_LEFT).bbox),
        result: br.BOTTOM
      }
    ];

    var toAdd = [
      br.TOP_LEFT, br.TOP_RIGHT, br.BOTTOM_LEFT, br.BOTTOM_RIGHT,
      br.TOP, br.BOTTOM, br.LEFT, br.RIGHT,
      br.ALL
    ];
    for (var i = 0; i < toAdd.length; i++) {
      var bri = toAdd[i];
      boxRegions.push({
        bbox: cbox(bri).bbox,
        result: bri
      });
    }
    glift.orientation.cropboxMappingCache_ = boxRegions;
  }

  // Cropbox mapping must be defined here by the logic above
  return /** @type !{glift.orientation.CropboxMapping} */ (
      glift.orientation.cropboxMappingCache_);
};

/**
 * Get the minimal bounding box for set of stones and marks for the movetree.
 *
 * There are there cases;
 * 1. nextMovesPath is not defined. Recurse over the entire tree. Don't use
 *    marks for cropping consideration.
 * 2. nextMovesPath is an empty array. Calculate for the current position. Use
 *    marks for cropping consideration
 * 3. nextMovesPath is a non empty array. Treat the nextMovesPath as a
 *    variations tree path and traverse just the path. Really 2., is a special
 *    case of 3.
 *
 * To calculate the minimalBoundingBox for just the current position
 *
 * @param {!glift.rules.MoveTree} movetree
 * @param {(!glift.rules.Treepath|string)=} opt_nextMovesPath
 *    Optional next moves path for cropping along a specific path.
 * @return {!glift.orientation.BoundingBox}
 */
glift.orientation.minimalBoundingBox = function(movetree, opt_nextMovesPath) {
  var point = glift.util.point;
  var bbox = glift.orientation.bbox.fromPts;

  var ints = movetree.getIntersections() - 1;

  /** @type {!glift.rules.Treepath|undefined} */
  var nextMovesPath = undefined;
  if (opt_nextMovesPath && glift.util.typeOf(opt_nextMovesPath) === 'string') {
    nextMovesPath = glift.rules.treepath.parseFragment(opt_nextMovesPath);
  } else if (opt_nextMovesPath && glift.util.typeOf(opt_nextMovesPath) === 'array') {
    nextMovesPath = /** @type {!glift.rules.Treepath} */ (opt_nextMovesPath);
  }
  var pts = glift.orientation.getDisplayPts_(movetree, nextMovesPath);

  // Return a full board when there are no points.
  if (pts.length === 0) {
    return bbox(point(0,0), point(ints, ints));
  }

  // Return a bbox with one point.
  var bboxInstance = bbox(pts[0], pts[0]);
  for (var i = 1; i < pts.length; i++) {
    var pt = pts[i];
    if (!bboxInstance.contains(pt)) {
      bboxInstance = bboxInstance.expandToContain(pt);
    }
  }
  return bboxInstance;
};

/**
 * Gets all the display points associated with a movetree:
 *
 * There are there cases;
 * 1. nextMovesPath is not defined. Recurse over the entire tree. Don't use
 *    marks for cropping consideration.
 * 2. nextMovesPath is an empty array. Calculate for the current position. Use
 *    marks for cropping consideration
 * 3. nextMovesPath is a non empty array. Treat the nextMovesPath as a
 *    variations tree path and traverse just the path. Really 2., is a special
 *    case of 3.
 *
 * @private
 *
 * @param {!glift.rules.MoveTree} movetree
 *    Optional next moves path for cropping along a specific path.
 * @param {!glift.rules.Treepath=} opt_nextMovesPath
 *    Optional next moves path for cropping along a specific path.
 *
 * @return {!Array<!glift.Point>}
 */
glift.orientation.getDisplayPts_ = function(movetree, opt_nextMovesPath) {
  // Ensure we aren't changing the parent movetree's state.
  movetree = movetree.newTreeRef();
  var pts = [];
  /**
   * This hands objects that look like:
   * { StringKey: Array of objs that contain pts }.
   *
   * Ex.
   * {
   *  BLACK: [{point: {10, 16}, color: 'BLACK'}]
   *  TEXTLABEL: [{point: {13, 5}, value: '12'}]
   * }
   */
  var capturePoints = function(ptsObj) {
    for (var key in ptsObj) {
      var moveArr = ptsObj[key];
      for (var i = 0; i < moveArr.length; i++) {
        var item = moveArr[i];
        if (moveArr[i].point) {
          pts.push(moveArr[i].point);
        }
      }
    }
  };

  if (!opt_nextMovesPath) {
    movetree.recurseFromRoot(function(mt) {
      capturePoints(mt.properties().getAllStones());
    });
  } else if (opt_nextMovesPath) {
    // Case 3. Traverse the next moves path.
    for (var i = 0; i < opt_nextMovesPath.length; i++) {
      movetree.moveDown(opt_nextMovesPath[i]);
      capturePoints(movetree.properties().getAllStones());
    }
    // Case 2. Traverse the next moves path.
    if (opt_nextMovesPath.length === 0) {
      capturePoints(movetree.properties().getAllStones());
    }
    capturePoints(movetree.properties().getAllMarks());
  }
  return pts;
};

/**
 * Calculates the desired rotation. Returns one of
 * glift.enums.rotations.
 *
 * Region ordering should specify what regions the rotation algorithm should
 * target. It has the format:
 * {
 *  corner: <boardregions>
 *  side: <boardregions>
 * }
 *
 */
glift.orientation.findCanonicalRotation = function(movetree, regionOrdering) {
  var boardRegions = glift.enums.boardRegions;
  var rotations = glift.enums.rotations;
  var cornerRegions = {
    TOP_LEFT: 0,
    BOTTOM_LEFT: 90,
    BOTTOM_RIGHT: 180,
    TOP_RIGHT: 270
  };
  var sideRegions = {
    TOP: 0,
    LEFT: 90,
    BOTTOM: 180,
    RIGHT: 270
  };

  if (!regionOrdering) {
    regionOrdering = {
      corner: boardRegions.TOP_RIGHT,
      side: boardRegions.TOP
    };
  }

  var region = glift.orientation.getQuadCropFromMovetree(movetree);

  if (cornerRegions[region] !== undefined ||
      sideRegions[region] !== undefined) {
    var start = 0, end = 0;
    if (cornerRegions[region] !== undefined) {
      start = cornerRegions[region];
      end = cornerRegions[regionOrdering.corner];
    }

    if (sideRegions[region] !== undefined) {
      start = sideRegions[region];
      end = sideRegions[regionOrdering.side];
    }

    var rot = (360 + start - end) % 360;
    if (rot === 0) { return rotations.NO_ROTATION; }
    return 'CLOCKWISE_' + rot;
  }

  // No rotations. We only rotate when the quad crop region is either a corner
  // or a side.
  return rotations.NO_ROTATION;
};

goog.provide('glift.parse');

/**
 * Glift parsing for strings.
 */
glift.parse = {
  /**
   * Parse types
   * @enum {string}
   */
  parseType: {
    /** FF1-FF4 Parse Type. */
    SGF: 'SGF',

    /** Tygem .gib files. */
    TYGEM: 'TYGEM',

    /**
     * DEPRECATED.  This was created when I didn't understand the destinction
     * between the various FF1-3 versions and FF4
     *
     * Prefer SGF, this is now equivalent.
     */
    PANDANET: 'PANDANET'
  },

  /**
   * Parse a Go-format format from a string.
   *
   * @param {string} str Raw contents that need to be parsed.
   * @param {string} filename Name of the file from which the contents came.
   * @return {!glift.rules.MoveTree}
   */
  fromFileName: function(str, filename) {
    var parseType = glift.parse.parseType;
    var ttype = parseType.SGF;
    if (filename.indexOf('.sgf') > -1) {
      ttype = parseType.SGF;
    } else if (filename.indexOf('.gib') > -1) {
      ttype = parseType.TYGEM;
    }
    return glift.parse.fromString(str, ttype);
  },

  /**
   * Transforms a stringified game-file into a movetree.
   *
   * @param {string} str Raw contents that need to be parsed.
   * @param {glift.parse.parseType=} opt_ttype The parse type. Defaults to SGF
   *    if unspecified.
   * @return {!glift.rules.MoveTree} The generated movetree
   */
  fromString: function(str, opt_ttype) {
    var ttype = opt_ttype || glift.parse.parseType.SGF;
    if (ttype === glift.parse.parseType.PANDANET) {
      // PANDANET type is now equivalent to SGF.
      ttype = glift.parse.parseType.SGF;
    }
    var methodName = glift.enums.toCamelCase(ttype);
    var func = glift.parse[methodName];
    var movetree = func(str);
    return glift.rules.movetree.initRootProperties(movetree);
  }
};

goog.scope(function() {

/**
 * Metadata Start and End tags allow us to insert metadata directly, as
 * JSON, into SGF comments.  It will not be display by glift (although it
 * will by other editors, of course). It's primary use is as an API for
 * embedding tertiary data.
 *
 * It is currently expected that this property is attached to the root node.
 *
 * Some other notes:
 *  - Metadata extraction happens in the parser.
 *  - If the metadataProperty field is set, it will grab all the data from
 *  the relevant property and try to convert it to JSON.
 *
 * To disable this behavior, set metadataProperty to null.
 *
 * api:experimental
 */
glift.parse.sgfMetadataProperty = 'GC';


/**
 * Escapes some text by converting ] to \\]
 * @param {string} text
 * @return {string}
 */
glift.parse.sgfEscape = function(text) {
  return text.toString().replace(/]/g, '\\]');
};

/**
 * Unescapes some text by converting \\] to ]
 * @param {string} text
 * @return {string}
 */
glift.parse.sgfUnescape = function(text) {
  return text.toString().replace(/\\]/g, ']');
};

var states = {
  BEGINNING_BEFORE_PAREN: 0,
  BEGINNING: 1,
  PROPERTY: 2, // e.g., 'AB[oe]' or 'A_B[oe]' or 'AB_[oe]'
  PROP_DATA: 3, // 'AB[o_e]'
  BETWEEN: 4, // 'AB[oe]_', '_AB[oe]'
  FINISHED_SGF: 5
};

var statesToString = {
  0: 'BEGINNING_BEFORE_PAREN',
  1: 'BEGINNING',
  2: 'PROPERTY',
  3: 'PROP_DATA',
  4: 'BETWEEN',
  5: 'FINISHED_SGF'
};

var syn = {
  LBRACE:  '[',
  RBRACE:  ']',
  LPAREN:  '(',
  RPAREN:  ')',
  SCOLON:  ';'
};

var wsRegex = /\s|\n/;
var propRegex = /[A-Z]/;
var oldStyleProp = /[a-z]/;
var pointRectangleRegex = /^[a-z][a-z]:[a-z][a-z]$/;

/**
 * The new Glift SGF parser!
 * Takes a string, returns a movetree.  Easy =).
 *
 * Note: Because SGFs have notoriously bad data / properties, we log warnings
 * for unknown properties rather than throwing errors.
 *
 * @param {string} sgfString
 * @return {!glift.rules.MoveTree}
 * @package
 */
glift.parse.sgf = function(sgfString) {
  var curstate = states.BEGINNING_BEFORE_PAREN;
  var movetree = glift.rules.movetree.getInstance();
  var charBuffer = ''; // List of characters.
  var propData = []; // List of Strings.
  var branchMoveNums = []; // used for when we pop up.
  var curProp = '';
  var curchar = '';
  var lineNum = 0;
  var colNum = 0;
  // We track how many parens we've seen, so we know when we've finished the
  // SGF.
  var parenDepth = 0;

  // A simple boolean to track whether property data could be considered a point
  // rectangle (by the existence of :). Processing point rectangles is
  // relatively costly, so we try to be conservative about point-rectangle
  // processing.
  var possiblePointRectangle = false;

  var perror = function(msg) {
    glift.parse.sgfParseError(lineNum, colNum, curchar, msg, false /* iswarn */);
  };

  var pwarn = function(msg) {
    glift.parse.sgfParseError(lineNum, colNum, curchar, msg, true /* iswarn */);
  };

  var flushCharBuffer = function() {
    var strOut = charBuffer;
    charBuffer = '';
    return strOut;
  };

  /** Flush the property data to the movetree's properties. */
  var flushPropDataIfNecessary = function() {
    if (curProp.length > 0) {
      if (glift.parse.sgfMetadataProperty &&
          curProp === glift.parse.sgfMetadataProperty &&
          !movetree.node().getParent()) {
        try {
          var pdata = propData[0].replace(/\\]/g, ']');
          var mdata = JSON.parse(pdata);
          if (glift.util.typeOf(mdata) === 'object') {
            movetree.setMetdata(/** @type {!Object} */ (mdata));
          }
        } catch (e) {
          glift.util.logz('Tried to parse property ' + curProp
              + ' as Glift SGF JSON-metadata, but unable to parse:' +
              + pdata );
        }
      }
      movetree.properties().add(curProp, propData);
      propData = [];
      curProp = '';
    }
  };

  /**
   * Flush characters to the prop data. All relevant property process occurs
   * here. In particular, this is where we process point rectangles.
   */
  var flushCharBufferToPropData = function() {
    var charz = flushCharBuffer();
    if (possiblePointRectangle &&
        pointRectangleRegex.test(charz) &&
        (curProp === 'AB' || curProp === 'AW' || curProp === 'AE' || 
            curProp === 'CR' || curProp === 'DD' ||
            curProp === 'MA' || curProp === 'SL' ||
            curProp === 'SQ' || curProp === 'TR')) {
      var pts = glift.util.pointArrFromSgfProp(charz);
      for (var j = 0; j < pts.length; j++) {
        propData.push(pts[j].toSgfCoord());
      }
    } else {
      propData.push(charz);
    }
    possiblePointRectangle = false;
  };

  // Run everything inside an anonymous function so we can use 'return' as a
  // fullstop break.
  (function() {
    for (var i = 0; i < sgfString.length; i++) {
      colNum++; // This means that columns are 1 indexed.
      curchar = sgfString.charAt(i);

      if (curchar === "\n" ) {
        lineNum++;
        colNum = 0;
        if (curstate !== states.PROP_DATA) {
          continue;
        }
      }

      switch (curstate) {
        case states.BEGINNING_BEFORE_PAREN:
          if (curchar === syn.LPAREN) {
            branchMoveNums.push(movetree.node().getNodeNum()); // Should Be 0.
            parenDepth++;
            curstate = states.BEGINNING;
          } else if (wsRegex.test(curchar)) {
            // We can ignore whitespace.
          } else {
            perror('Unexpected character. ' +
              'Expected first non-whitespace char to be [(]');
          }
          break;
        case states.BEGINNING:
          if (curchar === syn.SCOLON) {
            curstate = states.BETWEEN; // The SGF Begins!
          } else if (wsRegex.test(curchar)) {
            // We can ignore whitespace.
          } else {
            perror('Unexpected character. Expected char to be [;]');
          }
          break;
        case states.PROPERTY:
          if (propRegex.test(curchar)) {
            charBuffer += curchar;
            // In the SGF Specification, SGF properties can be of arbitrary
            // lengths, even though all standard SGF properties are 1-2 chars.
          } else if (oldStyleProp.test(curchar)) {
            // Do nothing. This is an FF1 - FF3 style property. For
            // compatibility, we just ignore it and move on.
          } else if (curchar === syn.LBRACE) {
            curProp = flushCharBuffer();
            if (glift.rules.prop[curProp] === undefined) {
              pwarn('Unknown property: ' + curProp);
            }
            curstate = states.PROP_DATA;
          } else if (wsRegex.test(curchar)) {
            // Should whitespace be allowed here?
            perror('Unexpected whitespace in property name')
          } else {
            perror('Unexpected character in property name');
          }
          break;
        case states.PROP_DATA:
          if (curchar === syn.RBRACE
              && charBuffer.charAt(charBuffer.length - 1) === '\\') {
            // Remove the \
            charBuffer = charBuffer.substring(0, charBuffer.length - 1);
            // And add the brace as a normal character
            charBuffer += curchar;
          } else if (curchar === syn.RBRACE) {
            flushCharBufferToPropData();
            curstate = states.BETWEEN;
          } else {
            if (curchar === ':') {
              possiblePointRectangle = true;
            }
            charBuffer += curchar;
          }
          break;
        case states.BETWEEN:
          if (propRegex.test(curchar)) {
            flushPropDataIfNecessary();
            charBuffer += curchar;
            curstate = states.PROPERTY;
          } else if (curchar === syn.LBRACE) {
            if (curProp.length > 0) {
              curstate = states.PROP_DATA; // more data to process
            } else {
              perror('Unexpected token.  Orphan property data.');
            }
          } else if (curchar === syn.LPAREN) {
            parenDepth++;
            flushPropDataIfNecessary();
            branchMoveNums.push(movetree.node().getNodeNum());
          } else if (curchar === syn.RPAREN) {
            parenDepth--;
            flushPropDataIfNecessary();
            if (branchMoveNums.length === 0) {
              while (movetree.node().getNodeNum() !== 0) {
                movetree.moveUp();
              }
              return movetree;
            }
            var parentBranchNum = branchMoveNums.pop();
            while (movetree.node().getNodeNum() !== parentBranchNum) {
              movetree.moveUp();
            }
            if (parenDepth === 0) {
              // We've finished the SGF.
              curstate = states.FINISHED_SGF;
            }
          } else if (curchar === syn.SCOLON) {
            flushPropDataIfNecessary();
            movetree.addNode();
          } else if (wsRegex.test(curchar)) {
            // Do nothing.  Whitespace can be ignored here.
          } else {
            perror('Unknown token');
          }
          break;
        case states.FINISHED_SGF:
          if (wsRegex.test(curchar)) {
            // Do nothing.  Whitespace can be ignored here.
          } else {
            pwarn('Garbage after finishing the SGF.');
          }
          break;
        default:
          perror('Fatal Error: Unknown State!'); // Shouldn't get here.
      }
    }
    if (movetree.node().getNodeNum() !== 0) {
      perror('Expected to end up at start.');
    }
  })();
  return movetree;
};

/**
 * Throw a parser error or log a parse warning.  The message is optional.
 * @param {number} lineNum
 * @param {number} colNum
 * @param {string} curchar
 * @param {string} message
 * @param {boolean} isWarning
 * @package
 */
glift.parse.sgfParseError = function(lineNum, colNum, curchar, message, isWarning) {
  var header = 'SGF Parsing ' + (isWarning ? 'Warning' : 'Error');
  var err = header + ': At line [' + lineNum + '], column [' + colNum
      + '], char [' + curchar + '], ' + message;
  if (isWarning) {
    glift.util.logz(err);
  } else {
    throw new Error(err);
  }
};

});

/**
 * The GIB format (i.e., Tygem's file format) is not public, so it's rather
 * difficult to know if this is truly an accurate parser. Oh well.
 *
 * Also, it's a horrible format. Also, this is a pretty hacky parser.
 *
 * @param {string} gibString
 * @retutrn {!glift.rules.MoveTree}
 * @package
 */
glift.parse.tygem = function(gibString) {
  var states = {
    HEADER: 1,
    BODY: 2
  };
  var colorToToken = { 1: 'B', 2: 'W' };

  var WHITE_NAME = 'GAMEWHITENAME';
  var BLACK_NAME = 'GAMEBLACKNAME';
  var KOMI = 'GAMECONDITION';

  var movetree = glift.rules.movetree.getInstance();
  var lines = gibString.split('\n');

  var grabHeaderProp = function(name, line, prop, mt) {
    line = line.substring(
        line.indexOf(name) + name.length + 1, line.length - 2);
    if (/\\$/.test(line)) {
      // This is a horrible hack. Sometimes \ appears as the last character
      line = line.substring(0, line.length - 1);
    }
    mt.properties().add(prop, line);
  };

  var curstate = states.HEADER;
  for (var i = 0, len = lines.length; i < len; i++) {
    var str = lines[i];
    var firstTwo = str.substring(0,2);
    if (firstTwo === '\\[') {
      // We're in the header.
      var eqIdx = str.indexOf('=');
      var type = str.substring(2, eqIdx);
      if (type === WHITE_NAME) {
        grabHeaderProp(WHITE_NAME, str, 'PW', movetree);
      } else if (type === BLACK_NAME) {
        grabHeaderProp(BLACK_NAME, str, 'PB', movetree);
      }
    } else if (firstTwo === 'ST') {
      if (curstate !== states.BODY) {
        // We're in stone-placing land and out of the header.
        curstate = states.BODY
      }

      // Stone lines look like:
      //     ? MoveNumber Color (1=B,2=W) x y
      // STO 0 2          2               15 15
      //
      // Note that the board is indexed from the bottom left rather than from
      // the upper left, as with SGFs. Also, the intersections are 0-indexed.
      var splat = str.split(" ");
      var colorToken = colorToToken[splat[3]];
      var x = parseInt(splat[4], 10);
      var y = parseInt(splat[5], 10);
      movetree.addNode().properties().add(
          colorToken, glift.util.point(x, y).toSgfCoord());
    }
  }
  return movetree.getTreeFromRoot();
};

goog.provide('glift.rules');

/**
 * Objects and methods that enforce the basic rules of Go.
 */
glift.rules = {};

goog.provide('glift.rules.prop');

/**
 * All the SGF Properties plus some things.
 * @enum {string}
 */
//  TODO(kashomon): Comment these and delete the invalid ones.
glift.rules.prop = {
/** Node: Black placements. */
AB: 'AB',
/** Node: Clear Intersections.  */
AE: 'AE',
AN: 'AN',
/** Root: Creating program ex:[Glift:1.1.0] */
AP: 'AP',
AR: 'AR',
AS: 'AS',
AW: 'AW',
/** Node: Black move */
B: 'B',
BL: 'BL',
BM: 'BM',
BR: 'BR',
BS: 'BS',
BT: 'BT', 
/** Node: Comment */
C: 'C',
/** Root: Encoding ex:[UTF-8] */
CA: 'CA',
CH: 'CH',
CP: 'CP',
CR: 'CR',
DD: 'DD',
DM: 'DM',
DO: 'DO',
DT: 'DT',
EL: 'EL', 
EV: 'EV',
EX: 'EX', 
/** Root: SGF Version. */
FF: 'FF',
FG: 'FG',
GB: 'GB', 
/** Root: Game Comment. */
GC: 'GC',
/** Root: Game */
GM: 'GM', 
/** Root: Game Name */
GN: 'GN',
GW: 'GW',
HA: 'HA',
HO: 'HO',
ID: 'ID',
IP: 'IP',
IT: 'IT',
IY: 'IY',
/** Root: Komi ex:[0.00]*/
KM: 'KM',
KO: 'KO',
L: 'L',
/** Node: Label Mark */
LB: 'LB',
LN: 'LN',
LT: 'LT',
M: 'M',
MA: 'MA',
MN: 'MN',
N: 'N',
OB: 'OB',
OH: 'OH',
OM: 'OM',
ON: 'ON',
OP: 'OP',
OT: 'OT',
OV: 'OV',
OW: 'OW',
PB: 'PB',
PC: 'PC',
/** Node: Current player */
PL: 'PL',
PM: 'PM',
PW: 'PW',
RE: 'RE',
RG: 'RG',
RO: 'RO',
RU: 'RU',
SC: 'SC',
SE: 'SE',
SI: 'SI',
SL: 'SL',
SO: 'SO',
/** Node: Square-mark */
SQ: 'SQ',
ST: 'ST',
SU: 'SU',
/** Root: Size of the Go board */
SZ: 'SZ',
TB: 'TB',
TC: 'TC',
TE: 'TE',
TM: 'TM',
TR: 'TR',
TW: 'TW',
UC: 'UC',
US: 'US',
V: 'V', 
VW: 'VW',
/** Node: White Move. */
W: 'W',
WL: 'WL',
WR: 'WR',
WS: 'WS',
WT: 'WT',
MU: 'MU'
};

/**
 * Autonumber a movetree.
 *
 * NOTE! This removes all numeric labels and replaces them with the labels
 * constructed here, but that's sort of the point.
 *
 * @param {!glift.rules.MoveTree} movetree The movetree to autonumber.
 */
glift.rules.autonumber = function(movetree) {
  var digitregex = /\d+/;
  var singledigit = /0\d/;
  movetree.recurseFromRoot(function(mt) {
    if (!mt.properties().getComment()) {
      return; // Nothing to do.  We only autonumber on comments.
    }
    // First, clear all numeric labels
    var labels = mt.properties().getAllValues(glift.rules.prop.LB);
    /**
     * Map from SGF point to string label.
     * @type {!Object<!glift.PtStr, string>}
     */
    var lblMap = {};
    for (var i = 0; labels && i < labels.length; i++) {
      var lblData = labels[i].split(':')
      if (digitregex.test(lblData[1])) {
        // Clear out digits
      } else {
        lblMap[lblData[0]] = lblData[1];
      }
    }

    var pathOut = glift.rules.treepath.findNextMovesPath(mt);
    var newMt = pathOut.movetree;
    var goban = glift.rules.goban.getFromMoveTree(newMt).goban;

    var mvnum = mt.onMainline() ?
        newMt.node().getNodeNum() + 1:
        newMt.movesToMainline() + 1;
    var applied = glift.rules.treepath.applyNextMoves(
        newMt, goban, pathOut.nextMoves);

    var seen = 0;
    for (var i = 0, st = applied.stones; i < st.length; i++) {
      var stone = st[i];
      if (!stone.collision) {
        var sgfPoint = stone.point.toSgfCoord();
        lblMap[sgfPoint] = (mvnum + seen) + '';
        seen++;
      }
    }

    var newlabels = [];
    for (var sgfpt in lblMap) {
      var l = lblMap[sgfpt];
      if (l.length > 2) {
        var subl = l.substring(l.length - 2, l.length);
        if (subl !== '00') {
          l = subl;
        }
        if (l.length === 2 && singledigit.test(l)) {
          l = l.charAt(l.length - 1);
        }
      }
      newlabels.push(sgfpt + ':' + l);
    }

    if (newlabels.length === 0) {
      mt.properties().remove(glift.rules.prop.LB);
    } else {
      mt.properties().set(glift.rules.prop.LB, newlabels);
    }

    glift.rules.removeCollidingLabels(mt, lblMap);
  });
};

/**
 * Remove the colliding labels from the label map.
 *
 * @param {!glift.rules.MoveTree} mt The movetree
 * @param {!Object<string>} lblMap Map of SGF Point string to label.
 * @package
 */
glift.rules.removeCollidingLabels = function(mt, lblMap) {
  var toConsider = ['TR', 'SQ'];
  for (var i = 0; i < toConsider.length; i++) {
    var key = toConsider[i];
    if (mt.properties().contains(key)) {
      var lbls = mt.properties().getAllValues(key);
      var newLbls = [];
      for (var j = 0; j < lbls.length; j++) {
        var sgfCoord = lbls[j];
        if (lblMap[sgfCoord]) {
          // do nothing.  This is a collision.
        } else {
          newLbls.push(sgfCoord);
        }
      }
      if (newLbls.length === 0) {
        mt.properties().remove(key);
      } else {
        mt.properties().set(key, newLbls);
      }
    }
  }
};

goog.provide('glift.rules.Goban');
goog.provide('glift.rules.StoneResult');
goog.provide('glift.rules.goban');
goog.provide('glift.rules.ConnectedGroup');
goog.provide('glift.rules.CaptureResult');

/**
 * Result of a Capture
 *
 * @typedef {{
 *   WHITE: !Array<!glift.Point>,
 *   BLACK: !Array<!glift.Point>
 * }}
*/
glift.rules.CaptureResult;

glift.rules.goban = {
  /**
   * Creates a Goban instance, just with intersections.
   * @param {number=} opt_intersections
   * @return {!glift.rules.Goban}
   */
  getInstance: function(opt_intersections) {
    var ints = opt_intersections || 19;
    return new glift.rules.Goban(ints);
  },

  /**
   * Creates a goban, from a move tree and (optionally) a treePath, which
   * defines how to get from the start to a given location.  Usually, the
   * treePath is the initialPosition, but not necessarily.
   *
   * NOTE: This leaves the movetree in a modified state.
   *
   * @param {!glift.rules.MoveTree} mt The movetree.
   * @param {!glift.rules.Treepath=} opt_treepath Optional treepath If the
   *    treepath is undefined, we craft a treepath to the current location in
   *    the movetree.
   *
   * @return {{
   *   goban: !glift.rules.Goban,
   *   captures: !Array<!glift.rules.CaptureResult>,
   *   clearHistory: !Array<!Array<!glift.rules.Move>>
   * }}
   */
  getFromMoveTree: function(mt, opt_treepath) {
    var treepath = opt_treepath || mt.treepathToHere();
    var goban = new glift.rules.Goban(mt.getIntersections()),
        movetree = mt.getTreeFromRoot(),
        clearHistory = [],
        captures = []; // array of captures.
    goban.loadStonesFromMovetree(movetree); // Load root placements.
    // We don't consider clear-locations (AE) properties at the root because why
    // the heck would you do that?

    for (var i = 0;
        i < treepath.length && movetree.node().numChildren() > 0;
        i++) {
      movetree.moveDown(treepath[i]);
      clearHistory.push(goban.applyClearLocationsFromMovetree(movetree));
      captures.push(goban.loadStonesFromMovetree(movetree));
    }
    return {
      goban: goban,
      captures: captures,
      clearHistory: clearHistory,
    };
  }
};

/**
 * The Goban tracks the state of the stones, because the state is stored in a
 * double array, the board positions are indexed from the upper left corner:
 *
 * 0,0    : Upper Left
 * 0,19   : Lower Left
 * 19,0   : Upper Right
 * 19,19  : Lower Right
 *
 * Currently, the Goban has rudimentary support for Ko. Ko is currently
 * supported in the simple case where a move causing a cappture can be
 * immediately recaptured:
 *
 * ......
 * ..OX..
 * .OX.X.
 * ..OX..
 * .....
 *
 * Currently, all other repeateding board situations are ignored. Worrying about
 * hashing the board position and checking the current position against past
 * positions is beyond this class, since this class contains no state except for
 * stones and possibly a single Ko point.
 *
 * As a historical note, this is the oldest part of Glift.
 *
 * @param {number} ints
 *
 * @constructor @final @struct
 */
glift.rules.Goban = function(ints) {
  if (!ints || ints <= 0) {
    throw new Error("Invalid Intersections. Was: " + ints)
  }

  /** @private {number} */
  this.ints_ = ints;

  /** @private {!Array<glift.enums.states>} */
  this.stones_ = glift.rules.initStones_(ints);

  /**
   * The Ko Point, if it exists. Null if there is no Ko.
   * @private {?glift.Point}
   */
  this.koPoint_ = null;
};

glift.rules.Goban.prototype = {
  /** @return {number} The number of intersections. */
  intersections: function() {
    return this.ints_;
  },

  /**
   * Sets the Ko point. Normally, this should be set by addStone. However, users
   * may want to set this when going backwards through a game.
   * @param {!glift.Point} pt
   */
  setKo: function(pt) {
    if (pt && this.inBounds_(pt)) {
      this.koPoint_ = pt;
    }
  },

  /**
   * Clears the Ko point. Note that the Ko point is cleared automatically by
   * some operations (clearStone, addStone).
   */
  clearKo: function() { this.koPoint_ = null; },

  /** @return {?glift.Point} The ko point or null if it doesn't exist. */
  getKo: function() { return this.koPoint_; },

  /**
   * @param {!glift.Point} point
   * @return {boolean} True if the board is empty at particular point and the
   *    point is within the bounds of the board.
   */
  placeable: function(point) {
    return this.inBounds_(point)
        && !point.equals(this.koPoint_)
        && this.getStone(point) === glift.enums.states.EMPTY;
  },

  /**
   * Retrieves a state (color) from the board.
   *
   * Note that, for our purposes,
   * x: refers to the column.
   * y: refers to the row.
   *
   * Thus, to get a particular "stone" you must do
   * stones[y][x]. Also, stones are 0-indexed.
   *
   * @param {!glift.Point} pt
   * @return {!glift.enums.states} the state of the intersection
   */
  getStone: function(pt) {
    return this.stones_[pt.y()][pt.x()];
  },

  /**
   * Get all the placed stones on the board (BLACK or WHITE)
   * @return {!Array<!glift.rules.Move>}
   */
  getAllPlacedStones: function() {
    var out = [];
    for (var i = 0; i < this.intersections(); i++) {
      for (var j = 0; j < this.intersections(); j++) {
        var color = this.getStone(glift.util.point(j, i));
        if (color === glift.enums.states.BLACK ||
            color === glift.enums.states.WHITE) {
          out.push({point: glift.util.point(j, i), color:color});
        }
      }
    }
    return out;
  },

  /**
   * Clear a stone from an intersection. Clears the Ko point.
   * @param {!glift.Point} point
   * @return {glift.enums.states} color of the location cleared
   */
  clearStone: function(point) {
    this.clearKo();
    var color = this.getStone(point);
    this.setColor(point, glift.enums.states.EMPTY);
    return color;
  },

  /**
   * Clear an array of stones on the board. Clears the Ko point (since it calls
   * clearStone).
   * @param {!Array<!glift.Point>} points
   */
  clearSome: function(points) {
    for (var i = 0; i < points.length; i++) {
      this.clearStone(points[i]);
    }
  },

  /**
   * Try to add a stone on a new go board instance, but don't change state.
   *
   * @param {!glift.Point} point
   * @param {glift.enums.states} color
   * @return {boolean} true / false depending on whether the 'add' was successful.
   */
  testAddStone: function(point, color) {
    var ko = this.getKo();
    var addStoneResult = this.addStone(point, color);
    if (ko !== null ) {
      this.setKo(ko);
    }

    // Undo our changes (this is pretty icky). First remove the stone and then
    // add the captures back.
    if (addStoneResult.successful) {
      this.clearStone(point);
      var oppositeColor = glift.util.colors.oppositeColor(color);
      for (var i = 0; i < addStoneResult.captures.length; i++) {
        this.setColor(addStoneResult.captures[i], oppositeColor);
      }
    }
    return addStoneResult.successful;
  },

  /**
   * Add a stone to the GoBoard (0-indexed).  Requires the intersection (a
   * point) where the stone is to be placed, and the color of the stone to be
   * placed.
   *
   * The goban also tracks where the last Ko occurred. Subsequent calls to this
   * method invalidate the previous Ko.
   *
   * @param {!glift.Point} pt A point
   * @param {glift.enums.states} color The State to add.
   * @return {!glift.rules.StoneResult} The result of the placement, and whether
   *    the placement was successful.
   */
  addStone: function(pt, color) {
    if (!(color === glift.enums.states.BLACK ||
        color === glift.enums.states.WHITE ||
        color === glift.enums.states.EMPTY)) {
      throw "Unknown color: " + color;
    }

    // Add stone fail.  Return a failed StoneResult.
    if (!this.placeable(pt)) {
      return new glift.rules.StoneResult(false);
    }

    // Set the stone as active and see what happens!
    this.setColor(pt, color);

    // First find the oppositely-colored connected groups on each of the
    // cardinal directions.
    var capturedGroups = this.findCapturedGroups_(pt, color);

    if (capturedGroups.length === 0) {
      // If a move doesn't capture, then it's possible that the move is self
      // capture. If there are captured groups, this is not an issue.
      //
      // So, let's find the connected group for the stone placed.
      var g = this.findConnected_(pt, color);
      if (g.liberties === 0) {
        // Onos! The move is self capture.
        this.clearStone(pt);
        return new glift.rules.StoneResult(false);
      }
    }

    // This move is going to be successful, so we now invalidate the Ko point.
    this.clearKo();

    // Remove the captures from the board.
    var capturedPoints = [];
    for (var i = 0; i < capturedGroups.length; i++) {
      var g = capturedGroups[i];
      for (var j = 0; j < g.group.length; j++) {
        var capPoint = /** @type {!glift.Point} */ (g.group[j].point);
        capturedPoints.push(capPoint);
        this.clearStone(capPoint);
      }
    }

    // Finally, test for Ko. Ko only technically only occurs when a single stone
    // is captured and the opponent can retake that one stone.
    //
    // Some rulesets specify that repeating board positions are not allowed.
    // This is too expensive and generally unnecesary except in rare cases for
    // this UI.
    if (capturedPoints.length === 1) {
      var oppColor = glift.util.colors.oppositeColor(color);
      var capPt = capturedPoints[0];

      // Try to recapture, and see what happen.
      this.setColor(capPt, oppColor);
      var koCapturedGroups = this.findCapturedGroups_(capPt, oppColor);
      // Undo our damage to the board.
      this.clearStone(capPt);
      if (koCapturedGroups.length === 1) {
        var g = koCapturedGroups[0];
        if (g.group.length === 1 && g.group[0].point.equals(pt)) {
          // It's a Ko!!
          this.setKo(capPt);
          return new glift.rules.StoneResult(true, capturedPoints, capPt);
        }
      }
    }

    // No ko, but it's a go!
    return new glift.rules.StoneResult(true, capturedPoints);
  },

  /**
   * For the current position in the movetree, load all the stone values into
   * the goban. This includes placements [AW,AB] and moves [B,W].
   *
   * @param {!glift.rules.MoveTree} movetree
   * @return {!glift.rules.CaptureResult} The black and white captures.
   */
  loadStonesFromMovetree: function(movetree) {
    /** @type {!Array<glift.enums.states>} */
    var colors = [ glift.enums.states.BLACK, glift.enums.states.WHITE ];
    var captures = { BLACK : [], WHITE : [] };
    for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      var placements = movetree.properties().getPlacementsAsPoints(color);
      for (var j = 0, len = placements.length; j < len; j++) {
        this.loadStone_({point: placements[j], color: color}, captures);
      }
    }
    this.loadStone_(movetree.properties().getMove(), captures);
    return captures;
  },

  /**
   * For the current position in the movetree, apply the clear-locations (AE),
   * returning any intersections that were actually cleared. Returns an empty
   * array if AE doesn't exist or no locations were cleared.
   *
   * @param {!glift.rules.MoveTree} movetree
   * @return {!Array<!glift.rules.Move>} the cleared stones.
   */
  applyClearLocationsFromMovetree: function(movetree) {
    var clearLocations = movetree.properties().getClearLocationsAsPoints();
    var outMoves = [];
    for (var i = 0; i < clearLocations.length; i++) {
      var pt = clearLocations[i];
      var color = this.clearStone(pt);
      if (color !== glift.enums.states.EMPTY) {
        outMoves.push({point: pt, color: color});
      }
    }
    return outMoves;
  },

  /////////////////////
  // Private Methods //
  /////////////////////

  /**
   * Set a color without performing any validation. Use with Caution!!
   *
   * @param {glift.enums.states} color
   * @param {!glift.Point} pt
   */
  setColor: function(pt, color) {
    this.stones_[pt.y()][pt.x()] = color;
  },

  /**
   * @param {!glift.Point} point
   * @return {boolean} True if the point is out-of-bounds.
   * @private
   */
  outBounds_: function(point) {
    return glift.util.outBounds(point.x(), this.intersections())
        || glift.util.outBounds(point.y(), this.intersections());
  },

  /**
   * @param {!glift.Point} point
   * @return {boolean} True if the point is in-bounds.
   * @private
   */
  inBounds_: function(point) {
    return glift.util.inBounds(point.x(), this.intersections())
        && glift.util.inBounds(point.y(), this.intersections());
  },

  /**
   * Cardinal points. Because arrays are indexed from upper left.
   * @private {!Object<string, !glift.Point>}
   */
  cardinals_:  {
    left: glift.util.point(-1, 0),
    right: glift.util.point(1, 0),
    up: glift.util.point(0, -1),
    down: glift.util.point(0, 1)
  },

  /**
   * Get the inbound neighbors. Thus, can return 2, 3, or 4 points.
   *
   * @param {!glift.Point} pt
   * @return {!Array<!glift.Point>}
   * @private
   */
  neighbors_: function(pt) {
    var newpt = glift.util.point;
    var out = [];
    for (var ckey in this.cardinals_) {
      var c = this.cardinals_[ckey];
      var outp = newpt(pt.x() + c.x(), pt.y() + c.y());
      if (this.inBounds_(outp)) {
        out.push(outp);
      }
    }
    return out;
  },

  /**
   * Gets the captures at a point with a given color.
   *
   * @param {!glift.Point} inPoint
   * @param {!glift.enums.states} color
   * @return {!glift.rules.ConnectedGroup} A connected group, with an
   *    associated number of liberties.
   * @private
   */
  findConnected_: function(inPoint, color) {
    var group = new glift.rules.ConnectedGroup(color);
    var stack = [inPoint];
    while (stack.length > 0) {
      var pt = stack.pop();
      if (group.hasSeen(pt)) {
        continue;
      }
      var stone = this.getStone(pt);
      if (stone === color) {
        group.addStone(pt, color);
        var nbors = this.neighbors_(pt);
        for (var n = 0; n < nbors.length; n++) {
          stack.push(nbors[n]);
        }
      }
      if (stone === glift.enums.states.EMPTY) {
        group.addLiberty();
      }
    }
    return group;
  },

  /**
   * Find the captured groups resulting from the placing of a stone of a color
   * at a point pt. This assumes the original point has already been placed.
   *
   * @param {!glift.Point} pt
   * @param {!glift.enums.states} color
   * @return {!Array<glift.rules.ConnectedGroup>} The groups that have been
   *    captured.
   */
  findCapturedGroups_: function(pt, color) {
    var oppColor = glift.util.colors.oppositeColor(color);
    /** @type {!Array<!glift.rules.ConnectedGroup>} */
    var groups = [];
    var nbors = this.neighbors_(pt);
    for (var i = 0; i < nbors.length; i++) {
      var nborPt = nbors[i];
      var alreadySeen = false;
      for (var j = 0; j < groups.length; j++) {
        var g = groups[j];
        if (g.hasSeen(nborPt)) {
          alreadySeen = true;
          break;
        }
      }
      if (!alreadySeen) {
        var newGroup = this.findConnected_(nborPt, oppColor);
        if (newGroup.group.length) {
          groups.push(newGroup);
        }
      }
    }

    var capturedGroups = [];
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      if (g.liberties === 0) {
        capturedGroups.push(g);
      }
    }
    return capturedGroups;
  },

  /**
   * Add a Move to the go board. Intended to be used from
   * loadStonesFromMovetree.
   *
   * @param {?glift.rules.Move} mv
   * @param {!glift.rules.CaptureResult} captures
   * @private
   */
  loadStone_: function(mv, captures) {
    // note: if mv is defined, but mv.point is undefined, this is a PASS.
    if (mv && mv.point !== undefined) {
      var result = this.addStone(mv.point, mv.color);
      if (result.successful) {
        var oppositeColor = glift.util.colors.oppositeColor(mv.color);
        for (var k = 0; k < result.captures.length; k++) {
          captures[oppositeColor].push(result.captures[k]);
        }
      }
    }
  },
};

/**
 * Private function to initialize the stones.
 *
 * @param {number} ints The number of intersections.
 * @return {!Array<glift.enums.states>} The board, as an array of states.
 * @private
 */
glift.rules.initStones_ = function(ints) {
  var stones = [];
  for (var i = 0; i < ints; i++) {
    var newRow = [];
    for (var j = 0; j < ints; j++) {
      newRow[j] = glift.enums.states.EMPTY;
    }
    stones[i] = newRow
  }
  return stones;
};


/**
 * A connected group
 * @param {glift.enums.states} color
 *
 * @constructor @final @struct
 */
glift.rules.ConnectedGroup = function(color) {
  /** @private {glift.enums.states} */
  this.color = color;
  /** @private {number} */
  this.liberties = 0;
  /** @private {!Object<glift.PtStr, boolean>} */
  this.seen = {};
  /** @private {!Array<glift.rules.Move>} */
  this.group = [];
};

glift.rules.ConnectedGroup.prototype = {
  /**
   * Add some liberties to the group.
   * @param {!glift.Point} pt
   * @return {boolean} Whether the point has been seen
   */
  hasSeen: function(pt) {
    return this.seen[pt.toString()];
  },

  /**
   * Add a stone to the group. Note that the point must not have been seen and
   * the color must be equal to the group's color.
   *
   * @param {!glift.Point} pt
   * @param {glift.enums.states} color
   * @return {!glift.rules.ConnectedGroup} this
   */
  addStone: function(pt, color) {
    if (!this.seen[pt.toString()] && this.color === color) {
      this.seen[pt.toString()] = true;
      this.group.push({
        point: pt,
        color: color
      });
    }
    return this;
  },

  /**
   * Add some liberties to the group.
   * @return {!glift.rules.ConnectedGroup} this
   */
  addLiberty: function() {
    this.liberties += 1;
    return this;
  },
};

/**
 * The stone result keeps track of whether placing a stone was successful and what
 * stones (if any) were captured.
 *
 * @param {boolean} success Whether or not the stone-placement was successful.
 * @param {!Array<!glift.Point>=} opt_captures The Array of captured points, if
 *    there are any captures
 * @param {!glift.Point=} opt_koPt A ko point.
 * @constructor @final @struct
 */
glift.rules.StoneResult = function(success, opt_captures, opt_koPt) {
  /**
   * Whether or not the place was successful.
   * @type {boolean}
   */
  this.successful = success;

  /**
   * Array of captured points.
   * @type {!Array<!glift.Point>}
   */
  this.captures = opt_captures || [];

  /**
   * Point for where there's a Ko. Null if it doesn't exist.
   * @type {?glift.Point}
   */
  this.koPt = opt_koPt || null;
};

goog.provide('glift.rules.Move');

/**
 * A type encapsulating the idea of a move.
 *
 * A move can have an undefined point because players may pass.
 *
 * @typedef {{
 *  point: (!glift.Point|undefined),
 *  color: !glift.enums.states
 * }}
 */
glift.rules.Move;

goog.provide('glift.rules.MoveNode');

/**
 * Id for a particular node. Note: The ID is not guaranteed to be unique, due to
 * pranching up the tree. However, it does uniquely identify a child of a
 * parent.
 *
 * @typedef {{
 *  nodeNum: number,
 *  varNum: number
 * }}
 */
glift.rules.NodeId

/**
 * Creates a new MoveNode.
 *
 * @param {!glift.rules.Properties=} opt_properties
 * @param {!Array<!glift.rules.MoveNode>=} opt_children
 * @param {!glift.rules.NodeId=} opt_nodeId
 * @param {!glift.rules.MoveNode=} opt_parentNode
 *
 */
glift.rules.movenode = function(
    opt_properties, opt_children, opt_nodeId, opt_parentNode) {
  return new glift.rules.MoveNode(
       opt_properties, opt_children, opt_nodeId, opt_parentNode);
};

/**
 * A Node in the MoveTree.
 *
 * @param {!glift.rules.Properties=} opt_properties
 * @param {!Array<!glift.rules.MoveNode>=} opt_children
 * @param {!glift.rules.NodeId=} opt_nodeId
 * @param {!glift.rules.MoveNode=} opt_parentNode
 *
 * @package
 * @constructor @final @struct
 */
glift.rules.MoveNode = function(
    opt_properties, opt_children, opt_nodeId, opt_parentNode) {
  /** @private {!glift.rules.Properties} */
  this.properties_ = opt_properties || glift.rules.properties();
  /** @type {!Array<!glift.rules.MoveNode>} */
  this.children = opt_children || [];
  /** @private {!glift.rules.NodeId} */
  this.nodeId_ = opt_nodeId || { nodeNum: 0, varNum: 0 };
  /** @type {?glift.rules.MoveNode} */
  this.parentNode_ = opt_parentNode || null;

  /**
   * Marker for determining mainline.  Should ONLY be used by onMainline from
   * the movetree.
   * @package {boolean}
   */
  this.mainline_ = false;
};

glift.rules.MoveNode.prototype = {
  /**
   * Returns the properties.
   * @return {!glift.rules.Properties}
   */
  properties: function() { return this.properties_; },

  /**
   * Set the NodeId. Each node has an ID based on the depth and variation
   * number.
   *
   * Great caution should be exercised when using this method.  If you
   * don't adjust the surrounding nodes, the movetree will get into a funky
   * state.
   * @param {number} nodeNum
   * @param {number} varNum
   * @private
   */
  setNodeId_: function(nodeNum, varNum) {
    this.nodeId_ = { nodeNum: nodeNum, varNum: varNum };
    return this;
  },

  /**
   * Get the node number (i.e., the depth number). We consider passes and nodes
   * without non-stone data to be 'moves', although this is relatively rare.
   * @return {number}
   */
  getNodeNum: function() { return this.nodeId_.nodeNum; },

  /**
   * Gets the variation number.
   * @return {number}
   */
  getVarNum: function() { return this.nodeId_.varNum; },

  /**
   * Gets the number of children.
   * @return {number}
   */
  numChildren: function() { return this.children.length; },

  /**
   * Add a new child node.
   * @return {!glift.rules.MoveNode} this
   * @package
   */
  addChild: function() {
    this.children.push(glift.rules.movenode(
      glift.rules.properties(),
      [], // children
      { nodeNum: this.getNodeNum() + 1, varNum: this.numChildren() },
      this));
    return this;
  },

  /**
   * Get the next child node.  This the same semantically as moving down the
   * movetree.
   * @return {?glift.rules.MoveNode} The node or null if it doesn't exist.
   */
  getChild: function(variationNum) {
    variationNum = variationNum || 0;
    if (this.children.length > 0) {
      return this.children[variationNum];
    } else {
      return null;
    }
  },

  /**
   * Return the parent node. Returns null if no parent node exists.
   * @return {?glift.rules.MoveNode}
   */
  getParent: function() { return this.parentNode_; },

  /**
   * Renumber the nodes.  Useful for when nodes are deleted during SGF editing.
   * Note: This performs the renumbering recursively
   * @return {!glift.rules.MoveNode} this
   */
  renumber: function() {
    glift.rules.numberMoves_(this, this.nodeId_.nodeNum, this.nodeId_.varNum);
    return this;
  }
};

/**
 * Recursively renumber the nodes
 * @param {!glift.rules.MoveNode} move
 * @param {number} nodeNum
 * @param {number} varNum
 * @private
 */
glift.rules.numberMoves_ = function(move, nodeNum, varNum) {
  move.setNodeId_(nodeNum, varNum);
  for (var i = 0; i < move.children.length; i++) {
    var next = move.children[i];
    glift.rules.numberMoves_(next, nodeNum + 1, i);
  }
  return move;
};

goog.provide('glift.rules.MoveTree');
goog.provide('glift.rules.movetree');

/**
 * When an SGF is parsed by the parser, it is transformed into the following:
 *
 *MoveTree {
 * currentNode_
 * rootNode_
 *}
 *
 * And where a MoveNode looks like the following:
 * MoveNode: {
 *    nodeId: { ... },
 *    properties: Properties,
 *    children: [MoveNode, MoveNode, MoveNode],
 *    parent: MoveNode
 *  }
 *}
 *
 * Additionally, each node in the movetree has an ID property that looks like:
 *
 * node : {
 *  nodeId : <num>,  // The vertical position in the tree.
 *  varId  : <num>,  // The variation number, which is identical to the position
 *                   // in the 'nodes' array.  Also, the 'horizontal' position .
 * }
 *
 * If you are familiar with the SGF format, this should look very similar to the
 * actual SGF format, and is easily converted back to a SGF. And so, The
 * MoveTree is a simple wrapper around the parsed SGF.
 *
 * Each move is an object with two properties: tokens and nodes, the
 * latter of which is a list to capture the idea of multiple variations.
 */
glift.rules.movetree = {
  /**
   * Create an empty MoveTree.
   *
   * @param {number=} opt_intersections Optional intersections. Defaults to 19.
   * @return {!glift.rules.MoveTree} New movetree instance.
   */
  getInstance: function(opt_intersections) {
    var mt = new glift.rules.MoveTree(glift.rules.movenode());
    if (opt_intersections !== undefined) {
      mt.setIntersections_(opt_intersections);
    }
    return mt;
  },

  /**
   * Create a MoveTree from an SGF.
   * Note: initPosition and parseType are both optional.
   *
   * @param {string} sgfString
   * @param {(string|number|!Array<number>)=} opt_initPosition
   * @param {glift.parse.parseType=} opt_parseType
   * @return {!glift.rules.MoveTree}
   */
  getFromSgf: function(sgfString, opt_initPosition, opt_parseType) {
    var initPosition = opt_initPosition || []; // treepath.
    var parseType = parseType || glift.parse.parseType.SGF;

    if (glift.util.typeOf(initPosition) === 'string' ||
        glift.util.typeOf(initPosition) === 'number') {
      initPosition = glift.rules.treepath.parseInitialPath(initPosition);
    }

    var initTreepath = /** @type {!glift.rules.Treepath} */ (initPosition);

    if (sgfString === undefined || sgfString === '') {
      return glift.rules.movetree.getInstance(19);
    }

    var mt = glift.parse.fromString(sgfString, parseType);

    mt = mt.getTreeFromRoot(initTreepath);

    return mt;
  },

  /**
   * Seach nodes with a Depth First Search.
   * @param {!glift.rules.MoveTree} moveTree
   * @param {function(!glift.rules.MoveTree)} func
   */
  searchMoveTreeDFS: function(moveTree, func) {
    func(moveTree);
    for (var i = 0; i < moveTree.node().numChildren(); i++) {
      var mtz = moveTree.newTreeRef();
      glift.rules.movetree.searchMoveTreeDFS(mtz.moveDown(i), func);
    }
  },

  /**
   * Convenience method for setting the root properties in a standard way
   * @param {!glift.rules.MoveTree} mt
   * @return {!glift.rules.MoveTree} The initialized movetree.
   */
  initRootProperties: function(mt) {
    var root = mt.getTreeFromRoot();
    var props = root.properties();
    var prop = glift.rules.prop;
    if (!props.contains(prop.GM)) {
      props.add(prop.GM, '1');
    }
    if (!props.contains(prop.FF)) {
      props.add(prop.FF, '4');
    }
    if (!props.contains(prop.CA)) {
      props.add(prop.CA, 'UTF-8');
    }
    if (!props.contains(prop.AP)) {
      // The glift.global.version is the ui-version. Use this version, if it
      // exists. Otherwise, rely on the core version rules.
      var version = glift.global.version;
      if (version) {
        props.add(prop.AP, 'Glift:' + glift.global.version);
      } else {
        props.add(prop.AP, 'Glift-core:' + glift.global['core-version']);
      }
    }
    if (!props.contains(prop.KM)) {
      props.add(prop.KM, '0.00');
    }
    if (!props.contains(prop.RU)) {
      props.add(prop.RU, 'Japanese');
    }
    if (!props.contains(prop.SZ)) {
      props.add(prop.SZ, '19');
    }
    if (!props.contains(prop.PB)) {
      props.add(prop.PB, 'Black');
    }
    if (!props.contains(prop.PW)) {
      props.add(prop.PW, 'White');
    }
    // Note: we don't set ST because it's a dumb option. (Style of
    // variation-showing).
    return mt;
  }
};

/**
 * A MoveTree is a tree of movenodes played.  The movetree is (usually) a
 * processed parsed SGF, but could be created organically.
 *
 * Semantically, a MoveTree can be thought of as a game, but could also be a
 * problem, demonstration, or example.  Thus, this is the place where such moves
 * as currentPlayer or lastMove.
 *
 * @param {!glift.rules.MoveNode} rootNode
 * @param {!glift.rules.MoveNode=} opt_currentNode
 * @param {Object=} opt_metadata
 *
 * @constructor @final @struct
 */
glift.rules.MoveTree = function(rootNode, opt_currentNode, opt_metadata) {
  /** @private {!glift.rules.MoveNode} */
  this.rootNode_ = rootNode;
  /** @private {!glift.rules.MoveNode} */
  this.currentNode_ = opt_currentNode || rootNode;
  /** @private {boolean} */
  this.markedMainline_ = false;

  /**
   * Metadata is arbitrary data attached to the node.
   *
   * As a side note, Metadata extraction in Glift happens in the parser and so
   * will not show up in comments.  See the metadataProperty option in
   * options.baseOptions.
   * @private {Object}
   */
  this.metadata_ = opt_metadata || null;
};

glift.rules.MoveTree.prototype = {
  /////////////////////////
  // Most common methods //
  /////////////////////////

  /**
   * Get the current node -- that is, the node at the current position.
   * @return {!glift.rules.MoveNode}
   */
  node: function() {
    return this.currentNode_;
  },

  /**
   * Get the properties object on the current node.
   * @return {!glift.rules.Properties}
   */
  properties: function() {
    return this.node().properties();
  },

  /**
   * Gets global movetree metadata.
   * @return {Object}
   */
  metadata: function() {
    return this.metadata_;
  },

  /**
   * Set the metadata for this Movetree.
   * @param {Object} data
   * @return {!glift.rules.MoveTree} this
   */
  setMetdata: function(data) {
    this.metadata_ = data;
    return this;
  },

  /**
   * Move down, but only if there is an available variation.  variationNum can
   * be undefined for convenicence, in which case it defaults to 0.
   * @param {number=} opt_variationNum
   * @return {!glift.rules.MoveTree} this
   */
  moveDown: function(opt_variationNum) {
    var num = opt_variationNum || 0;
    var child = this.node().getChild(num);
    if (child != null) {
      this.currentNode_ = child;
    }
    return this;
  },

  /**
   * Move up a move, but only if you are not at root move.
   * At the root node, movetree.moveUp().moveUp() == movetree.moveUp();
   * @return {!glift.rules.MoveTree} this
   */
  moveUp: function() {
    var parent = this.currentNode_.getParent();
    if (parent) { this.currentNode_ = parent; }
    return this;
  },

  /**
   * Get the current player as a color.
   * @return {!glift.enums.states}
   */
  getCurrentPlayer: function() {
    var states = glift.enums.states;
    var tokenMap = {W: 'WHITE', B: 'BLACK'};
    var curNode = this.currentNode_;

    // The PL property is a short circuit. Usually only used on the root node.
    if (this.properties().contains(glift.rules.prop.PL)) {
      return tokenMap[this.properties().getOneValue(glift.rules.prop.PL)];
    }

    var move = curNode.properties().getMove();
    while (!move) {
      curNode = curNode.getParent();
      if (!curNode) {
        return states.BLACK;
      }
      move = curNode.properties().getMove();
    }
    if (!move) {
      return states.BLACK;
    } else if (move.color === states.BLACK) {
      return states.WHITE;
    } else if (move.color === states.WHITE) {
      return states.BLACK;
    } else {
      return states.BLACK;
    }
  },

  /**
   * Get a new tree reference.  The underlying tree remains the same, but this
   * is a lightway to create new references so the current node position can be
   * changed.
   * @return {!glift.rules.MoveTree}
   */
  newTreeRef: function() {
    return new glift.rules.MoveTree(
        this.rootNode_, this.currentNode_, this.metadata_);
  },

  /**
   * Creates a new Movetree reference from a particular node. The underlying
   * node-tree remains the same.
   *
   * Since a MoveTree is a tree of connected nodes, we can create a sub-tree
   * from any position in the tree.  This can be useful for recursion.
   *
   * @param {!glift.rules.MoveNode} node
   * @return {!glift.rules.MoveTree} New movetree reference.
   */
  getFromNode: function(node) {
    return new glift.rules.MoveTree(node, node, this.metadata_);
  },

  /**
   * Gets a new move tree instance from the root node. Important note: this
   * creates a new tree reference. Thus, if you don't assign to a var, nothing
   * will happen.
   *
   * @param {!glift.rules.Treepath=} treepath
   * @return {!glift.rules.MoveTree} New movetree reference.
   */
  getTreeFromRoot: function(treepath) {
    var mt = this.getFromNode(this.rootNode_);
    if (treepath && glift.util.typeOf(treepath) === 'array') {
      for (var i = 0, len = treepath.length;
           i < len && mt.node().numChildren() > 0; i++) {
        mt.moveDown(treepath[i]);
      }
    }
    return mt;
  },

  ///////////////////////////////////
  // Other methods, in Alpha Order //
  ///////////////////////////////////
  /**
   * Add a new Node to the cur position and move to that position. 
   * @return {!glift.rules.MoveTree} this
   */
  addNode: function() {
    this.node().addChild();
    this.moveDown(this.node().numChildren() - 1);
    return this;
  },

  /** Delete the current node and move up */
  // TODO(kashomon): Finish this.
  deleteNode: function() { throw "Unfinished"; },

  /**
   * Given a point and a color, find the variation number corresponding to the
   * branch that has the specified move. The idea behind this method is that:
   * some player plays a move: does the move currently exist in the movetree?
   *
   * @param {!glift.Point} point Intersection for the move
   * @param {glift.enums.states} color Color of the move.
   * @return {number|null} either the number or null if no such number exists.
   */
  findNextMove: function(point, color) {
    var nextNodes = this.node().children,
        token = glift.sgf.colorToToken(color),
        ptSet = {};
    for (var i = 0; i < nextNodes.length; i++) {
      var node = nextNodes[i];
      if (node.properties().contains(token)) {
        if (node.properties().getOneValue(token) == "") {
          // This is a 'PASS'.  Ignore
        } else {
          ptSet[node.properties().getAsPoint(token).toString()] =
            node.getVarNum();
        }
      }
    }
    if (ptSet[point.toString()] !== undefined) {
      return ptSet[point.toString()];
    } else {
      return null;
    }
  },

  /**
   * Get the intersections number of the go board, by looking at the props. 
   * @return {number}
   */
  getIntersections: function() {
    var mt = this.getTreeFromRoot(),
        prop = glift.rules.prop;
    if (mt.properties().contains(prop.SZ)) {
      var ints = parseInt(mt.properties().getAllValues(prop.SZ), 10);
      return ints;
    } else {
      return 19;
    }
  },

  /**
   * Get the last move ([B] or [W]). This is a convenience method, since it
   * delegates to properties().getMove();
   *
   * Returns a move object: { color:<color point:<point } or null;
   *
   * There are two cases where null can be returned:
   *  - At the root node.
   *  - When, in the middle of the game, stone-placements are added for
   *    illustration (AW,AB).
   * @return {?glift.rules.Move}
   */
  getLastMove: function() {
    return this.properties().getMove();
  },

  /**
   * If not on the mainline, returns the appriate 'move number' for a variation,
   * for the current location, which is the number of moves to mainline
   *
   * @return {number} The number of moves to get to the mainline branch and 0 if
   *    already on the mainline branch.
   */
  movesToMainline: function() {
    var mt = this.newTreeRef();
    for (var n = 0; !mt.onMainline() && mt.node().getParent(); n++) {
      mt.moveUp();
    }
    return n;
  },

  /**
   * Gets the the first node in the parent chain that is on the mainline.
   *
   * @return {!glift.rules.MoveNode}
   */
  getMainlineNode: function() {
    var mt = this.newTreeRef();
    while (!mt.onMainline()) {
      mt.moveUp();
    }
    return mt.node();
  },

  /**
   * Get the next moves (i.e., nodes with either B or W properties);
   *
   * The ordering of the moves is guaranteed to be the ordering of the
   *    variations at the time of creation.
   *
   * @return {!Array<!glift.rules.Move>}
   */
  nextMoves: function() {
    var curNode = this.node();
    var nextMoves = [];
    for (var i = 0; i < curNode.numChildren(); i++) {
      var nextNode = curNode.getChild(i);
      var move = nextNode.properties().getMove();
      if (move) {
        nextMoves.push(move);
      }
    }
    return nextMoves;
  },

  /**
   * Returns true if the tree is currently on a mainline variation and false
   * otherwise.
   * @return {boolean}
   */
  onMainline: function() {
    if (!this.markedMainline_) {
      var mt = this.getTreeFromRoot();
      mt.node().mainline_ = true;
      while (mt.node().numChildren() > 0) {
        mt.moveDown();
        mt.node().mainline_ = true;
      }
      this.markedMainline_ = true;
    }
    return this.node().mainline_;
  },

  /**
   * Construct an entirely new movetree, but add all the previous stones as
   * placements.  If the tree is at the root, it's equivalent to a copy of the
   * movetree.
   *
   * @return {!glift.rules.MoveTree} Entirely new movetree.
   */
  rebase: function() {
    var path = this.treepathToHere();
    var oldMt = this.getTreeFromRoot();
    var oldCurrentPlayer = this.getCurrentPlayer();

    var mt = glift.rules.movetree.getInstance();
    var propMap = { 'BLACK': 'AB', 'WHITE': 'AW' };
    for (var i = 0; i <= path.length; i++) {
      var stones = oldMt.properties().getAllStones();
      for (var color in stones) {
        var moves = stones[color];
        var prop = propMap[color];
        for (var j = 0; j < moves.length; j++) {
          var point = moves[j].point;
          if (point && prop) {
            mt.properties().add(prop, point.toSgfCoord());
          }
        }
      }
      if (i < path.length) {
        oldMt.moveDown(path[i]);
      }
    }

    // Recursive function for copying data.
    var copier = function(oldnode, newnode) {
      for (var prop in oldnode.properties().propMap) {
        if (newnode.getNodeNum() === 0 && (prop === 'AB' || prop === 'AW')) {
          continue; // Ignore. We've already copied stones on the root.
        }
        newnode.properties().set(prop,
            glift.util.simpleClone(oldnode.properties().getAllValues(prop)));
      }
      for (var i = 0; i < oldnode.children.length; i++) {
        var oldChild = oldnode.getChild(i);
        var newChild = newnode.addChild().getChild(i);
        copier(oldChild, newChild);
      }
    }
    copier(oldMt.node(), mt.node());

    // Ensure the current player remains the same.
    var tokenmap = {BLACK: 'B', WHITE: 'W'};
    var mtCurPlayer = mt.getCurrentPlayer();
    if (mtCurPlayer !== oldCurrentPlayer) {
      mt.properties().add(glift.rules.prop.PL, tokenmap[oldCurrentPlayer]);
    }
    return mt;
  },

  /**
   * Recursive over the movetree. func is called on the movetree.
   * @param {function(glift.rules.MoveTree)} func
   */
  recurse: function(func) {
    glift.rules.movetree.searchMoveTreeDFS(this, func);
  },

  /**
   * Recursive over the movetree from root. func is called on the movetree. 
   * @param {function(glift.rules.MoveTree)} func
   */
  recurseFromRoot: function(func) {
    glift.rules.movetree.searchMoveTreeDFS(this.getTreeFromRoot(), func);
  },

  /**
   * Convert this movetree to an SGF.
   * @return {string}
   */
  toSgf: function() {
    return this.toSgfBuffer_(this.getTreeFromRoot().node(), []).join("");
  },

  /**
   * Create a treepath to the current location. This does not change the current
   * movetree.
   *
   * @return {!glift.rules.Treepath} A treepath (an array of variation numbers);
   */
  treepathToHere: function() {
    var newTreepath = [];
    var movetree = this.newTreeRef();
    while (movetree.node().getParent()) {
      newTreepath.push(movetree.node().getVarNum());
      movetree.moveUp();
    }
    return newTreepath.reverse();
  },

  /**
   * Set the intersections property.
   * Note: This is quite dangerous. If the goban and other data structures are
   * not also updated, chaos will ensue
   *
   * @param {number} intersections
   * @return {glift.rules.MoveTree} this object.
   * @private
   */
  setIntersections_: function(intersections) {
    var mt = this.getTreeFromRoot(),
        prop = glift.rules.prop;
    if (!mt.properties().contains(prop.SZ)) {
      this.properties().add(prop.SZ, intersections + "");
    }
    return this;
  },

  /**
   * Recursive method to build an SGF into an array of data.
   * @param {!glift.rules.MoveNode} node A MoveNode instance.
   * @param {!Array<string>} builder String buffer
   * @return {!Array<string>} the built buffer
   * @private
   */
  toSgfBuffer_: function(node, builder) {
    if (node.getParent()) {
      // Don't add a \n if we're at the root node
      builder.push('\n');
    }

    if (!node.getParent() || node.getParent().numChildren() > 1) {
      builder.push("(");
    }

    builder.push(';');
    for (var prop in node.properties().propMap) {
      var values = node.properties().getAllValues(prop);
      var out = prop;
      if (values.length > 0) {
        for (var i = 0; i < values.length; i++) {
          // Ensure a string and escape right brackets.
          var val = glift.parse.sgfEscape(values[i]);
          out += '[' + val + ']'
        }
      } else {
        out += '[]';
      }
      builder.push(out);
    }

    for (var i = 0, len = node.numChildren(); i < len; i++) {
      var child = node.getChild(i);
      if (child) {
        // Child should never be null here since we're iterating over the
        // children, but the method can return null.
        this.toSgfBuffer_(child, builder);
      }
    }

    if (!node.getParent() || node.getParent().numChildren() > 1) {
      builder.push(')');
    }
    return builder
  }
};

goog.provide('glift.rules.ProblemConditions');
goog.provide('glift.rules.problems');

/**
 * Map of prop-to-values.
 *
 * @typedef {!Object<glift.rules.prop, !Array<string>>}
 */
glift.rules.ProblemConditions;

glift.rules.problems = {
  /**
   * Determines if a 'move' is correct. Takes a movetree and a series of
   * conditions, which is a map of properties to an array of possible substring
   * matches.  Only one conditien must be met.
   *
   * Problem results:
   *
   * CORRECT - The position properties must match one of several problem
   *    conditions.
   * INDETERMINATE - There must exist at path to a correct position from the
   *    current position.
   * INCORRECT - The position has to path to a correct position.
   *
   * Some Examples:
   *    Correct if there is a GB property or the words 'Correct' or 'is correct' in
   *    the comment. This is the default.
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   *    Nothing is correct
   *    {}
   *
   *    Correct as long as there is a comment tag.
   *    { C: [] }
   *
   *    Correct as long as there is a black stone (a strange condition).
   *    { B: [] }
   *
   * @param {!glift.rules.MoveTree} movetree
   * @param {!glift.rules.ProblemConditions} conditions
   * @return {glift.enums.problemResults}
   */
  positionCorrectness: function(movetree, conditions) {
    var problemResults = glift.enums.problemResults;
    if (movetree.properties().matches(conditions)) {
      return problemResults.CORRECT;
    } else {
      var flatPaths = glift.rules.treepath.flattenMoveTree(movetree);

      /** @type {!Object<glift.enums.problemResults, boolean>} */
      var successTracker = {};

      // For each path, we evaluate if each path has the possibility of being
      // correct.
      for (var i = 0; i < flatPaths.length; i++) {
        var path = flatPaths[i];
        var newmt = movetree.getFromNode(movetree.node());
        var pathCorrect = false;
        for (var j = 0; j < path.length; j++) {
          newmt.moveDown(path[j]);
          if (newmt.properties().matches(conditions)) {
            pathCorrect = true;
          }
        }
        if (pathCorrect) {
          successTracker[problemResults.CORRECT] = true;
        } else {
          // If no problem conditions are matched, path (variation) is
          // considered incorrect.
          successTracker[problemResults.INCORRECT] = true;
        }
      }

      if (successTracker[problemResults.CORRECT] &&
          !successTracker[problemResults.INCORRECT]) {
        if (movetree.properties().matches(conditions)) {
          return problemResults.CORRECT;
        } else {
          return problemResults.INDETERMINATE;
        }
      } else if (
          successTracker[problemResults.CORRECT] &&
          successTracker[problemResults.INCORRECT]) {
        return problemResults.INDETERMINATE;
      } else {
        return problemResults.INCORRECT;
      }
    }
  },

  /**
   * Gets the correct next moves. This assumes the the SGF is a problem-like SGF
   * with with right conditions specified.
   *
   * @param {!glift.rules.MoveTree} movetree
   * @param {!glift.rules.ProblemConditions} conditions
   * @return {!Array<!glift.rules.Move>} An array of correct next moves.
   */
  correctNextMoves: function(movetree, conditions) {
    var nextMoves = movetree.nextMoves();
    var INCORRECT = glift.enums.problemResults.INCORRECT;
    var correctNextMoves = [];
    for (var i = 0; i < nextMoves.length; i++) {
      movetree.moveDown(i);
      if (glift.rules.problems.positionCorrectness(movetree, conditions)
          !== INCORRECT) {
        correctNextMoves.push(nextMoves[i]);
      }
      movetree.moveUp(); // reset the position
    }
    return correctNextMoves;
  }
};

goog.provide('glift.rules.Properties');
goog.provide('glift.rules.MoveCollection');

/**
 * @param {!Object<glift.rules.prop, !Array<string>>=} opt_map
 * @return {!glift.rules.Properties}
 */
glift.rules.properties = function(opt_map) {
  return new glift.rules.Properties(opt_map);
};

/**
 * A collection of moves.
 *
 * @typedef {{
 *  WHITE: !Array<!glift.rules.Move>,
 *  BLACK: !Array<!glift.rules.Move>
 * }}
 */
glift.rules.MoveCollection;


/**
 * Mark Value. Encapsulates type of mark properties.
 * @typedef {{
 *  point: !glift.Point,
 *  value: string
 * }}
 */
glift.rules.MarkValue;


/**
 * A collection of marks.
 *
 * @typedef {!Object<glift.enums.marks, !Array<glift.rules.MarkValue>>}
 */
glift.rules.MarkCollection;


/**
 * An object describing a property.
 *
 * Example:
 * {
 *  prop: GN
 *  displayName: 'Game Name',
 *  value: 'Lee Sedol vs Gu Li'
 * }
 *
 * @typedef {{
 *  prop: glift.rules.prop,
 *  displayName: string,
 *  value: string
 * }}
 */
glift.rules.PropDescriptor;

/**
 * Properties that accept point values. This is here mostly for full-board
 * modifications (e.g., rotations). It may also be useful for identifying
 * boards.
 *
 * Notes: There are several ways to represent points in SGFs.
 *  [ab] - Simple point at 0,1 (origin=upper left. oriented down-right)
 *  [aa:cc] - Point Rectangle (all points from 0,0 to 2,2 in a rect)
 *
 * Additionally Labels (LB) have the format
 *  [ab:label]
 *
 * @type {!Object<glift.rules.prop, boolean>}
 */
glift.rules.propertiesWithPts = {
  // Marks
  CR: true, LB: true, MA: true, SQ: true, TR: true,
  // Stones
  B: true, W: true, AW: true, AB: true,
  // Clear Stones
  AE: true,
  // Misc. These properties are very rare, and usually can be ignored.
  // Still, they're here for completeness.
  AR: true, // arrow
  DD: true, // gray area
  LN: true, // line
  TB: true, // black area/territory
  TW: true // white area
};

/**
 * @param {!Object<glift.rules.prop, !Array<string>>=} opt_map
 *
 * @package
 * @constructor @final @struct
 */
glift.rules.Properties = function(opt_map) {
  /** @package {!Object<glift.rules.prop, !Array<string>>} */
  this.propMap = opt_map || {};
};

glift.rules.Properties.prototype = {
  /**
   * Add an SGF Property to the current move.
   *
   * Note that this does not overwrite an existing property - for that, the user
   * has to delete the existing property. If the property already exists, we add
   * another data element onto the array.
   *
   * We also assume that all point-rectangles have been converted by the parser
   * into lists of points. http://www.red-bean.com/sgf/sgf4.html#3.5.1
   *
   * @param {glift.rules.prop} prop An sgf property in it's FF4 form (ex: AB).
   * @param {string|!Array<string>} value Either a string or an array of
   *    strings.
   * @return {!glift.rules.Properties} this
   */
  add: function(prop, value) {
    // Return if the property is not string or a real property
    if (!glift.rules.prop[prop]) {
      glift.util.logz('Warning! The property [' + prop + ']' +
          ' is not valid and is not recognized in the SGF spec.' +
          ' Thus, this property will be ignored');
      return this;
    }

    var finished = [];
    if (typeof value === 'string') {
      var zet = /** @type {string} */ (value);
      finished = [value];
    } else {
      finished = /** @type {!Array<string>} */ (value);
    }

    // If the type is a string, make into an array or concat.
    if (this.contains(prop)) {
      this.propMap[prop] = this.getAllValues(prop).concat(finished);
    } else {
      this.propMap[prop] = finished;
    }
    return this;
  },

  /**
   * Return an array of data associated with a property key.  Note: this returns
   * a shallow copy of the properties.
   *
   * If the property doesn't exist, returns null.
   */
  getAllValues: function(strProp) {
    if (glift.rules.prop[strProp] === undefined) {
      return null; // Not a valid Property
    } else if (this.propMap[strProp]) {
      return this.propMap[strProp].slice(); // Return a shallow copy.
    } else {
      return null;
    }
  },

  /**
   * Gets one piece of data associated with a property. Default to the first
   * element in the data associated with a property.
   *
   * Since the getOneValue() always returns an array, it's sometimes useful to
   * return the first property in the list.  Like getOneValue(), if a property
   * or value can't be found, null is returned.
   *
   * @param {glift.rules.prop} prop The property
   * @param {number=} opt_index Optional index. Defaults to 0.
   * @return {?string} The string property or null.
   */
  getOneValue: function(prop, opt_index) {
    var index = opt_index || 0;
    var arr = this.getAllValues(prop);
    if (arr && arr.length >= 1) {
      return arr[index];
    } else {
      return null;
    }
  },

  /**
   * Get a value from a property and return the point representation.
   * Optionally, the user can provide an index, since each property points to an
   * array of values.
   *
   * @param {glift.rules.prop} prop The SGF property.
   * @param {number=} opt_index Optional index. defaults to 0.
   * @return {?glift.Point} Returns a Glift point or null if the property
   *    doesn't exist.
   */
  getAsPoint: function(prop, opt_index) {
    var out = this.getOneValue(prop, opt_index);
    if (out) {
      return glift.util.pointFromSgfCoord(out);
    } else {
      return null;
    }
  },

  /**
   * Rotates an SGF Property. Note: This only applies to stone-properties.
   *
   * Recall that in the SGF, we should have already converted any point
   * rectangles, so there shouldn't be any issues here with converting point
   * rectangles.
   *
   * @param {glift.rules.prop} prop
   * @param {number} size Size of the Go Board.
   * @param {glift.enums.rotations} rotation Rotation to perform
   */
  rotate: function(prop, size, rotation) {
    if (!glift.rules.propertiesWithPts[prop]) {
      return;
    }
    if (!glift.enums.rotations[rotation] ||
        rotation === glift.enums.rotations.NO_ROTATION) {
      return
    }
    var regex = /([a-z][a-z])/g;
    if (prop === glift.rules.prop.LB) {
      // We handle labels specially since labels have a unqiue format
      regex = /([a-z][a-z])(?=:)/g;
    }
    var vals = this.getAllValues(prop);
    for (var i = 0; i < vals.length; i++) {
      vals[i] = vals[i].replace(regex, function(sgfPoint) {
        return glift.util.pointFromSgfCoord(sgfPoint)
            .rotate(size, rotation)
            .toSgfCoord();
      });
    }
    this.propMap[prop] = vals;
  },

  /**
   * Returns true if the current move has the property "prop".  Return
   * false otherwise.
   *
   * @param {glift.rules.prop} prop
   * @return {boolean}
   */
  contains: function(prop) {
    return prop in this.propMap;
  },

  /**
   * Tests wether a prop contains a value
   *
   * @param {glift.rules.prop} prop
   * @param {string} value
   * @return {boolean}
   */
  hasValue : function(prop, value) {
    if (!this.contains(prop)) {
      return false;
    }
    var vals = this.getAllValues(prop);
    for (var i = 0; i < vals.length; i++) {
      if (vals[i] === value) {
        return true;
      }
    }
    return false;
  },

  /**
   * Deletes the prop and return the value.
   * @param {glift.rules.prop} prop
   * @return {?Array<string>} The former values of this property.
   */
  remove: function(prop) {
    if (this.contains(prop)) {
      var allValues = this.getAllValues(prop);
      delete this.propMap[prop];
      return allValues;
    } else {
      return null;
    }
  },

  /**
   * Remove one value from the property list. Returns the value if it was
   * successfully removed.  Removes only the first value -- any subsequent value
   * remains in the property list.
   * @param {glift.rules.prop} prop
   * @param {string} value
   */
  removeOneValue: function(prop, value) {
    if (this.contains(prop)) {
      var allValues = this.getAllValues(prop);
      var index = -1;
      for (var i = 0, len = allValues.length; i < len; i++) {
        if (allValues[i] === value) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        allValues.splice(index, 1);
        this.set(prop, allValues);
      }
    } else {
      return null;
    }
  },

  /**
   * Sets current value, even if the property already exists.
   * @param {glift.rules.prop} prop
   * @param {string|!Array<string>} value
   * @return {glift.rules.Properties} this
   */
  set: function(prop, value) {
    if (prop && value && glift.rules.prop[prop]) {
      if (glift.util.typeOf(value) === 'string') {
        this.propMap[prop] = [/** @type {string} */ (value)];
      } else if (glift.util.typeOf(value) === 'array') {
        this.propMap[prop] = /** @type {!Array<string>} */ (value);
      }
    }
    return this;
  },

  //---------------------//
  // Convenience methods //
  //---------------------//

  /**
   * Get all the placements for a color.  Return as an array.
   * @param {glift.enums.states} color
   * @return {!Array<!glift.Point>} points. If no placements are found, returns
   *    an empty array.
   */
  getPlacementsAsPoints: function(color) {
    var prop;
    if (color === glift.enums.states.BLACK) {
      prop = glift.rules.prop.AB;
    } else if (color === glift.enums.states.WHITE) {
      prop = glift.rules.prop.AW;
    } else {
      return  [];
    }

    if (!this.contains(prop)) {
      return [];
    }
    return glift.sgf.allSgfCoordsToPoints(this.getAllValues(prop));
  },

  /**
   * Get all the clear-locations as points. Clear locations are indicated by AE.
   * The SGF spec is unclear about how to handle clear-locations when there are
   * other stone properties (B,W,AB,AW). Generally, it probably makes the most
   * sense to apply the clear-locations first.
   *
   * @return {!Array<!glift.Point>} the points. If the AE property isn't found,
   *    returns an empty array.
   */
  getClearLocationsAsPoints: function() {
    var AE = glift.rules.prop.AE;
    if (!this.contains(AE)) {
      return [];
    }
    return glift.sgf.allSgfCoordsToPoints(this.getAllValues(AE));
  },

  /**
   * Get the current comment on the move. It's provided as a convenience method
   * since it's an extremely comment operation.
   *
   * @return {?string}
   */
  getComment: function() {
    if (this.contains(glift.rules.prop.C)) {
      return this.getOneValue(glift.rules.prop.C);
    } else {
      return null;
    }
  },

  /**
   * Get the current Move.  Returns null if no move exists.
   *
   * If the move is a pass, then in the SGF, we'll see B[] or W[].  Thus,
   * we will return { color: BLACK } or { color: WHITE }, but we won't have any
   * point associated with this.
   *
   * @return {?glift.rules.Move}.
   */
  getMove: function() {
    var BLACK = glift.enums.states.BLACK;
    var WHITE = glift.enums.states.WHITE;
    if (this.contains(glift.rules.prop.B)) {
      if (this.getOneValue(glift.rules.prop.B) === "") {
        return { color: BLACK }; // This is a PASS
      } else {
        return {
          color: BLACK,
          point: this.getAsPoint(glift.rules.prop.B) || undefined
        }
      }
    } else if (this.contains(glift.rules.prop.W)) {
      if (this.getOneValue(glift.rules.prop.W) === '') {
        return { color: WHITE }; // This is a PASS
      } else {
        return {
          color: WHITE,
          point: this.getAsPoint(glift.rules.prop.W) || undefined
        };
      }
    } else {
      return null;
    }
  },

  /**
   * Test whether this set of properties match a series of conditions.  Returns
   * true or false.  Conditions have the form:
   *
   * { <property>: [series,of,conditions,to,match], ... }
   *
   * Example:
   *    Matches if there is a GB property or the words 'Correct' or 'is correct' in
   *    the commentj
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   * Note: This is an O(lnm) ~ O(n^3).  But practice, you'll want to test
   * against singular properties, so it's more like O(n^2)
   *
   * @param {!glift.rules.ProblemConditions} conditions Set of
   *    property-conditions to check.
   * @return {boolean}
   */
  matches: function(conditions) {
    for (var key in conditions) {
      if (this.contains(key)) {
        var substrings = conditions[key];
        if (substrings.length === 0) {
          return true;
        }
        var allValues = this.getAllValues(key);
        for (var i = 0, len = allValues.length ; i < len; i++) {
          for (var j = 0, slen = substrings.length; j < slen; j++) {
            var value = allValues[i];
            var substr = substrings[j];
            if (value.indexOf(substr) !== -1) {
              return true;
            }
          }
        }
      }
    }
    return false;
  },

  /**
   * Get all the stones (placements and moves).  This ignores 'PASS' moves.
   *
   * @return {!glift.rules.MoveCollection}
   */
  getAllStones: function() {
    var states = glift.enums.states,
        out = {},
        BLACK = states.BLACK,
        WHITE = states.WHITE;
    out.WHITE = [];
    out.BLACK = [];

    var bplace = this.getPlacementsAsPoints(states.BLACK);
    var wplace = this.getPlacementsAsPoints(states.WHITE);
    for (var i = 0; i < bplace.length; i++) {
      out.BLACK.push({point: bplace[i], color: BLACK});
    }
    for (var i = 0; i < wplace.length; i++) {
      out.WHITE.push({point: wplace[i], color: WHITE});
    }
    var move = this.getMove();
    if (move && move.point) {
      out[move.color].push(move);
    }
    return out;
  },


  /**
   * Gets all the marks, where the output is a map from glift mark enum to array
   * of points. In the case of labels, a value key is supplied as well to
   * indicate the label. Note that the board must contain at least one mark for
   * a key to exist in the output map
   *
   * The return has the format:
   *  {
   *    LABEL: [{value: lb, point: pt}, ...],
   *    : [{point: pt}, ...]
   *  }
   * return {!glift.rules.MarkCollection}
   */
  getAllMarks: function() {
    /**
     * @type {!Object<glift.rules.prop, glift.enums.states>}
     */
    var propertiesToMarks = {
      CR: glift.enums.marks.CIRCLE,
      LB: glift.enums.marks.LABEL,
      MA: glift.enums.marks.XMARK,
      SQ: glift.enums.marks.SQUARE,
      TR: glift.enums.marks.TRIANGLE
    };
    var outMarks = {};
    for (var prop in propertiesToMarks) {
      var mark = propertiesToMarks[prop];
      if (this.contains(prop)) {
        var data = this.getAllValues(prop);
        var marksToAdd = [];
        for (var i = 0; i < data.length; i++) {
          if (prop === glift.rules.prop.LB) {
            // Labels have the form { point: pt, value: 'A' }
            marksToAdd.push(glift.sgf.convertFromLabelData(data[i]));
          } else {
            // A single point or a point rectangle (which is why the return-type
            // is an array.
            var newPts = glift.util.pointArrFromSgfProp(data[i])
            for (var j = 0; j < newPts.length; j++) {
              marksToAdd.push({
                point: newPts[j]
              });
            }
          }
        }
        outMarks[mark] = marksToAdd;
      }
    }
    return outMarks;
  },

  /**
   * Get the game info key-value pairs. Ex:
   * [{
   *  prop: GN
   *  displayName: 'Game Name',
   *  value: 'Lee Sedol vs Gu Li'
   * },...
   * ]
   * @return {!Array<!glift.rules.PropDescriptor>}
   */
  // TODO(kashomon): Add test
  getGameInfo: function() {
    var gameInfoArr = [];
    /**
     * @type {!Object<glift.rules.prop, string>}
     */
    var propNameMap = {
      PW: 'White Player',
      PB: 'Black Player',
      RE: 'Result',
      AN: 'Commenter',
      SO: 'Source',
      RU: 'Ruleset',
      KM: 'Komi',
      GN: 'Game Name',
      EV: 'Event',
      RO: 'Round',
      PC: 'Place Name',
      DT: 'Date'
    };
    for (var key in propNameMap) {
      if (this.contains(key)) {
        var displayName = propNameMap[key];
        var obj = {
          prop: key,
          displayName: displayName,
          value: this.getOneValue(key)
        };
        // Post processing for some values.
        // We attach the ranks like Kashomon [9d], if they exist.
        if (key === glift.rules.prop.PW &&
            this.contains(glift.rules.prop.WR)) {
          obj.value += ' [' + this.getOneValue(glift.rules.prop.WR) + ']';
        } else if (key === glift.rules.prop.PB &&
            this.contains(glift.rules.prop.BR)) {
          obj.value += ' [' + this.getOneValue(glift.rules.prop.BR) + ']';
        }
        // Remove trailing zeroes on komi amounts.
        else if (key === glift.rules.prop.KM) {
          obj.value = parseFloat(this.getOneValue(key)) + '' || '0';
        }
        gameInfoArr.push(obj);
      }
    }
    return gameInfoArr;
  },
};

goog.provide('glift.rules.AppliedTreepath');
goog.provide('glift.rules.Treepath');
goog.provide('glift.rules.treepath');

/**
 * @typedef {!Array<number>}
 */
glift.rules.Treepath;

/**
 * The result of a treepath applied to a movetree.
 *
 * @typedef {{
 *  movetree: !glift.rules.MoveTree,
 *  stones: !Array<!glift.rules.Move>
 * }}
 */
glift.rules.AppliedTreepath;

/**
 * # Treepath
 *
 * A treepath is a list of variations that says how to travel through a tree of
 * moves. So,
 *
 *    [0,1,0]
 *
 * Means we will first take the 0th variation, then we will take the 1ist
 * variation, and lastly we will take the 0th variation again. For
 * convenience, the treepath can also be specified by a string, which is where
 * the fun begins. At it's simpliest,
 *
 *    [0,0,0] becomes 0.0.0
 *
 * but there are a couple different short-hands that make using treepaths a
 * little easier
 *
 *    0.1+    Take the 0th variation, then the 1st variation, then go to the end
 *    0.1:2   Take the 0th variation, then repeat taking the 1st varation twice
 *
 * There are two types of treepaths discussed below -- A *treepath fragment*
 * (which is what we have been describing) and an *initial treepath*.
 *
 * ## Treepath Fragments
 *
 * Treepaths say how to get from position n to position m.  Thus the numbers are
 * always variations except in the case of AxB syntax, where B is a multiplier
 * for a variation.
 *
 * This is how fragment strings are parsed:
 *
 *    0             becomes [0]
 *    1             becomes [1]
 *    53            becomes [53] (the 53rd variation)
 *    2.3           becomes [2,3]
 *    0.0.0.0       becomes [0,0,0]
 *    0:4           becomes [0,0,0,0]
 *    1+            becomes [1,0...(500 times)]
 *    1:4           becomes [1,1,1,1]
 *    1.2:1.0.2:3'  becomes [1,2,0,2,2,2]
 *
 * ## Initial tree paths.
 *
 * The initial treepath always treats the first number as a 'move number'
 * instead of a variation. Thus
 *
 *    3.1.0
 *
 * means start at move 3 (always taking the 0th variation path) and then take
 * the path fragment [1,0].
 *
 * Some examples:
 *
 *    0         - Start at the 0th move (the root node)
 *    53        - Start at the 53rd move (taking the 0th variation)
 *    2.3       - Start at the 3rd variation on move 2 (actually move 3)
 *    3         - Start at the 3rd move
 *    2.0       - Start at the 3rd move
 *    0.0.0.0   - Start at the 3rd move
 *    0.0:3     - Start at the 3rd move
 *
 * As with fragments, the init position returned is an array of variation
 * numbers traversed through.  The move number is precisely the length of the
 * array.
 *
 * So, for parsing
 *
 *    0         becomes []
 *    1         becomes [0]
 *    0.1       becomes [1]
 *    53        becomes [0,0,0,...,0] (53 times)
 *    2.3       becomes [0,0,3]
 *    0.0.0.0   becomes [0,0,0]
 *    1+        becomes [0,0,...(500 times)]
 *    0.1+      becomes [1,0,...(500 times)]
 *    0.2.6+    becomes [2,6,0,...(500 times)]
 *    0.0:3.1x3 becomes [0,0,0,1,1,1]
 *
 * As mentioned before, '+' is a special symbol which means "go to the end via
 * the first variation." This is implemented with a by appending 500 0s to the
 * path array.  This is a hack, but in practice games don't go over 500 moves.
 *
 * Obsolete syntax:
 *    2.3-4.1 becomes [0,0,3,0,1]
 */
glift.rules.treepath = {
  /**
   * Parse an initial treepath
   *
   * @param {number|string|!Array<number>|undefined} initPos The initial
   *    position, which can be defined as a variety of types.
   * @return {!glift.rules.Treepath}
   */
  parseInitialPath: function(initPos) {
    if (initPos === undefined) {
      return [];
    } else if (glift.util.typeOf(initPos) === 'number') {
      initPos = parseInt(initPos, 10) + '';
    } else if (glift.util.typeOf(initPos) === 'array') {
      return /** @type {glift.rules.Treepath} */ (initPos);
    } else if (glift.util.typeOf(initPos) === 'string') {
      // Fallthrough and parse the path.  This is the expected behavior.
    } else {
      return [];
    }

    if (initPos === '+') {
      // Should this syntax even be allowed?
      return glift.rules.treepath.toEnd_();
    }

    var out = [];
    var firstNum = parseInt(initPos, 10);
    for (var j = 0; j < firstNum; j++) {
      out.push(0);
    }

    // The only valid next characters are . or +.
    var rest = initPos.replace(firstNum + '', '');
    if (rest == '') {
      return out;
    }

    var next = rest.charAt(0);
    if (next === '.') {
      return out.concat(glift.rules.treepath.parseFragment(rest.substring(1)));
    } else if (next === '+') {
      return out.concat(glift.rules.treepath.toEnd_());
    } else {
      throw new Error('Unexpected token [' + next + '] for path ' + initPos)
    }
  },

  /**
   * Path fragments are like path strings except that path fragments only allow
   * the 0.0.1.0 or [0,0,1,0] syntax. Also, paths like 3.2.1 are transformed
   * into [3,2,1] rather than [0,0,0,2,1].
   *
   * @param {!Array<number>|string} pathStr An initial path.
   * @return {!glift.rules.Treepath} The parsed treepath.
   */
  parseFragment: function(pathStr) {
    if (!pathStr) {
      pathStr = [];
    }
    var vartype = glift.util.typeOf(pathStr);
    if (vartype === 'array') {
      // Assume the array is in the correct format.
      return /** @type {glift.rules.Treepath} */ (pathStr);
    }
    if (vartype !== 'string') {
      throw new Error('When parsing fragments, type should be string. was: ' + 
          vartype);
    }
    var splat = pathStr.split(/([\.:+])/);
    var numre = /^\d+$/;
    var out = [];

    var states = {
      VARIATION: 1,
      SEPARATOR: 2,
      MULTIPLIER: 3,
    };
    var curstate = states.VARIATION;
    var prevVariation = null;
    for (var i = 0; i < splat.length; i++) {
      var token = splat[i];
      if (curstate === states.SEPARATOR) {
        if (token === '.') {
          curstate = states.VARIATION;
        } else if (token === ':') {
          curstate = states.MULTIPLIER;
        } else if (token === '+') {
          // There could be more characters after this. Maybe throw an error.
          return out.concat(glift.rules.treepath.toEnd_());
        } else {
          throw new Error('Unexpected token ' + token + ' for path ' + pathStr);
        }
      } else {
        if (!numre.test(token)) {
          throw new Error('Was expecting number but found ' + token
              + ' for path: ' + pathStr);
        }
        var num = parseInt(token, 10);
        if (curstate === states.VARIATION) {
          out.push(num);
          prevVariation = num;
          curstate = states.SEPARATOR;
        } else if (curstate === states.MULTIPLIER) {
          if (prevVariation === null) {
            throw new Error('Error using variation multiplier for path: '
                + pathStr);
          }
          // We should have already added the variation once, so we add num-1
          // more times. This has the side effect that 0:0 is equivalent to 0:1
          // and also equivalent to just 0. Probably ok.
          for (var j = 0; j < num - 1; j++) {
            out.push(prevVariation);
          }
          prevVariation = null;
          curstate = states.SEPARATOR;
        }
      }
    }
    return out;
  },

  /**
   * Converts a treepath fragement back to a string.  In other words:
   *    [2,0,1,2,6] => 2.0.1.2.6
   *    [0,0,0,0] => 0:4
   *    [0,0,0,0,1,1,1] => 0:4.1:3
   * If the treepath is empty, returns an empty string.
   *
   * @param {!glift.rules.Treepath} path A treepath fragment.
   * @return {string} A fragment string.
   */
  toFragmentString: function(path) {
    if (glift.util.typeOf(path) !== 'array') {
      // This is probably unnecessary, but exists for safety.
      return path.toString();
    }
    if (path.length === 0) {
      return '';
    }
    var last = null;
    var next = null;
    var repeated = 0;
    var out = null;

    var flush = function() {
      var component = '';
      if (repeated < 2) {
        component = last + '';
      } else {
        component = last + ':' + repeated;
      }
      if (out === null) {
        out = component;
      } else {
        out += '.' + component;
      }
      repeated = 1;
    }

    for (var i = 0; i < path.length; i++) {
      next = path[i];
      if (last === null) {
        last = next;
      }
      if (next === last) {
        repeated++;
      } else {
        flush();
      }
      last = next;
    }
    flush();
    return out;
  },

  /**
   * Converts a treepath back to an initial path string. This is like the
   * toFragmentString, except that long strings of -initial- zeroes are
   * converted to move numbers.
   *
   * I.e,
   *   0,0,0 => 3
   *   0,0,0.1 => 3.1
   *
   * Note: Once we're on a variation, we don't collapse the path
   *
   * @param {!glift.rules.Treepath} path A full treepath from the root.
   * @return {string} A full path string.
   */
  toInitPathString: function(path) {
    if (glift.util.typeOf(path) !== 'array') {
      return path.toString();
    }
    if (path.length === 0) {
      return '0';
    }

    var out = [];
    var onMainLine = true;
    var firstNumber = 0;
    for (var i = 0; i < path.length; i++) {
      var elem = path[i];
      if (elem !== 0) {
        break;
      } else {
        firstNumber = i + 1;
      }
    }
    var component = glift.rules.treepath.toFragmentString(path.slice(firstNumber));
    if (component) {
      return firstNumber + '.' + component;
    } else {
      return firstNumber + '';
    }
  },

  /**
   * Lazily computed treepath value.
   * @private {?glift.rules.Treepath}
   */
  storedToEnd_: null,

  /**
   * Return an array of 500 0-th variations.  This is sort of a hack, but
   * changing this would involve rethinking what a treepath is.
   *
   * @private
   * @return {!glift.rules.Treepath}
   */
  toEnd_: function() {
    if (glift.rules.treepath.storedToEnd_ != null) {
      return glift.rules.treepath.storedToEnd_;
    }
    var storedToEnd = []
    for (var i = 0; i < 500; i++) {
      storedToEnd.push(0);
    }
    glift.rules.treepath.storedToEnd_ = storedToEnd;
    return glift.rules.treepath.storedToEnd_;
  },

  /**
   * Use some heuristics to find a nextMovesPath.  This is used for
   * automatically adding move numbers.
   *
   * Note: The movetree should be in _final position_. The algorithm below works
   * backwards, continually updating a next-moves path as it goes. It finally
   * terminates when it reaches one of three conditions
   *  - There's a comment.
   *  - We go from variation to main branch.
   *  - We exceed minus-moves-override.
   *
   * _Important Note_ on starting moves: the resulting movetree has the
   * property that the initial position of the movetree should not be considered
   * for diagram purposes. I.e., the first move to be diagramed should be the
   * first element of the nextMoves path. So movetree+nextMoves[0] should be
   * the first move.
   *
   * @param {glift.rules.MoveTree} movetree A movetree, of course.
   * @param {glift.rules.Treepath=} opt_initTreepath The initial treepath. If not
   *    specified or undefined, use the current location in the movetree.
   * @param {number=} opt_minusMovesOverride: Force findNextMoves to to return a
   *    nextMovesPath of this length, starting from the init treepath.  The
   *    actual nextMovesPath can be shorter. (Note: This option should be
   *    deleted).
   * @param {boolean=} opt_breakOnComment Whether or not to break on comments on the
   *    main variation.  Defaults to true
   *
   * @return {{
   *  movetree: !glift.rules.MoveTree,
   *  treepath: !glift.rules.Treepath,
   *  nextMoves: !glift.rules.Treepath
   * }} An object with the following properties:
   *
   * - movetree: An updated movetree
   * - treepath: A new treepath that says how to get to this position
   * - nextMoves: A nextMovesPath, used to apply for the purpose of
   *    crafting moveNumbers.
   */
  findNextMovesPath: function(
      movetree, opt_initTreepath, opt_minusMovesOverride, opt_breakOnComment) {
    var initTreepath = opt_initTreepath || movetree.treepathToHere();
    var breakOnComment = opt_breakOnComment === false ? false : true;
    var mt = movetree.getTreeFromRoot(initTreepath);
    var minusMoves = opt_minusMovesOverride || 1000;
    var nextMovesPath = [];
    var startMainline = mt.onMainline();
    for (var i = 0; mt.node().getParent() && i < minusMoves; i++) {
      var varnum = mt.node().getVarNum();
      nextMovesPath.push(varnum);
      mt.moveUp();
      if (breakOnComment &&
          mt.properties().getOneValue(glift.rules.prop.C)) {
        break;
      }

      if (!startMainline && mt.onMainline()) {
        break; // Break if we've moved to the mainline from a variation
      }
    }
    nextMovesPath.reverse();
    return {
      movetree: mt,
      treepath: mt.treepathToHere(),
      nextMoves: nextMovesPath
    };
  },

  /**
   * Apply the nextmoves and find the collisions.
   *
   * augmented stone objects take the form:
   *    {point: <point>, color: <color>}
   * or
   *    {point: <point>, color: <color>, collision:<idx>}
   *
   * where idx is an index into the stones object. If idx is null, the stone
   * conflicts with a stone added elsewhere (i.e., in the goban).  This should
   * be a reasonably common case.
   *
   * @param {!glift.rules.MoveTree} movetree A rules.movetree.
   * @param {!glift.rules.Goban} goban A rules.goban array.
   * @param {!glift.rules.Treepath} nextMoves A next-moves treepath (fragment).
   *
   * @return {!glift.rules.AppliedTreepath} The result of applying the treepath
   *
   * - movetree: The updated movetree after applying the nextmoves
   * - stones: Array of 'augmented' stone objects
   */
  applyNextMoves: function(movetree, goban, nextMoves) {
    var colors = glift.enums.states;
    var mt = movetree.newTreeRef();
    var stones = [];
    var placedMap = {}; // map from ptstring to idx
    for (var i = 0; i < nextMoves.length; i++) {
      mt.moveDown(nextMoves[i]);
      var move = mt.properties().getMove();
      if (move && move.point && move.color) {
        var ptString = move.point.toString();
        var gcolor = goban.getStone(move.point);
        if (gcolor !== colors.EMPTY) {
          move.collision = null;
        } else if (placedMap[ptString] !== undefined) {
          move.collision = placedMap[ptString];
        }
        stones.push(move);
        placedMap[ptString] = i;
      }
    }
    return {
      movetree: mt,
      stones: stones
    };
  },

  /**
   * Flatten the move tree variations into a list of lists, where the sublists
   * are each a treepath.
   *
   * @param {!glift.rules.MoveTree} movetree The current movetree to flatten.
   * return {!Array<glift.rules.Treepath>} treepath An array of all possible
   *    treepaths.
   */
  flattenMoveTree: function(movetree) {
    var out = [];
    movetree = movetree.newTreeRef();
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      movetree.moveDown(i);
      var result = glift.rules.treepath._flattenMoveTree(movetree, []);
      movetree.moveUp();
      for (var j = 0; j < result.length; j++) {
        out.push(result[j])
      }
    }
    return out;
  },

  /**
   * @param {!glift.rules.MoveTree} movetree The movetree.
   * @param {!glift.rules.Treepath} pathToHere A treepath to here.
   * @private
   */
  _flattenMoveTree: function(movetree, pathToHere) {
    if (pathToHere === undefined) pathToHere = [];
    pathToHere.push(movetree.node().getVarNum());
    var out = [];
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      movetree.moveDown(i)
      var thisout = glift.rules.treepath._flattenMoveTree(
          movetree, pathToHere.slice());
      out = out.concat(thisout)
      movetree.moveUp()
    }
    if (out.length == 0) out.push(pathToHere);
    return out;
  }
};

/**
 * The SGF library contains functions for dealing with SGFs.
 *
 * This includes a parser and various utilities related to SGFs.
 */
glift.sgf = {
  /** Return a move property from a property. */
  colorToToken: function(color) {
    if (color === glift.enums.states.WHITE) {
      return 'W';
    } else if (color === glift.enums.states.BLACK) {
      return 'B';
    } else {
      throw "Unknown color-to-token conversion for: " + color;
    }
  },

  /** Return placement property from a color. */
  colorToPlacement: function(color) {
    if (color === glift.enums.states.WHITE) {
      return 'AW';
    } else if (color === glift.enums.states.BLACK) {
      return 'AB';
    } else {
      throw "Unknown color-to-token conversion for: " + color;
    }
  },

  /**
   * Given a Glift mark type (enum), returns the revelant SGF property string.
   * If no such mapping is found, returns null.
   *
   * Example: XMARK => MA
   *          FOO => null
   */
  markToProperty: function(mark)  {
    var allProps = glift.rules.prop;
    var markToPropertyMap = {
      LABEL_ALPHA: allProps.LB,
      LABEL_NUMERIC: allProps.LB,
      LABEL: allProps.LB,
      XMARK: allProps.MA,
      SQUARE: allProps.SQ,
      CIRCLE: allProps.CR,
      TRIANGLE: allProps.TR
    };
    return markToPropertyMap[mark] || null;
  },

  /**
   * Given a SGF property, returns the relevant SGF property. If no such mapping
   * is found, returns null.
   *
   * Example: MA => XMARK
   *          FOO => null.
   */
  propertyToMark: function(prop) {
    var marks = glift.enums.marks;
    var propertyToMarkMap = {
      LB: marks.LABEL,
      MA: marks.XMARK,
      SQ: marks.SQUARE,
      CR: marks.CIRCLE,
      TR: marks.TRIANGLE
    };
    return propertyToMarkMap[prop] || null;
  },

  /**
   * Converts an array of SGF points ('ab', 'bb') to Glift points ((0,1),
   * (1,1)).
   */
  allSgfCoordsToPoints: function(arr) {
    var out = [];
    if (!arr) {
      return out;
    }
    for (var i = 0; i < arr.length; i++) {
      out.push(glift.util.pointFromSgfCoord(arr[i]));
    }
    return out;
  },

  /**
   * Convert label data to a simple object.
   */
  convertFromLabelData: function(data) {
    var parts = data.split(":"),
        pt = glift.util.pointFromSgfCoord(parts[0]),
        value = parts[1];
    return {point: pt, value: value};
  },

  convertFromLabelArray: function(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      out.push(glift.sgf.convertFromLabelData(arr[i]));
    }
    return out;
  }
};

goog.provide('glift.svg');

/**
 * SVG utilities. Arguably, this should be in the Glift ui. But the utilities,
 * modulo some dom-utilities, are agnostic to any rendering engine.
 */
glift.svg = {};

goog.provide('glift.svg.pathutils');

glift.svg.pathutils = {
  /**
   * Move the current position to X,Y.  Usually used in the context of creating a
   * path.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  move: function(x, y) {
    return "M" + x + " " + y;
  },

  /**
   * Like move, but with a glift point.
   * @param {!glift.Point} pt
   * @return {string}
   */
  movePt: function(pt) {
    return glift.svg.pathutils.move(pt.x(), pt.y());
  },

  /**
   * Create a relative SVG line, starting from the 'current' position. I.e.,
   * the (0,0) point is that last place drawn-to or moved-to.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  lineRel: function(x, y) {
    return "l" + x + " " + y;
  },

  /**
   * Like lineRel, but with a pt.
   * @param {!glift.Point} pt
   * @return {string}
   */
  lineRelPt: function(pt) {
    return glift.svg.pathutils.lineRel(pt.x(), pt.y());
  },

  /**
   * Create an absolute SVG line -- different from lower case.
   * This form is usually preferred.
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  lineAbs: function(x, y) {
    return "L" + x + " " + y;
  },

  /**
   * Like lineAbs, but with a pt.
   * @param {!glift.Point} pt
   * @return {string}
   */
  lineAbsPt: function(pt) {
    return glift.svg.pathutils.lineAbs(pt.x(), pt.y());
  },
};

goog.provide('glift.svg.SvgObj');

/**
 * Creats a SVG Wrapper object.
 *
 * @param {string} type Svg element type.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 */
glift.svg.createObj = function(type, opt_attrObj) {
   return new glift.svg.SvgObj(type, opt_attrObj);
};

/**
 * Creates a root SVG object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.svg = function(opt_attrObj) {
  return new glift.svg.SvgObj('svg', opt_attrObj)
      .setAttr('version', '1.1')
      .setAttr('xmlns', 'http://www.w3.org/2000/svg');
};

/**
 * Creates a circle svg object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.circle = function(opt_attrObj) {
  return new glift.svg.SvgObj('circle', opt_attrObj);
};

/**
 * Creates a path svg object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.path = function(opt_attrObj) {
  return new glift.svg.SvgObj('path', opt_attrObj);
};

/**
 * Creates an rectangle svg object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.rect = function(opt_attrObj) {
  return new glift.svg.SvgObj('rect', opt_attrObj);
};

/**
 * Creates an image svg object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.image = function(opt_attrObj) {
  return new glift.svg.SvgObj('image', opt_attrObj);
};

/**
 * Creates a text svg object.
 * @param {!Object<string>=} opt_attrObj optional attribute object.
 * @return {!glift.svg.SvgObj}
 */
glift.svg.text = function(opt_attrObj) {
  return new glift.svg.SvgObj('text', opt_attrObj);
};

/**
 * Create a group object (without any attributes)
 * @return {!glift.svg.SvgObj}
 */
glift.svg.group = function() {
  return new glift.svg.SvgObj('g');
};

/**
 * SVG Wrapper object.
 * @constructor @final @struct
 *
 * @param {string} type Svg element type.
 * @param {Object<string>=} opt_attrObj optional attribute object.
 */
glift.svg.SvgObj = function(type, opt_attrObj) {
  /** @private {string} */
  this.type_ = type;

  /**
   * Optional style tag. Should really only be on the top-level SVG element.
   * For more details, see:
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style
   * @private {string}
   */
  this.style_ = '';

  /** @private {!Object<string>} */
  this.attrMap_ = opt_attrObj || {};
  /** @private {!Array<!glift.svg.SvgObj>} */
  this.children_ = [];
  /** @private {!Object<!glift.svg.SvgObj>} */
  this.idMap_ = {};
  /** @private {string} */
  this.text_ = '';
  /** @private {?Object} */
  this.data_ = null;
};

glift.svg.SvgObj.prototype = {
  /**
   * Return the string form of the svg object.
   * @return {string}
   */
  render: function() {
    var base = '<' + this.type_;
    for (var key in this.attrMap_) {
      base += ' ' + key + '="' + this.attrMap_[key] + '"';
    }
    base += '>' + this.text_;
    if (this.style_) {
      base += '\n' +
        '<style>\n' +
        '/* <![CDATA[ */\n' +
        this.style_ + '\n' +
        '/* ]]> */\n' +
        '</style>\n';
    }
    if (this.children_.length > 0) {
      base += '\n';
      for (var i = 0; i < this.children_.length; i++) {
        base += this.children_[i].render() + '\n';
      }
      base += '</' + this.type_ + '>';
    } else {
      base += '</' + this.type_ + '>';
    }
    return base;
  },

  /** @return {string} A value in the attribute map. */
  attr: function(key) {
    return this.attrMap_[key];
  },

  /**
   * Sets an SVG attribute.
   * @param {string} key The key of an object in the map.
   * @param {string|number} value The value to set in the map.
   * @return {!glift.svg.SvgObj} This object.
   */
  setAttr: function(key, value) {
    this.attrMap_[key] = value + '';
    return this;
  },

  /**
   * Sets the top-level CSS-styling.
   * @param {string} s
   * @return {!glift.svg.SvgObj} This object.
   */
  setStyle: function(s) {
    this.style_ = s;
    return this;
  },

  /** @return {?string} the Id of this object or null. */
  id: function() {
    return /** @type {?string} */ (this.attrMap_['id'] || null);
  },

  /**
   * Convenience method to avoid null ID type.
   * @return {string}
   */
  idOrThrow: function() {
    if (this.id() == null) {
      throw new Error('ID was null; expected to be non-null');
    }
    return /** @type {string} */ (this.id());
  },

  /**
   * Sets the ID (using the Attribute object as a store).
   * @param {string} id
   * @return {!glift.svg.SvgObj} This object.
   */
  setId: function(id) {
    if (id) {
      this.attrMap_['id'] = id;
    }
    return this;
  },

  /** @return {!Object<string>} The attribute object.  */
  attrObj: function() {
    return this.attrMap_;
  },

  /**
   * Sets the entire attribute object.
   * @param {!Object<string>} attrObj
   * @return {!glift.svg.SvgObj} This object.
   */
  setAttrObj: function(attrObj) {
    if (glift.util.typeOf(attrObj) !== 'object') {
      throw new Error('Attr obj must be of type object');
    }
    this.attrMap_ = attrObj;
    return this;
  },

  /** @return {?Object} The node's data */
  data: function() {
    return this.data_
  },

  /**
   * Set some internal data. Note: this data is not attached when the element is
   * generated.
   * @param {!Object} data
   * @return {!glift.svg.SvgObj} This object.
   */
  setData: function(data) {
    this.data_ = data;
    return this;
  },

  /** @return {string} The text on the node. */
  text: function() {
    return this.text_;
  },

  /**
   * Append some text. Usually only for text elements.
   * @param {string} text
   * @return {!glift.svg.SvgObj} This object.
   */
  setText: function(text) {
    this.text_ = text;
    return this;
  },

  /** @return {string} The type of this object. */
  type: function() {
    return this.type_;
  },

  /**
   * Get child from an Id.
   * @return {!glift.svg.SvgObj} The child obj.
   */
  child: function(id) {
    return this.idMap_[id];
  },

  /**
   * Remove child, based on id.
   * @return {!glift.svg.SvgObj} This object.
   */
  rmChild: function(id) {
    delete this.idMap_[id];
    return this;
  },

  /**
   * Get all the Children.
   * @return {!Array<!glift.svg.SvgObj>}
   */
  children: function() {
    return this.children_;
  },

  /**
   * Empty out all the children.
   * @return {!glift.svg.SvgObj} this object.
   */
  emptyChildren: function() {
    this.children_ = [];
    return this;
  },

  /**
   * Add an already existing child.
   * @param {!glift.svg.SvgObj} obj Object to add.
   * @return {!glift.svg.SvgObj} This object.
   */
  append: function(obj) {
    if (obj.id() !== undefined) {
      this.idMap_[obj.id()] = obj;
    }
    this.children_.push(obj);
    return this;
  },

  /**
   * Add a new svg object child.
   * @param {string} type
   * @param {!Object<string>} attrObj
   * @return {!glift.svg.SvgObj} This object.
   */
  appendNew: function(type, attrObj) {
    var obj = glift.svg.createObj(type, attrObj);
    return this.append(obj);
  },

  /**
   * Create a copy of the object without any children
   * @return {!glift.svg.SvgObj} The new object.
   */
  copyNoChildren: function() {
    var newAttr = {};
    for (var key in this.attrMap_) {
      newAttr[key] = this.attrMap_[key];
    }
    return glift.svg.createObj(this.type_, newAttr);
  }
};

/**
 * @preserve GPub: A Go publishing platform, built on Glift
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * @version 0.3.23
 * --------------------------------------
 */
(function(w) {
var g;
if (typeof gpub !== 'undefined') {
  g = gpub;
} else if (typeof w.gpub !== 'undefined') {
  g = w.gpub
} else {
  g = {};
}

if (w) {
  // expose Glift as a global.
  w.gpub = g;
}
})(window);

goog.provide('gpub.api');
goog.provide('gpub.create');
goog.provide('gpub.init');

/**
 * Api Namespace. Some of the methods are attached at the top level for clarity.
 * @const
 */
gpub.api = {};

/**
 * Intended usage:
 *    gpub.init({...options...})
 *      .createSpec()
 *      .processSpec()
 *      .createDiagrams()
 *      .createBook()
 *
 * Equivalent to:
 *    gpub.create({...})
 *
 * @param {!gpub.Options} options to process
 * @return {!gpub.Api} A fluent API wrapper.
 * @export
 */
gpub.init = function(options) {
  if (!glift) {
    throw new Error('GPub depends on Glift, but Glift was not defined');
  }
  return new gpub.Api(new gpub.Options(options));
};

/**
 * Create a 'book' output from SGFs.
 *
 * @param {!gpub.Options} options
 * @return {string}
 * @export
 */
gpub.create = function(options) {
  gpub.init(options)
      .createSpec()
      .processSpec()
      .renderDiagrams();

  // TODO(kashomon): Finish phase 4.
  return 'foo';
};

goog.provide('gpub.api.BookOptions');
goog.provide('gpub.api.Frontmatter');

/**
 * @param {!gpub.api.BookOptions=} opt_options
 *
 * @constructor @struct @final
 */
gpub.api.BookOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * The format of the 'book' output that is produced by GPub.
   * See gpub.outputFormat.
   *
   * @const {gpub.OutputFormat}
   */
  this.outputFormat = o.outputFormat || gpub.OutputFormat.LATEX;

  /**
   * The size of the page. Element of gpub.book.page.type.
   *
   * @const {gpub.PageSize}
   */
  this.pageSize = o.pageSize || gpub.PageSize.LETTER;

  /**
   * Size of the intersections in the diagrams. If no units are specified, the
   * number is assumed to be in pt. Can also be specified in 'in', 'mm', or
   * 'em'.
   *
   * @const {string}
   */
  this.goIntersectionSize = o.goIntersectionSize || '12pt';

  /**
   * Override the default template.
   * A false-y template will result in using the default template.
   *
   * @const {?string}
   */
  this.template = o.template || null;

  /**
   * Any additional setup that needs to be done in the header. I.e.,
   * for diagram packages. Note, this is rather LaTeX specific, so should,
   * perhaps, be moved somewhere else.
   *
   * @type {string}
   */
  // TODO(kashomon): Get rid of this.
  this.init = o.init || '';

  /** @type {?string} */
  this.title = o.title || 'My Book';

  /** @type {?string} */
  this.subtitle = o.subtitle || null;

  /** @type {?string} */
  this.publisher = o.publisher || 'GPub';

  /** @type {!Array<string>} */
  this.authors = o.authors || [];

  /** @type {?string} */
  this.year = o.year || null;

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
  this.frontmatter = new gpub.api.Frontmatter(o.frontmatter);

  // TODO(kashomon): Give a real constructor to the appendices.
  var app = o.appendices || {};

  this.appendices = {};

  /** @type {?string} */
  this.appendices.glossary = app.glossary || null;
};

/**
 * @param {!gpub.api.Frontmatter} options
 *
 * @constructor @struct @final
 */
gpub.api.Frontmatter = function(options) {
  var o = options || {};

  // epigraph: null, // AKA Quote Page

  /** @type {?string} */
  this.foreword = o.foreword || null;  // Author or unrelated person

  /** @type {?string} */
  this.preface = o.foreword || null; // Author

  /** @type {?string} */
  this.acknowledgements = o.acknowledgements || null;

  /** @type {?string} */
  this.introduction = o.introduction || null;

  /**
   * Generate the Table of Contents or just 'Contents'.
   * @type {boolean}
   */
  this.generateToc = !!o.generateToc;

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
   * @type {!Object}
   */
  // TODO(kashomon): Make a proper type.
  this.copyright = o.copyright || null;

  /////////////////////
  // Special Options //
  /////////////////////

  /**
   * Whether or not to generate PDF/X-1a compatibile PDFs. Note: this only
   * applies to output formats that generate PDFs (latex).
   *
   * Most printers will require this option to be set.
   *
   * @const {boolean}
   */
  this.pdfx1a = o.pdfx1a || false;

  /**
   * An option only for PDF/X-1a. For this spceification, you must specify a
   * color profile file (e.g., ISOcoated_v2_300_eci.icc).
   *
   * @const {?string}
   */
  this.colorProfileFilePath = o.colorProfileFilePath || null;
};

goog.provide('gpub.api.DiagramOptions');

/**
 * Options for diagram generation
 *
 * @param {!gpub.api.DiagramOptions=} opt_options
 *
 * @constructor @struct @final
 */
gpub.api.DiagramOptions = function(opt_options) {
  var o = opt_options || {};

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
   *  - SVG
   *
   * @const {gpub.diagrams.Type}
   */
  this.diagramType = o.diagramType || gpub.diagrams.Type.GNOS;

  /**
   * Optional board region specifying cropping. By default, Gpub does cropping, but
   * this can be overridden with gpub.enums.boardRegions.ALL;
   *
   * @const {glift.enums.boardRegions|undefined}
   */
  this.boardRegion = o.boardRegion || glift.enums.boardRegions.AUTO;

  /**
   * Skip the first N diagrams. Allows users to generate parts of a book. 0 or
   * undefined will generate cause the generator not to skip diagrams.
   *
   * @const {number|undefined}
   */
  this.skipDiagrams = o.skipDiagrams || undefined;

  /**
   * Maximum diagrams generated -- allows users to specify a section of the
   * book. 0 or undefined undindicate that all subsequent diagrams are generated.
   *
   * @const {number|undefined}
   */
  this.maxDiagrams = o.maxDiagrams || undefined;

  /**
   * Whether or not to perform box-cropping on variations.
   * @const {boolean}
   */
  this.autoBoxCropOnVariation = o.autoBoxCropOnVariation || false;

  /**
   * List of autocropping preferences. Each element in the array should be a
   * member of glift.enums.boardRegions.
   *
   * Note: this may change if we ever support minimal/close-cropping.
   *
   * @const {!Array<glift.enums.boardRegions>}
   */
  this.regionRestrictions = o.regionRestrictions || undefined;

  /**
   * What size should the intersections be? Defaults to undefined since
   * different diagram types may have a different idea of what a good default
   * is, and if it's undefined, the particular diagram type will pick the
   * default.
   *
   * Note: If this is a number, we assume the size is in pt for .tex diagrams
   * and pixels for rendered diagrams. Otherwise units are required: 12pt,
   * 12mm, 1.2in, etc.
   * @const {number|string|undefined}
   */
  this.goIntersectionSize = o.goIntersectionSize || undefined;

  /**
   * Option-overrides for specific diagram types.
   * @const {!Object<gpub.diagrams.Type, !Object>}
   */
  this.typeOptions = o.typeOptions || {};
};

/**
 * The format for gpub output.
 *
 * @enum {string}
 */
gpub.OutputFormat = {
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
 * Enum-like type enumerating the supported page sizes. The sizes here are meant
 * to represent sizes that professional printers will realistically print at.
 *
 * TODO(kashomon): IIt's possible that the height/width should be specified as
 * two separat params, but this helps prevents errors.
 *
 * @enum {string}
 */
gpub.PageSize = {
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
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE',
};

goog.provide('gpub.Api');

goog.scope(function() {

/**
 * A GPub API wrapper. This is a container that has methods for processing
 * specs, producing diagrams, and eventually, rendering books.
 *
 * It is shallowly immutable: Each API transformation returns a new API
 * reference. However, no care is taken to ensure deep immutability of the
 * underlying objects.
 *
 * Usage:
 *
 * gpub.init({options})
 *
 * @param {!gpub.Options} options
 * @struct @constructor @final
 */
gpub.Api = function(options) {
  /** @private @const {!gpub.Options} */
  this.opt_ = options;
  /** @private {?gpub.spec.Spec} */
  this.spec_ = null;
  /** @private {?gpub.diagrams.Rendered} */
  this.diagrams_ = null;
  /** @private {!gpub.util.MoveTreeCache|undefined} */
  this.cache_ = undefined;
};

gpub.Api.prototype = {

  /**
   * @return {?gpub.spec.Spec} The spec, if it exists.
   * @export
   */
  spec: function() { return this.spec_; },

  /**
   * @return {?gpub.diagrams.Rendered} The rendered diagrams, if they exist.
   * @export
   */
  diagrams: function() { return this.diagrams_; },

  /**
   * @return {string} Return the serialized JSON spec or empty string. 
   * @export
   */
  jsonSpec: function() { return this.spec_ ? this.spec_.serializeJson() : '' },

  /**
   * Create an initial GPub specification. This can either be created from
   * scratch or from an existing spec (in either it's object or JSON form).
   *
   * @param {(!gpub.spec.Spec|string)=} opt_spec Optionally pass in a spec, in
   *    either a serialized JSON form, or in the object form.
   * @return {!gpub.Api} A new reference updated with a new cache and spec.
   * @export
   */
  createSpec: function(opt_spec) {
    var ref = this.newRef_();
    if (opt_spec) {
      // The spec option has been passed in. So instead of creating a spec from
      // scratch, parse the one that's passed in.
      if (typeof opt_spec === 'string') {
        // Assume it's JSON.
        var jsonspec = /** @type {string} */ (opt_spec);
        ref.spec_ = gpub.spec.Spec.deserializeJson(jsonspec);
      } else if (typeof opt_spec === 'object') {
        // Assume the types are correct and create a copy.
        var objspec = /** @type {!gpub.spec.Spec} */ (opt_spec);
        ref.spec_ = new gpub.spec.Spec(objspec);
      } else {
        throw new Error('Unknown type for spec options. ' +
            'Must be serialized JSON or a gpub.spce.Spec object.');
      }
    } else {
      // No spec option has been passed in; Process the incoming SGFS.
      var sgfs = ref.opt_.sgfs;
      if (!sgfs || glift.util.typeOf(sgfs) !== 'array' || sgfs.length === 0) {
        throw new Error('SGF array must be defined and non-empty ' +
            'before spec creation');
      }
      ref.cache_ = new gpub.util.MoveTreeCache();
      ref.spec_ = gpub.spec.create(ref.opt_, ref.cache_);
    }
    return ref;
  },

  /**
   * Process a GPub specification, generating new positions if necessary.
   * @param {(!gpub.api.SpecOptions)=} opt_o Optional Spec options.
   * @return {!gpub.Api} A new reference with an updated spec.
   * @export
   */
  processSpec: function(opt_o) {
    var ref = this.newRef_();
    var phase = 'processing the spec';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        specOptions: new gpub.api.SpecOptions(opt_o)
      });
    }
    ref.spec_ = gpub.spec.process(spec, cache);
    return ref;
  },

  /**
   * Render all the diagrams! Render all the diagrams and store them in a
   * possibly giant rendered JS Object. If you have many diagrams that you're
   * going to write to disk anyway, consider using `renderDiagramsStream`.
   *
   * @param {(!gpub.api.DiagramOptions)=} opt_o Optional diagram options.
   * @return {!gpub.Api} A new reference with rendered diagrams.
   * @export
   */
  renderDiagrams: function(opt_o) {
    var ref = this.newRef_();
    var phase = 'diagram rendering';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      ref.spec_ = spec;
    }
    ref.diagrams_ = gpub.diagrams.render(spec, cache);
    return ref;
  },

  /**
   * Stream the rendered diagrams to the user-provided function. The intention
   * is that the user will store these diagrams to disk or do some other
   * processing. The rendered diagrams object is still produced, because it
   * still contains useful metadata, but it will not contain the rendered
   * bytes.
   *
   * @param {!gpub.diagrams.DiagramCallback} fn Void-returning processing
   * function.
   * @param {!gpub.api.DiagramOptions=} opt_o Optional options
   * @return {!gpub.Api} A new reference with rendered diagram metadata
   * @export
   */
  renderDiagramsStream: function(fn, opt_o) {
    var ref = this.newRef_();
    var phase = 'streaming diagram rendering';
    var spec = ref.mustGetSpec_(phase);
    var cache = ref.getCacheOrInit_(phase);
    if (opt_o) {
      spec = gpub.spec.Spec.merge(spec, {
        diagramOptions: new gpub.api.DiagramOptions(opt_o)
      });
      ref.spec_ = spec;
    }
    ref.diagrams_ = gpub.diagrams.renderStream(spec, cache, fn)
    return ref;
  },

  /**
   * Returns the book maker helper. Both the spec and the rendered diagrams
   * must have been created before the book generator is created.
   * @return
   */
  bookMaker: function() {
    var phase = 'creating the book maker helper';
    var spec = this.mustGetSpec_(phase);
    var diagrams = this.mustGetRendererd_(phase);
    return new gpub.book.BookMaker(spec.rootGrouping, diagrams);
  },

  /////////////////////////////////
  //////// Private helpers ////////
  /////////////////////////////////
  /**
   * Create a new instance of the API so that we don't reuse references. This
   * allows us to return new references upon successive .transformations.
   * @return {!gpub.Api}
   * @private
   */
  newRef_: function() {
    var ref = new gpub.Api(this.opt_);
    ref.spec_ = this.spec_;
    ref.diagrams_ = this.diagrams_;
    ref.cache_ = this.cache_;
    return ref
  },

  /**
   *  Get an existing cache or create a new one from the spec. Throws an error
   *  if the spec is not defined.
   *  @param {string} phase During which this occurred (for error messaging)..
   *  @return {!gpub.util.MoveTreeCache} The cache
   *  @private
   */
  getCacheOrInit_: function(phase) {
    var spec = this.mustGetSpec_(phase);
    if (!this.cache_) {
      // If the user passes in the spec instead of starting from the beginning,
      // it's possible that the user has skipped diagram creation.
      this.cache_ = new gpub.util.MoveTreeCache(spec.sgfMapping);
    }
    return this.cache_;
  },

  /**
   * Get the spec or throw an error.
   * @param {string} phase
   * @return {!gpub.spec.Spec} The spec, which must be defined
   * @private
   */
  mustGetSpec_: function(phase) {
    var spec = this.spec();
    if (!spec) {
      throw new Error('Spec must be defined before ' + phase + '.');
    }
    return spec;
  },

  /**
   * Get the rendered diagram wrapper or throw an error.
   * @param {string} phase
   * @return {!gpub.diagrams.Rendered} The rendered diagram wrapper, which must
   *    be defined
   * @private
   */
  mustGetRendererd_: function(phase) {
    var dia = this.diagrams();
    if (!dia) {
      throw new Error('Rendered must be defined before ' + phase + '.');
    }
    return dia;
  },
};

});  // goog.scope;

goog.provide('gpub.Options');

/**
 * Default options for GPub API. Recall that GPub has 4 tasks:
 *
 * - Create a spec (a serialized book prototype).
 * - Flatten the spec into an example spec.
 * - Create diagrams
 * - Assemble the diagrams into a book.
 *
 * These are the set of options for all 4 phases.
 *
 * @param {!gpub.Options=} opt_options
 *
 * @constructor @struct @final
 */
gpub.Options = function(opt_options) {
  var o = opt_options || {};

  /**
   * Array of SGF (strings). No default is specified here: Must be explicitly
   * passed in every time.
   *
   * @const {!Array<string>}
   */
  this.sgfs = o.sgfs || [];

  /**
   * Optianal array of IDs corresponding to the SGFs. If supplied, should be
   * the same length as the sgfs. If not specified, artificial IDs will be
   * specified.
   * @const {!Array<string>|undefined}
   */
  this.ids = o.ids || undefined;

  if (this.ids) {
    if (this.ids.length !== this.sgfs.length) {
      throw new Error('If IDs array is provided, ' +
          'it must be the same length as the SGFs array');
    } else {
      // Ensure uniqueness.
      var tmpMap = {};
      for (var i = 0; i < this.ids.length; i++) {
        var id = this.ids[i];
        if (tmpMap[this.ids[i]]) {
          throw new Error('IDs must be unique. Found duplicate: ' + id);
        }
        tmpMap[id] = true;
      }
    }
  }

  /**
   * Options specific to spec creation (Phases 1 and 2)
   * @const {!gpub.api.SpecOptions}
   */
  this.specOptions = new gpub.api.SpecOptions(o.specOptions);

  /**
   * Options specific to Diagrams (Phase 3)
   * @const {!gpub.api.DiagramOptions}
   */
  this.diagramOptions = new gpub.api.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.api.BookOptions}
   */
  this.bookOptions = new gpub.api.BookOptions(o.bookOptions);

  /**
   * Whether or not debug information should be displayed (initia
   * @const {boolean}
   */
  this.debug = !!o.debug || false;
};

/**
 * Merge the top-level entries of two options objects and return a new copy.
 * @param {!Object} oldobj
 * @param {!Object} newobj
 * @return {!gpub.Options} a new option sobject.
 */
gpub.Options.merge = function(oldobj, newobj) {
  for (var key in newobj) {
    oldobj[key] = newobj[key];
  }
  return new gpub.Options(/** @type {!gpub.Options} */ (oldobj));
};

goog.provide('gpub.api.SpecOptions');

goog.scope(function() {

/** @type {!glift.rules.ProblemConditions} */
var defaultProbCon = {};
defaultProbCon[glift.rules.prop.GB] = [];
defaultProbCon[glift.rules.prop.C] = ['Correct', 'is correct'];

/**
 * The user can pass in defaults to apply to the SGFs during spec
 * creation.
 *
 * @param {!gpub.api.SpecOptions=} opt_options
 *
 * @constructor @final @struct
 */
gpub.api.SpecOptions = function(opt_options) {
  var o = opt_options || {};

  /**
   * Set the default position type for all position generation during spec
   * processing.
   * @const {!gpub.spec.PositionType}
   */
  this.positionType = o.positionType ||
      gpub.spec.PositionType.GAME_COMMENTARY;

  /**
   * How are IDs generated?
   * @const {!gpub.spec.IdGenType}
   */
  this.idGenType = o.idGenType || gpub.spec.IdGenType.PATH;

  /**
   * Problem conditions indicate how to determine whether a particular
   * variation is considered 'correct' or 'incorrect'. In brief, this relies on
   * looking for simple matches in the underlying SGF.
   *
   * Some Examples:
   *    Correct if there is a GB property or the words 'Correct' or 'is correct' in
   *    the comment. This is the default.
   *    { GB: [], C: ['Correct', 'is correct'] }
   *
   *    Nothing is correct
   *    {}
   *
   *    Correct as long as there is a comment tag.
   *    { C: [] }
   *
   *    Correct as long as there is a black stone-move (a strange condition).
   *    { B: [] }
   * @const {!glift.rules.ProblemConditions}
   */
  this.problemConditions = o.problemConditions || defaultProbCon;
};

});

goog.provide('gpub.spec')

/**
 * Methods for processing and creating Glift specifications.
 */
gpub.spec = {
  /**
   * Takes a list of SGFs and produces a Gpub spec. This first pass does a
   * brain-dead transformation based on the position defaults.
   *
   * Importantly, this creates a serializeable book object that can be store for
   * later processing.
   *
   * @param {!gpub.Options} options
   * @param {!gpub.util.MoveTreeCache=} opt_cache
   * @return {!gpub.spec.Spec} Finished spec.
   */
  create: function(options, opt_cache) {
    var sgfs = options.sgfs;
    var cache = opt_cache || new gpub.util.MoveTreeCache(); // for testing convenience.
    var specOptions = options.specOptions;
    var defaultPositionType = specOptions.positionType;

    var spec = new gpub.spec.Spec({
      specOptions: options.specOptions,
      diagramOptions: options.diagramOptions,
      bookOptions: options.bookOptions
    });

    var rootGrouping = spec.rootGrouping;
    rootGrouping.positionType = defaultPositionType;
    var optIds = options.ids;

    for (var i = 0; i < sgfs.length; i++) {
      var sgfStr = sgfs[i];
      if (!sgfStr) {
        throw new Error('No SGF String defined for index: ' + i);
      }
      var mt = glift.parse.fromString(sgfStr);

      var alias = 'sgf-' + (i+1);
      if (optIds) {
        alias = optIds[i];
      }

      cache.sgfMap[alias] = sgfStr;
      cache.mtCache[alias] = mt;

      // Ensure the sgf mapping contains the alias-to-sgf mapping.
      if (!spec.sgfMapping[alias]) {
        spec.sgfMapping[alias] = sgfStr;
      }

      // At this point, there is a 1x1 mapping between passed-in SGF string and
      // position. That need not be true generally, but it is true here.
      var position = new gpub.spec.Position({
        alias: alias,
        id: alias
      })

      rootGrouping.positions.push(position);
    }
    return spec;
  },

  /**
   * Process a spec by transforming the positions positions. All  SGFS are
   * grouped by type into new Grouping objects, if the types are not uniform,
   * and prepended to the sub-groupings list.
   *
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @return {!gpub.spec.Spec} the transformed spec.
   */
  process: function(spec, cache) {
    return new gpub.spec.Processor(spec, cache).process();
  },
};

goog.provide('gpub.spec.GameCommentary');

/**
 * @param {!glift.rules.MoveTree} mt The movetree for the position.
 * @param {!gpub.spec.Position} position The position used for spec generation.
 * @param {!gpub.spec.IdGen} idGen
 * @return {!gpub.spec.Generated} processed positions.
 * @package
 */
gpub.spec.processGameCommentary = function(mt, position, idGen) {
  // TODO(kashomon): This should be refactored to be much simpler (more like the
  // problem-code).
  var varPathBuffer = [];
  var node = mt.node();
  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;
  var alias = position.alias;

  var gen = new gpub.spec.Generated({
    id: position.id
  });
  var mainlineLbl = 'MAINLINE';
  var variationLbl = 'VARIATION';
  gen.labels[mainlineLbl] = [];
  gen.labels[variationLbl] = [];

  while (node) {
    if (!mt.properties().getComment() && node.numChildren() > 0) {
      // Ignore positions don't have comments and aren't terminal.
      // We ignore the current position, but if there are variations, we note
      // them so we can process them after we record the next comment.
      node = mt.node();
      varPathBuffer = varPathBuffer.concat(gpub.spec.variationPaths(mt));
    } else {
      // This node has a comment or is terminal.  Process this node and all
      // the variations.
      var pathSpec = glift.rules.treepath.findNextMovesPath(mt);
      var ip = ipString(pathSpec.treepath);
      var frag = fragString(pathSpec.nextMoves);
      var pos = new gpub.spec.Position({
          id: idGen.next(alias, ip, frag),
          alias: alias,
          initialPosition: ip,
          nextMovesPath: frag,
          labels: [mainlineLbl]
      })
      gen.positions.push(pos);
      gen.labels[mainlineLbl].push(pos.id);

      varPathBuffer = varPathBuffer.concat(
          gpub.spec.variationPaths(mt));
      for (var i = 0; i < varPathBuffer.length; i++) {
        var path = varPathBuffer[i];
        var mtz = mt.getTreeFromRoot(path);
        var varPathSpec = glift.rules.treepath.findNextMovesPath(mtz);
        var ipz = ipString(varPathSpec.treepath);
        var fragz = fragString(varPathSpec.nextMoves);
        var varPos = new gpub.spec.Position({
            id: idGen.next(alias, ipz, fragz),
            alias: alias,
            initialPosition: ipz,
            nextMovesPath: fragz,
            labels: [variationLbl],
        });
        gen.positions.push(varPos);
        gen.labels[variationLbl].push(varPos.id);
      }
      varPathBuffer = [];
    }
    // Travel down along the mainline. Advance both the node and the movetree
    // itself. It's worth noting that getChild() returns null if there are no
    // children, thus terminating flow.
    node = node.getChild(0);
    mt.moveDown();
  }

  return gen;
};

/**
 * Get the next-move treepaths for a particular root node.
 * path.
 *
 * @param {!glift.rules.MoveTree} mt
 * @return {!Array<!glift.rules.Treepath>}
 */
gpub.spec.variationPaths = function(mt) {
  mt = mt.newTreeRef();
  var out = [];
  var node = mt.node();
  if (!node.getParent()) {
    // There shouldn't variations an the root, so just return.
    return out;
  }

  mt.moveUp();

  // Look at all non-mainline variations
  for (var i = 1; i < mt.node().numChildren(); i++) {
    var mtz = mt.newTreeRef();
    mtz.moveDown(i);
    mtz.recurse(function(nmtz) {
      if (!nmtz.properties().getComment()) {
        return; // Must have a comment to return the variation.
      }
      out.push(nmtz.treepathToHere());
    });
  }

  return out;
};

goog.provide('gpub.spec.Generated');
goog.provide('gpub.spec.GeneratedTypedef');

/**
 * @typedef {{
 *  id: (string|undefined),
 *  positions: (!Array<!gpub.spec.Position>|undefined),
 *  positionType: (gpub.spec.PositionType|undefined),
 *  labelMap: (!Object<string, !Array<string>>|undefined),
 * }}
 */
gpub.spec.GeneratedTypedef;

/**
 * Generated positions.
 *
 * @param {(!gpub.spec.Generated|gpub.spec.GeneratedTypedef)=} opt_gen
 *
 * @constructor @final @struct
 */
gpub.spec.Generated = function(opt_gen) {
  var o = opt_gen || {};

  if (!o.id) {
    throw new Error('id was not defined, but must be defined');
  }

  /**
   * ID of the Position that generated this generated obj.
   * @const {string}
   */
  this.id = o.id;

  /**
   * Default position type to apply to the generated positions. Generally this
   * will just be EXAMPLE
   * @const {gpub.spec.PositionType}
   */
  this.positionType = o.positionType || gpub.spec.PositionType.EXAMPLE;

  /**
   * Generated positions.
   * @type {!Array<!gpub.spec.Position>}
   */
  this.positions = [];
  if (o.positions) { // Deep copy
    for (var i = 0; i < o.positions.length; i++) {
      this.positions.push(new gpub.spec.Position(o.positions[i]));
    }
  }

  /**
   * Map from arbitrary labels to position ID. This is motivated by Problem
   * positions which generate:
   * - A starting position.
   * - Correct variations.
   * - Incorrect variations.
   * This is not guaranteed to be populated by anything in particular, but may
   * be populated for convenience.
   * @type {!Object<string, !Array<string>>}
   */
  this.labels = {};
  if (o.labels) { // Deep copy
    for (var k in o.labels) {
      // if o.labels[k] is not an array, thats a programming error and should explode.
      this.labels[k] = o.labels[k].slice();
    }
  }
};

goog.provide('gpub.spec.Grouping');

/**
 * A grouping of Positions. Each grouping can have sub-groupings, and so on. The
 * structure is required to be tree-shaped -- no cycles can occur.
 *
 * Also note: Position objects are only allowed to occur on terminal nodes.
 *
 * @param {!gpub.spec.Grouping=} opt_group
 *
 * @constructor @final @struct
 */
gpub.spec.Grouping = function(opt_group) {
  var o = opt_group || {};

  /**
   * Description of this section.
   * @type {string|undefined}
   */
  this.description = o.description || undefined;

  /**
   * It can make sense to specify the Position Type for a specific grouping. Unless
   * re-specified by children groupings, the type should apply to the
   * descendents. It's possible to have a heterogenous collection af Positions in a
   * grouping, so by default this is not set.
   *
   * @type {gpub.spec.PositionType|undefined}
   */
  this.positionType = o.positionType || undefined;

  /**
   * Position Objects associated directly with this grouping.
   * @type {!Array<!gpub.spec.Position>}
   */
  this.positions = [];
  // TODO(kashomon): Make a helper for these copy functions. It's getting to be
  // a little much and it's error-prone.
  if (o.positions) { // Deep copy
    for (var i = 0; i < o.positions.length; i++) {
      this.positions.push(new gpub.spec.Position(o.positions[i]));
    }
  }

  /**
   * Positions generated from a position in the position array. A map from the
   * ID of the original position to the generated positions.
   * @type {!Object<string, !gpub.spec.Generated>}
   */
  this.generated = {};
  if (o.generated) { // Deep copy
    for (var k in o.generated) {
      this.generated[k] = new gpub.spec.Generated(o.generated[k])
    }
  }

  /**
   * Groupings that are children of his grouping.
   * @type {!Array<!gpub.spec.Grouping>}
   */
  this.groupings = []; // Deep copy.
  if (o.groupings) {
    for (var i = 0; i < o.groupings.length; i++) {
      this.groupings.push(new gpub.spec.Grouping(o.groupings[i]));
    }
  }
};


goog.provide('gpub.spec.IdGen');
goog.provide('gpub.spec.IdGenType');

/**
 * @enum {string}
 */
gpub.spec.IdGenType = {
  /**
   * Keep a counter for the relevant SGF and append that to the alias.
   */
  SEQUENTIAL: 'SEQUENTIAL',

  /**
   * Convert the initial path and next moves into an ID. The ID is meant to be
   * safe for file names, so the path syntax is converted as follows:
   * 0:5->1-5
   * 1.0->1_0
   * 5+->5p
   */
  PATH: 'PATH',
};

/**
 * Simple id generator. As currently designed, this only works for one game
 * alias.
 *
 * @param {gpub.spec.IdGenType} idType
 *
 * @constructor @struct @final
 * @package
 */
gpub.spec.IdGen = function(idType) {
  /**
   * @private @const {gpub.spec.IdGenType}
   */
  this.idType_ = idType;

  /**
   * Set verifying uniqueness of IDs.
   * @private @const {!Object<string, boolean>}
   */
  this.idSet_ = {};

  /**
   * Map from alias to counter. Each alias gets its own ID counter so that IDs
   * are sequential for a particular raw SGF. This applies only to the
   * SEQUENTIAL IdGenType.
   *
   * @private @const {!Object<string, number>}
   */
  this.counterMap_ = {};
};

gpub.spec.IdGen.prototype = {
  /**
   * Gets a new Position ID for a generateda position.
   *
   * @param {string} alias
   * @param {string} initPath
   * @param {string} nextMovesPath
   * @return {string} A new ID, with a
   */
  next: function(alias, initPath, nextMovesPath) {
    var id = '';
    if (this.idType_ == gpub.spec.IdGenType.PATH) {
      id = this.getPathId_(alias, initPath, nextMovesPath);
    } else {
      // Default to sequental
      id = this.getSequentialId_(alias);
    }
    if (this.idSet_[id]) {
      throw new Error('Duplicate ID Detected: ' + id);
    }
    this.idSet_[id] = true;
    return id;
  },

  /**
   * Gets a path-ID with the following format:
   *
   * alias__initialpath__nextmoves
   *
   * Where the path string has been transformed as follows:
   * 0:5->1-5
   * 1.0->1_0
   * 5+->5p
   *
   * @param {string} alias
   * @param {string} initPath
   * @param {string} nextMovesPath
   */
  getPathId_: function(alias, initPath, nextMovesPath) {
    var repl = function(p) {
      return p.replace(/:/g, '-')
        .replace(/\./g, '_')
        .replace(/\+/g, 'p');
    };
    var id = alias + '__' + repl(initPath);
    if (nextMovesPath) {
      id += '__' + repl(nextMovesPath);
    }
    return id;
  },

  /**
   * Gets a sequential ID.
   * @param {string} alias
   * @return {string} new ID
   * @private
   */
  getSequentialId_: function(alias) {
    if (!this.counterMap_[alias]) {
      this.counterMap_[alias] = 0;
    }
    var counter = this.counterMap_[alias];
    this.counterMap_[alias]++;
    return alias + '-' + counter;
  },
};

goog.provide('gpub.spec.Position');
goog.provide('gpub.spec.PositionTypedef');
goog.provide('gpub.spec.PositionType');

/**
 * @typedef {{
 *  alias: (string|undefined),
 *  id: (string|undefined),
 *  initialPosition: (string|undefined),
 *  nextMovesPath: (string|undefined),
 *  positionType: (gpub.spec.PositionType|undefined)
 * }}
 */
gpub.spec.PositionTypedef;

/**
 * A single Position definition. This is overloaded and used for both individual Positions
 * and for Position defaults.
 *
 * @param {(!gpub.spec.Position|!gpub.spec.PositionTypedef)=} opt_position
 *
 * @constructor @struct @final
 */
gpub.spec.Position = function(opt_position) {
  var o = opt_position || {};

  if (!o.id) {
    throw new Error('Positions are required to have IDs. Was: ' + o.id);
  }

  /**
   * ID of this particular position. Required and must be unique
   * @const {string}
   */
  this.id = o.id;

  if (!o.alias) {
    throw new Error('SGF Alias must be defined')
  }

  /**
   * Alias of the SGF in the SGF mapping. Required and must be unique.
   * @const {string}
   */
  this.alias = o.alias;

  /**
   * An initial position, specified as a stringified Glift treepath.
   * @const {string|undefined}
   */
  this.initialPosition = o.initialPosition || undefined;

  /**
   * Optional next moves path showing a sequence of moves, specified as a Glift
   * treepath fragment.
   * @const {string|undefined}
   */
  this.nextMovesPath = o.nextMovesPath || undefined;

  /**
   * Optional positiontype
   * @const {gpub.spec.PositionType|undefined}
   */
  this.positionType = o.positionType || undefined;

  /**
   * Optional array of labels. This is usually created during specProcessing,
   * if at all.
   * @const {!Array<string>|undefined}
   */
  this.labels = o.labels ? o.labels.slice() : undefined;
};

gpub.spec.Position.prototype = {
  /**
   * Validate the spec and throw an error.
   * @return {!gpub.spec.Position} this
   */
  validate:  function() {
    if (this.alias == undefined) {
      throw new Error('No SGF Alias');
    }
    if (this.initialPosition == undefined) {
      throw new Error('No Initial Position');
    }

    if (this.positionType !== gpub.spec.PositionType.EXAMPLE &&
        this.nextMovesPath != undefined) {
      throw new Error('Next moves path is only valid for EXAMPLE types');
    }
    return this;
  }
};

/**
 * The type or interpretation of the Position.
 *
 * @enum {string}
 */
gpub.spec.PositionType = {
  /**
   * A flat diagram without any special meaning. All other types can be
   * converted into one or more EXAMPLE types. EXAMPLE types are ultimately the
   * types rendered by Gpub.
   */
  EXAMPLE: 'EXAMPLE',

  /** A mainline path plus variations. */
  GAME_COMMENTARY: 'GAME_COMMENTARY',

  /**
   * A problem position. In problems, there isn't usually a concept of a mainline
   * vairation. Each variation indicates either a correct or incorrect solution.
   */
  PROBLEM: 'PROBLEM',

  /**
   * A set of variations for a position. This type is rare and is a combination
   * of GAME_COMMENTARY and PROBLEM. This type is usually used for Joseki
   * diagrams where there's no concept of mainline variation nor of right or
   * wrong -- there's simple a base position and variations on that position.
   */
  POSITION_VARIATIONS: 'POSITION_VARIATIONS',
};


/**
 * Process a problem position, creating a generated return object.
 * @param {!glift.rules.MoveTree} mt
 * @param {!gpub.spec.Position} position
 * @param {!gpub.spec.IdGen} idGen
 * @param {!gpub.api.SpecOptions} opt
 * @return {!gpub.spec.Generated} return the generated position.
 * @package
 */
gpub.spec.processProblems = function(mt, position, idGen, opt) {
  var outPositions = [];
  var conditions = opt.problemConditions;
  var alias = position.alias;
  mt = mt.newTreeRef();

  var ipString = glift.rules.treepath.toInitPathString;
  var fragString = glift.rules.treepath.toFragmentString;

  var gen = new gpub.spec.Generated({
    id: position.id
  });

  var initPos = mt.treepathToHere();

  /**
   * @param {!glift.rules.MoveTree} movetree
   * @param {!glift.rules.Treepath} prevPos Path to the previous position
   *    recorded.
   * @param {!glift.rules.Treepath} sincePrevPos Path since the previous
   *    position recorded.
   * @param {!glift.enums.problemResults} correctness whether position is
   *    considered 'correct'.
   *
   * Note: The full path to the current position should be equal to
   * prevPos.concat(sincePrevPos).
   */
  var pathRecurse = function(movetree, prevPos, sincePrevPos, correctness) {
    var newCor = glift.rules.problems.positionCorrectness(movetree, conditions);
    // Record positions when
    // - There are comments
    // - We're at the end of a branch.
    // - We're at the root
    if (movetree.properties().getOneValue(glift.rules.prop.C) ||
        movetree.node().numChildren() === 0 ||
        (prevPos.length === initPos.length && sincePrevPos.length === 0)) {
      var label = newCor;
      if (prevPos.length === 0 && sincePrevPos.length === 0) {
        label = 'PROBLEM_ROOT';
      }
      if (!gen.labels[label]) {
        gen.labels[label] = [];
      }
      var ip = ipString(prevPos);
      var frag = fragString(sincePrevPos);
      var pos = new gpub.spec.Position({
        id: idGen.next(alias, ip, frag),
        alias: alias,
        initialPosition: ip,
        nextMovesPath: frag,
        labels: [label],
      });
      gen.labels[label].push(pos.id);
      outPositions.push(pos);
      prevPos = prevPos.concat(sincePrevPos);
      sincePrevPos = [];
    }
    for (var i = 0; i < movetree.node().numChildren(); i++) {
      var nmt = movetree.newTreeRef();
      var pp = prevPos.slice();
      var spp = sincePrevPos.slice();
      spp.push(i);
      nmt.moveDown(i);
      // Note: there's no indicator when to break here. In other words, we
      // assume that the whole subtree is part of the problem, which might not
      // be true, but either we make this assumption or we introduce arbitrary
      // constraints.
      pathRecurse(nmt, pp, spp, newCor);
    }
  };

  pathRecurse(mt, initPos, [], glift.enums.problemResults.INDETERMINATE);
  gen.positions = outPositions;
  return gen;
};

goog.provide('gpub.spec.Processor');
goog.provide('gpub.spec.TypeProcessor');

/**
 * The process takes a basic spec and transforms it into example-diagram
 * specifications.
 *
 * @param {!gpub.spec.Spec} spec
 * @param {!gpub.util.MoveTreeCache} cache
 * @constructor @struct @final
 */
gpub.spec.Processor = function(spec, cache) {
  /** @private @const {!gpub.spec.Spec} */
  this.originalSpec_ = spec;

  /**
   * Id Generator instance
   * @private @const {!gpub.spec.IdGen}
   */
  this.idGen_ = new gpub.spec.IdGen(spec.specOptions.idGenType);

  /**
   * Mapping from alias to movetree.
   * @const {!gpub.util.MoveTreeCache}
   * @private
   */
  this.mtCache_ = cache;
  if (!this.mtCache_) {
    throw new Error('cache must be defined. was: ' + this.mtCache_);
  }

  /**
   * Mapping from sgf alias to SGF string.
   * @const {!Object<string, string>}
   * @private
   */
  this.sgfMapping_ = spec.sgfMapping;

  /**
   * A top-level grouping, and ensuring the grouping is complete copy.
   * @const {!gpub.spec.Grouping}
   * @private
   */
  this.rootGrouping_ = new gpub.spec.Grouping(spec.rootGrouping);
};

gpub.spec.Processor.prototype = {
  /**
   * Process the spec!
   *
   * @return {!gpub.spec.Spec}
   */
  process: function() {
    this.processGroup(this.rootGrouping_);
    return new gpub.spec.Spec({
      rootGrouping: this.rootGrouping_,
      sgfMapping: this.sgfMapping_,
      specOptions: this.originalSpec_.specOptions,
      diagramOptions: this.originalSpec_.diagramOptions,
      bookOptions: this.originalSpec_.bookOptions,
    });
  },

  /**
   * Recursive group processor, which traverses the groups and processes all
   * the positions, generating positions along the way.
   *
   * @param {!gpub.spec.Grouping} g
   */
  processGroup: function(g) {
    this.processPositions_(g);
    for (var i = 0; i < g.groupings.length; i++) {
      this.processGroup(g.groupings[i]);
    }
  },

  /**
   * Process the Positions by, if necessary, generating new positions. This
   * creates generated objects for each of the original positions.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @private
   */
  // TODO(kashomon): Currently this requires ids to be defined and unique.
  processPositions_: function(grouping) {
    var pos = grouping.positions;
    var uniqueMap = {};
    for (var i = 0; i < pos.length; i++) {
      var p = pos[i];
      var id = p.id;
      if (uniqueMap[id]) {
        throw new Error('IDs are required to be unique, but the following ID was duplicated: ' + id);
      }
      uniqueMap[id] = true;
      if (!id) {
        throw new Error('Each position must have an ID. Id was: ' + id);
      }
      var pType = this.getPositionType_(grouping, p);
      var gen = this.generatePositions_(pType, p);
      if (gen) {
        grouping.generated[id] = gen;
      }
    }
  },

  /**
   * Process a grouping of positions. Where the magic happens.
   *
   * @param {!gpub.spec.PositionType} posType The position type for this
   *    set of positions, which indicates how the position should be processed.
   *    This needs to be passed in since it can be specified by the parent
   *    grouping (is this good behavior?).
   * @param {!gpub.spec.Position} pos The position that needs processing.
   * @return {?gpub.spec.Generated} Returns a generated position wrapper or
   *    null if no positions were generated.
   *
   * @private
   */
  generatePositions_: function(posType, pos) {
    var mt = this.getMovetree_(pos);
    // Create a new ID gen instance for creating IDs.
    var idGen = this.getIdGen_();
    switch(posType) {
      case 'GAME_COMMENTARY':
        return gpub.spec.processGameCommentary(mt, pos, idGen);
        break;
      case 'PROBLEM':
        return gpub.spec.processProblems(
            mt, pos, idGen, this.originalSpec_.specOptions);
        break;

      case 'EXAMPLE':
        return null;
        break;

      // case 'POSITION_VARIATIONS':
        // Fall through, for now.
      default: throw new Error('Unknown position type:' + JSON.stringify(posType));
    }
  },

  /**
   * Gets a movetree for an position
   *
   * @param {!gpub.spec.Position} position
   * @return {!glift.rules.MoveTree}
   * @private
   */
  getMovetree_: function(position) {
    var alias = position.alias;
    if (!alias) {
      throw new Error('No SGF alias defined for position object: '
          + JSON.stringify(position));
    }
    return this.mtCache_.get(alias);
  },

  /**
   * Gets a Position Type for a position/grouping/options.
   *
   * @param {!gpub.spec.Grouping} grouping
   * @param {!gpub.spec.Position} position
   * @return {!gpub.spec.PositionType}
   * @private
   */
  getPositionType_: function(grouping, position) {
    var positionType = null;
    if (position.positionType) {
      positionType = position.positionType;
    } else if (grouping.positionType) {
      positionType = grouping.positionType;
    } else if (this.originalSpec_.specOptions.positionType) {
      positionType = this.originalSpec_.specOptions.positionType;
    }
    if (!positionType) {
      throw new Error('No position type specified for position:'
          + JSON.stringify(position));
    }
    return positionType;
  },

  /**
   * Gets the id generator for a position object
   * @return {!gpub.spec.IdGen}
   */
  getIdGen_: function() {
    return this.idGen_;
  }
};


goog.provide('gpub.spec.SpecVersion');
goog.provide('gpub.spec.Spec');

/**
 * @typedef {{
 *  version: (gpub.spec.SpecVersion|undefined),
 *  grouping: (!gpub.spec.Grouping|undefined),
 *  sgfMapping: (!Object<string, string>|undefined),
 *  specOptions: (!gpub.api.SpecOptions|undefined),
 *  diagramOptions: (!gpub.api.DiagramOptions|undefined),
 *  bookOptions: (!gpub.api.BookOptions|undefined),
 * }}
 */
gpub.spec.SpecTypedef;

/**
 * The version of the spec. Necessary for storage-compatibility.
 * @enum {string}
 */
gpub.spec.SpecVersion = {
  V1: 'V1'
};

/**
 * A book spec represents a serialized Book specification or Spec. Re-running
 * Gpub on the same spec should generate the same output, modulo some details
 * like dates and debug information
 *
 * The Book Spec is descendent from the Glift Spec, but has orthogonal concerns
 * and so is separate.
 *
 * @param {(!gpub.spec.Spec|gpub.spec.SpecTypedef)=} opt_spec
 *
 * @constructor @struct @final
 */
gpub.spec.Spec = function(opt_spec) {
  var o = opt_spec || {};

  /**
   * The version of this spec. Required so that parsing of old specs can still
   * happen.
   *
   * @const {!gpub.spec.SpecVersion}
   */
  this.version = o.version || gpub.spec.SpecVersion.V1;

  /**
   * Top-level Position grouping.
   *
   * @const {!gpub.spec.Grouping}
   */
  this.rootGrouping = new gpub.spec.Grouping(o.rootGrouping);

  /**
   * Mapping from SGF Alias to SGF string. It's not required that this be a
   * bijection, but it doesn't really make sense to duplicate SGFs in the
   * mapping.
   *
   * @const {!Object<string, string>}
   */
  this.sgfMapping =  {};
  if (o.sgfMapping) {
    for (var key in o.sgfMapping) {
      this.sgfMapping[key] = o.sgfMapping[key];
    }
  }

  /**
   * Options specific to spec creation (Phases 1 and 2)
   * @const {!gpub.api.SpecOptions}
   */
  this.specOptions = new gpub.api.SpecOptions(o.specOptions);

  /**
   * Options specific to Diagrams (Phase 3)
   * @const {!gpub.api.DiagramOptions}
   */
  this.diagramOptions = new gpub.api.DiagramOptions(o.diagramOptions);

  /**
   * Options specific to book processing (Phase 4)
   * @const {!gpub.api.BookOptions}
   */
  this.bookOptions = new gpub.api.BookOptions(o.bookOptions);
};

/**
 * Deserialize a spec from JSON
 * @param {string} str
 */
gpub.spec.Spec.deserializeJson = function(str) {
  var obj = /** @type {!gpub.spec.Spec} */ (JSON.parse(str));
  return new gpub.spec.Spec(obj);
};

/**
 * Merge the top-level entries of two spec objects and return a new copy.
 * @param {!Object} oldobj
 * @param {!Object} newobj
 * @return {!gpub.spec.Spec} a new option sobject.
 */
gpub.spec.Spec.merge = function(oldobj, newobj) {
  for (var key in newobj) {
    oldobj[key] = newobj[key];
  }
  return new gpub.spec.Spec(/** @type {!gpub.spec.Spec} */ (oldobj));
};

gpub.spec.Spec.prototype = {
  /**
   * Transform a this spec into a JSON represontation.
   * @return {string}
   */
  serializeJson: function() {
    return JSON.stringify(this);
  }
};

goog.provide('gpub.diagrams')


gpub.diagrams = {
  /**
   * General diagram renderer.
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @return {!gpub.diagrams.Rendered} The rendered diagrams.
   */
  render: function(spec, cache) {
    return new gpub.diagrams.Renderer(spec, spec.diagramOptions, cache)
        .render();
  },

  /**
   * Streaming-process the diagrams.
   *
   * @param {!gpub.spec.Spec} spec
   * @param {!gpub.util.MoveTreeCache} cache
   * @param {!gpub.diagrams.DiagramCallback} fn
   */
  renderStream: function(spec, cache, fn) {
    return new gpub.diagrams.Renderer(spec, spec.diagramOptions, cache)
        .renderStream(fn);
  },

  /**
   * Renders go stones that exist in a block of text.
   * @param {!gpub.diagrams.Type} diagramType
   * @param {!string} text To process
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string}
   */
  renderInline: function(diagramType, text, opt) {
    return gpub.diagrams.Renderer
        .typeRenderer(diagramType)
        .renderInline(text, opt);
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
   *
   * @type {!RegExp}
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
   * @type {?RegExp}
   */
  inlineLabelRegexGlobal_: null,

  /**
   * A replace-inline function.
   * @param {string} text The text to process.
   * @param {function(string, string, string): string} fn A processing function
   *    that takes as parameters 'full', 'player', 'label'.
   */
  replaceInline: function(text, fn) {
    if (!gpub.diagrams.inlineLabelRegexGlobal_) {
      gpub.diagrams.inlineLabelRegexGlobal_ = new RegExp(
          gpub.diagrams.inlineLabelRegex.source, 'g');
    }
    var reg = /** @type {!RegExp} */ (gpub.diagrams.inlineLabelRegexGlobal_);
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
   * @param {!glift.flattener.Flattened} flattened
   * @return {string}
   */
  createLabel: function(flattened) {
    return glift.flattener.labels.createFullLabel(flattened);
  },
};

goog.provide('gpub.diagrams.Diagram');
goog.provide('gpub.diagrams.DiagramCallback');
goog.provide('gpub.diagrams.DiagramRenderer');
goog.provide('gpub.diagrams.Metadata');
goog.provide('gpub.diagrams.Rendered');

/**
 * A single rendered diagram.
 * @typedef {{
 *  id: string,
 *  rendered: string,
 *  fileSuffix: string
 * }}
 */
gpub.diagrams.Diagram;

/**
 * Metadata for a diagram. Includes information useful for placement in a page
 * or other medium. Some notes about parameters:
 * - Comment will be an empty string if none exists, but it will never be
 *   undefined.
 * - collisions, isOnMainPath, startingMoveNum, and endingMoveNum are useful
 *   for figure-labels (move-number labeling, collision labeling).
 *
 * @typedef {{
 *  id: string,
 *  labels: (!Array<string>|undefined),
 *  comment: string,
 *  collisions: !Array<!glift.flattener.Collision>,
 *  isOnMainPath: boolean,
 *  startingMoveNum: number,
 *  endingMoveNum: number,
 * }}
 */
gpub.diagrams.Metadata;

/**
 * Rendered diagrams plus some metadata. For streamed rendering, the diagrams
 * array will be empty. Otherwise, the metadata and diagrams arrays should be
 * equal.
 *
 * @typedef{{
 *  diagrams: !Array<gpub.diagrams.Diagram>,
 *  metadata: !Array<gpub.diagrams.Metadata>,
 *  type: gpub.diagrams.Type
 * }}
 */
gpub.diagrams.Rendered;


/** @typedef {function(!gpub.diagrams.Diagram, !gpub.diagrams.Metadata)} */
gpub.diagrams.DiagramCallback;

/**
 * The interface for the diagram-type-specific renderers.
 * @record
 */
gpub.diagrams.DiagramRenderer = function() {};

/**
 * Render one diagram.
 * @param {!glift.flattener.Flattened} f
 * @param {!gpub.api.DiagramOptions} o
 * @return {string} The rendered diagram
 */
gpub.diagrams.DiagramRenderer.prototype.render = function(f, o) {};

/**
 * Render inline text with stone images.
 * @param {string} text
 * @param {!gpub.api.DiagramOptions} opt
 * @return {string}
 */
gpub.diagrams.DiagramRenderer.prototype.renderInline = function(text, opt) {};

goog.provide('gpub.diagrams.Type');

/**
 * Types of diagram output.
 *
 * @enum {string}
 */
gpub.diagrams.Type = {
  /**
   * Dan Bump's LaTeX font. Part of the Sgf2Dg script.
   */
  GOOE: 'GOOE',

  /**
   * Variant of Gooe series.
   */
  GNOS: 'GNOS',

  /**
   * Another LaTeX font / LaTeX style package. Note that IGO has a limited
   * character set available.
   */
  IGO: 'IGO',


  /**
   * Diagrams for the SmartGo book (GoBook) format.
   */
  SMARTGO: 'SMARTGO',

  /**
   * Generate SVG Diagrams.
   */
  SVG: 'SVG'

  /////////////////////////////
  // Morass of planned types //
  /////////////////////////////

  /**
   * Native PDF generation
   * >> Not Currently Supported, but here for illustration.
   */
  //PDF: 'PDF',

  //EPS: 'EPS',

  /**
   * Sensei's library ASCII variant.
   */
  //SENSEIS_ASCII: 'SENSEIS_ASCII',

  /**
   * GPUB's ASCII variant.
   */
  //GPUB_ASCII: 'GPUB_ASCII',
};

/**
 * Map from diagram type to file suffix.
 * @type {!Object<gpub.diagrams.Type, string>}
 */
gpub.diagrams.fileSuffix = {};
gpub.diagrams.fileSuffix[gpub.diagrams.Type.GOOE] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.GNOS] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.IGO] = 'tex';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.SMARTGO] = 'gobook';
gpub.diagrams.fileSuffix[gpub.diagrams.Type.SVG] = 'svg';

goog.provide('gpub.diagrams.Renderer');

/**
 * A map from string to enabled renderers. Typically, the string key will be a
 * gpub.diagrams.Type enum, but to enable custom renderers, this is left
 * open-ended.
 *
 * Each Renderer must be registered here to be considered enabled, but most
 * renderers add to this map later, so that this package needn't know about the
 * down-stream diagram renderer packages.
 *
 * @type {!Object<!string, (function(): !gpub.diagrams.DiagramRenderer)>}
 */
gpub.diagrams.enabledRenderers = {};

/**
 * General diagram renderer.
 * @param {!gpub.spec.Spec} spec
 * @param {!gpub.api.DiagramOptions} opts
 * @param {!gpub.util.MoveTreeCache} cache
 * @constructor @struct @final
 */
gpub.diagrams.Renderer = function(spec, opts, cache) {
  /** @const {!gpub.spec.Spec} */
  this.spec_ = spec;

  /** @const {!gpub.api.DiagramOptions} */
  this.opts_ = opts;

  /** @const {!gpub.util.MoveTreeCache} */
  this.cache_ = cache;

  /**
   * Number of diagrams that have been rendered.
   * @private {number}
   */
  this.rendered_ = 0;
};

/**
 * Get a type specific renderer.
 * @param {!gpub.diagrams.Type} type
 * @return {!gpub.diagrams.DiagramRenderer}
 */
gpub.diagrams.Renderer.typeRenderer = function(type) {
  var ren = gpub.diagrams.enabledRenderers[type];
  if (!ren) {
    throw new Error('Unknown or unsupported render type: ' + type +
        '. Each renderer must have a function-provider present in ' +
        'gpub.diagrams.enabledRenderers.');
  }
  return ren();
};

gpub.diagrams.Renderer.prototype = {
  /** @return {!gpub.diagrams.Type} Returns the relevant diagram type. */
  diagramType: function() { return this.opts_.diagramType; },

  /**
   * Render all the positions in all the groups.
   * @return {!gpub.diagrams.Rendered} The rendered diagrams plus any metadata.
   */
  render: function() {
    var rendered = this.renderedObj();
    /** @type {!gpub.diagrams.DiagramCallback} */
    var handler = function(d, m) {
      rendered.diagrams.push(d);
      rendered.metadata.push(m);
    };
    this.renderGroups_(this.spec_.rootGrouping, handler);
    return rendered;
  },

  /**
   * Stream back the rendered diagrams, but store the metadata.
   *
   * @param {!gpub.diagrams.DiagramCallback} fn
   * @return {!gpub.diagrams.Rendered}
   */
  renderStream: function(fn) {
    var rendered = this.renderedObj();
    /** @type {!gpub.diagrams.DiagramCallback} */
    var handler = function(d, m) {
      rendered.metadata.push(m);
      fn(d, m);
    };
    this.renderGroups_(this.spec_.rootGrouping, handler);
    return rendered;
  },

  /**
   * Return the rendered object with just the matadata filled in.
   * @return {!gpub.diagrams.Rendered}
   */
  renderedObj: function() {
    return {
      type: this.diagramType(),
      diagrams: [],
      metadata: [],
    };
  },

  /**
   * Gets the diagram renderer for the passed-in diagram type
   * @return {!gpub.diagrams.DiagramRenderer}
   */
  diagramRenderer: function() {
    return gpub.diagrams.Renderer.typeRenderer(this.diagramType());
  },

  /**
   * @param {!gpub.spec.Grouping} g
   * @param {!gpub.diagrams.DiagramCallback} fn
   * @private
   */
  renderGroups_: function(g, fn) {
   this.renderOneGroup_(g, fn);
    for (var i = 0; i < g.groupings.length; i++) {
      this.renderOneGroup_(g, fn);
    }
  },

  /**
   * Render all the positions for a single group; We only render the generated
   * positions; if there are no generated positions, we try to render the
   * original position.
   * @param {!gpub.spec.Grouping} g
   * @param {!gpub.diagrams.DiagramCallback} fn
   * @private
   */
  renderOneGroup_: function(g, fn) {
    var out = [];

    for (var i = 0; i < g.positions.length; i++) {
      var pos = g.positions[i];
      if (g.generated[pos.id]) {
        var gen = g.generated[pos.id];
        for (var j = 0; j < gen.positions.length; j++) {
          this.renderOnePosition_(gen.positions[j], fn);
        }
      } else {
        this.renderOnePosition_(pos, fn);
      }
    }
  },

  /**
   * Render a single position.
   * @param {!gpub.spec.Position} pos
   * @param {!gpub.diagrams.DiagramCallback} fn Handler to receive the diagrams.
   * @private
   */
  renderOnePosition_: function(pos, fn) {
    this.rendered_++;
    if (this.opts_.skipDiagrams) {
      if (this.rendered_ <= this.opts_.skipDiagrams) {
        return;
      }
    }
    if (this.opts_.maxDiagrams) {
      if (this.rendered_ > this.opts_.maxDiagrams) {
        return;
      }
    }

    var mt = this.cache_.get(pos.alias);
    var region = this.opts_.boardRegion;
    var init = glift.rules.treepath.parseInitialPath(pos.initialPosition);
    mt = mt.getTreeFromRoot(init);
    var flattenOpts = {
      boardRegion: region,
      nextMovesPath: glift.rules.treepath.parseFragment(pos.nextMovesPath  || ''),
      autoBoxCropOnVariation: this.opts_.autoBoxCropOnVariation,
      regionRestrictions: this.opts_.regionRestrictions,
    };
    var flattened = glift.flattener.flatten(mt, flattenOpts);
    var dr = this.diagramRenderer();
    var suffix = gpub.diagrams.fileSuffix[this.diagramType()] || 'unknown';
    var diagram = {
      id: pos.id,
      rendered: dr.render(flattened, this.opts_),
      fileSuffix: suffix,
    };
    var metadata = {
      id: pos.id,
      labels: pos.labels,
      comment: flattened.comment(),
      collisions: flattened.collisions(),
      isOnMainPath: flattened.isOnMainPath(),
      startingMoveNum: flattened.startingMoveNum(),
      endingMoveNum: flattened.endingMoveNum(),
    };
    fn(diagram, metadata);
  },

  /**
   * Process text inline, if possible, replacing stones with inline-images if
   * possible.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text.
   */
  renderInline: function(text, opt) {
    return this.diagramRenderer().renderInline(text, opt);
  },
};

goog.provide('gpub.diagrams.gnos');

/**
 * Gnos is a modification of the Gooe font series.
 * See https://github.com/Kashomon/go-type1.
 *
 * To use 'gnos', you must at the very least have these declarations at the top
 * of your LaTeX file:
 *
 * \usepackage{gnos}
 * \usepackage[cmyk]{xcolor}
 *
 */
gpub.diagrams.gnos = {
  /**
   * Available font sizes for the gno characters, in pt.
   * @type{!Object<number, number>}
   */
  fontSize: {
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    14: 14,
    16: 16,
    20: 20
  },

  /**
   * Mapping from size to label size index. Keys in pt.
   * @type {!Object<number, number>}
   */
  singleCharSizeAtTen: {
    8: 1, // tiny
    9: 2, // footnotesize
    10: 2, // footnotesize
    11: 3, // small
    12: 3, // normalsize
    14: 4, // large
    16: 5, // Large
    20: 6  // LARGE
  },

  /**
   * Array of avaible latex sizes. Should probably be moved to the latex
   * package. It's sort of unpleasant that this is an array, but the reason is
   * that we sometimes bump the size up or down by one and latex sizes are
   * binned into the following (sequential) sizes.
   *
   * @type {!Array<string>}
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
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string}
   */
  create: function(flat, opt) {
    var optSize = opt.goIntersectionSize;
    if (optSize) {
      optSize = gpub.util.size.parseSizeToPt(optSize);
    } else {
      optSize = 12;
    }
    if (!gpub.diagrams.gnos.fontSize[optSize]) {
      throw new Error('Font size not supported by Gnos diagarm type: ' + optSize
          + '. Supported font sizes: ' + Object.keys(gpub.diagrams.gnos.fontSize));
    }
    return gpub.diagrams.gnos.gnosString_(flat, optSize);
  },

  // TODO(kashomon): This should really be a macro.
  /** @private {string} */
  inlineWrapper_: '{\\raisebox{-.17em}{\\textnormal{%s}}}',

  /**
   * Render go stones that exist in a block of text.
   *
   * In particular, replace the phrases Black \d+ and White \d+ with
   * the relevant stone symbols i.e. Black 123 => \\gnosbi\\char23
   *
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} options
   * @return string
   */
  renderInline: function(text, options) {
    options = options || {}; // TODO(kashomon): Remove hack. Push up a level.
    var fontsize = gpub.util.size.parseSizeToPt(
        options.goIntersectionSize || gpub.diagrams.gnos.fontSize[12]);
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
        throw new Error('Error processing inline label! '
            + 'player != White && player != Black');
      }
      var labelSymbol = gpub.diagrams.gnos.getLabelDef(label, stone, fontsize);
      var labelSymbolVal = gpub.diagrams.gnos.Symbol[labelSymbol];
      var processed = gpub.diagrams.gnos.processTextLabel_(
          labelSymbol, labelSymbolVal, label, fontsize);
      return gpub.diagrams.gnos.inlineWrapper_.replace('%s', processed);
    });
  },

  ///////////////////////
  // 'private' helpers //
  ///////////////////////
  /**
   * Produce a gnos string array of lines.
   * @param {!glift.flattener.Flattened} flattened
   * @param {!number} size
   * @return {string} the rendered diagram
   * @private
   */
  gnosString_: function(flattened, size) {
    var latexNewLine = '\\\\';
    var buffer = '\\gnosfontsize{' + size + '}' +
        '{\\gnos'
    var footer = '}';
    var board = gpub.diagrams.gnos.gnosBoard_(flattened, size);
    for (var i = 0, arr = board.boardArray(); i < arr.length; i++) {
      buffer += arr[i].join('') + latexNewLine;
    }
    buffer += footer
    return buffer;
  },

  /**
   * Returns a flattener-symbol-board that's been transformed for into a
   * series of latex/gnos symbols.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @param {number} size
   * @return {!glift.flattener.Board<string>}
   * @private
   */
  gnosBoard_: function(flattened, size) {
    var toStr = glift.flattener.symbolStr;
    var Symbol = gpub.diagrams.gnos.Symbol;
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

      var out;
      if (Symbol[symbol]) {
        out = Symbol[symbol];
      } else {
        out = Symbol['EMPTY'];
      }
      var lbl = flattened.autoTruncateLabel(i.textLabel());
      if (lbl) {
        out = gpub.diagrams.gnos.processTextLabel_(
            symbol, out, lbl, size);
      } else if (i.mark() && !i.stone()) {
        out = gpub.diagrams.gnos.markOverlap_(
            Symbol[toStr(i.base())], out);
      }
      return out;
    });
    return newBoard;
  },

  /**
   * Mark a symbol as overlapping another symbol.
   *
   * @param {string} a Gnos symbol transformation
   * @param {string} b Gnos symbol transformation
   * @return {string}
   */
  markOverlap_: function(a, b) {
    return '\\gnosOverlap{' + a + '}{\\gnos' + b + '}';
  },

  /**
   * This needs some explanation because it's kinda nuts.
   *  - I prefer the raw fonts for double-character fonts.
   *  - I prefer the GOOE style gnosb/gnosw built-ins for >3 chars (e.g., 234)
   *  - At 8 point, the tiny font looks terrible, so defer to the gnosb/gnosw
   * label: string or null
   * stone: number symbol or null
   * size: string.  Size of the gnos font
   *
   * @param {string} label
   * @param {glift.flattener.symbols} stone
   * @param {number} sizeNum
   * @return {string} key
   */
  getLabelDef: function(label, stone, sizeNum) {
    var toStr = glift.flattener.symbolStr;
    var size = sizeNum + ''; // Ensure a string
    var out = '';
    if (label && /^\d+$/.test(label) && stone &&
        (size === '8' || label.length >= 3)) {
      var num = parseInt(label, 10);
      var stoneStr = toStr(stone)
      if (num > 0 && num < 100) {
        out = stoneStr + '_' + 'NUMLABEL_1_99';
      } else if (num >= 100 && num < 200) {
        out = stoneStr + '_' + 'NUMLABEL_100_199';
      } else if (num >= 200 && num < 299) {
        out = stoneStr + '_' + 'NUMLABEL_200_299';
      } else if (num >= 300 && num < 399) {
        out = stoneStr + '_' + 'NUMLABEL_300_399';
      } else {
        out = toStr(stone) + '_' + 'TEXTLABEL';
      }
    } else if (stone && label) {
      out = toStr(stone) + '_' + 'TEXTLABEL';
    } else {
      out ='TEXTLABEL';
    }
    if (!gpub.diagrams.gnos.Symbol[out]) {
      // This shouldn't happen if I've written this method correctly.
      throw new Error('Programming error! Symbol [' + out + '] not defined in'
          + ' gpub.diagrams.gnos.Symbol');
    }
    return out;
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
   *
   * @param {string} symbol Key in into gpub.diagrams.gnos.Symbol.
   * @param {string} symbolVal Element of gpub.diagrams.gnos.Symbol.
   * @param {string} label The text to place on a stone (usu. numbers).
   * @param {number} size The font size. Must be a supported gnos font size.
   * @return {string}
   * @private
   */
  processTextLabel_: function(symbol, symbolVal, label, size) {
    if (/^\d+$/.test(label) && /NUMLABEL/.test(symbol)) {
      // NUMLABEL are  a special categories of number-labeling where we use the
      // built-in font.  Each of these NUMLABEL fonts accept two characters.
      var lbl = parseInt(label, 10) % 100;
      if (isNaN(lbl)) {
        // Programming error:
        throw new Error('Regex thought that lbl was a number, but it was not! '
            + 'Was: ' + lbl);
      }
      return symbolVal.replace('%s', lbl + '');
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

goog.provide('gpub.diagrams.gnos.Renderer');

/**
 * The diagrams-specific renderer for gnos. Implicitly, this implements the
 * gpub.diagrams.DiagramRenderer record-type interface.
 *
 * @constructor @final @struct
 */
gpub.diagrams.gnos.Renderer = function() {}

gpub.diagrams.gnos.Renderer.prototype = {
  /**
   * The create method!
   *
   * We expect flattened and options to be defined.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return gpub.diagrams.gnos.create(flat, opt);
  },

  /**
   * Render-inline some inline text via gnos.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return gpub.diagrams.gnos.renderInline(text, opt);
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['GNOS'] = function() {
  return new gpub.diagrams.gnos.Renderer();
};

goog.provide('gpub.diagrams.gnos.Symbol');

/**
 * Gnos symbols. The keys of the map should roughly equal the keys of
 * glift.flattener.symbols. In otherwords, there should be a 1:1 mapping from
 * glift.flattener.symbols to this symbol map, but not necessarily the other
 * way around.
 *
 * @type {!Object<string,string>}
 */
gpub.diagrams.gnos.Symbol = {
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
};

goog.provide('gpub.diagrams.gooe');

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

goog.provide('gpub.diagrams.gooe.init');

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
    sizeDefs: '% Size definitions\n' +
      '\\newdimen\\bigRaise\n' +
      '\\bigRaise=4.3pt\n' +
      '\\newdimen\\smallRaise\n' +
      '\\smallRaise=3.5pt\n' +
      '\\newdimen\\inlineRaise\n' +
      '\\inlineRaise=3.5pt\n',

    bigBoardDefs: '% Big-sized board defs' +
      '\\def\\eLblBig#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\bigRaise\\hbox{\\tenpointeleven{#1}}\\hss}}\n' +
      '\\def\\goWsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\tenpointeleven{#1}\\hss}}\n' +
      '\\def\\goBsLblBig#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\bigRaise\\hbox to \\wd0{\\hss\\color{white}\\tenpointeleven{#1}\\color{white}\\hss}}\n',

    normalBoardDefs: '% Normal-sized board defs' +
      '\\def\\eLbl#1{\\leavevmode\\hbox to \\goIntWd{\\hss\\raise\\smallRaise\\hbox{\\tenpoint{#1}}\\hss}}\n' +
      '\\def\\goWsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??!}\\rlap{\\0??!}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\eightpointnine{#1}\\hss}}\n' +
      '\\def\\goBsLbl#1{\\leavevmode\\setbox0=\\hbox{\\0??@}\\rlap{\\0??@}\\raise\\smallRaise\\hbox to \\wd0{\\hss\\color{white}\\eightpointnine{#1}\\color{white}\\hss}}\n',
  },

  /**
   * Generates the LaTeX document headers as a string.
   *
   * Takes a base font family. Defaults to cmss (computer modern sans serif).
   * @param {string=} opt_baseFont
   * @return {string} the latex init defs.
   */
  extraDefs: function(opt_baseFont) {
    var baseFont = opt_baseFont || 'cmss';
    var defs = gpub.diagrams.gooe.init.defs;
    var fontDefsBase =
      '% Gooe font definitions\n' +
      '\\font\\tenpoint=' + baseFont + '10\n' +
      '\\font\\tenpointeleven=' + baseFont + '10 at 11pt\n' +
      '\\font\\eightpoint=' + baseFont + '8\n' +
      '\\font\\eightpointnine=' + baseFont + '8 at 9pt\n';
    return fontDefsBase +
      defs.sizeDefs +
      defs.bigBoardDefs +
      defs.normalBoardDefs;
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

/**
 * The GPub Ascii format. Note the similarity to SGF specification.
 *
 * Note that the board is indexed from 1,1, from the upper left.
 *
 * ___________
 * |.........|
 * |......*..|
 * |...%.....|
 * |.....%...|
 * |..@.+....|
 * |......X..|
 * |....OOX..|
 * |....OX...|
 * |.........|
 * -----------
 *
 * (3,5):Triangle
 * (4,3),(6,4):A
 * (7,1):Square
 * C: A balanced 9x9 game!
 *
 * Note that coords are indexed from the top left (maybe it should be bottom
 * left?)
 *
 * Legend
 * . :: Board
 * + :: Starpoint (optional).
 * O :: White Stone
 * X :: Black Stone
 * @ :: White Stone + label or mark
 * % :: Black Stone + label or mark
 * * :: Empty Intersection + label or mark
 */
gpub.diagrams.gpubAscii = {
  create: function(flattened, opts) {
    var toStr = glift.flattener.symbolStr;
    var symbolMap = gpub.diagrams.gpubAscii.symbolMap;

    var marks = {};
    var outStr = '';
    var newBoard = flattened.board().transform(function(i, x, y) {
      var symbol = toStr(i.base()); // Default
      if (i.stone()) {
        var stoneSym = toStr(i.stone());
        if (i.mark()) {
          symbol = stoneSym + '_MARK';
        } else {
          symbol = stoneSym;
        }
      } else if (i.mark()) {
        symbol = 'EMPTY_MARK';
      }

      if (i.mark()) {
        var pt = x + ',' + y;
        var obj = {
          mark: toStr(i.mark())
        };
        if (i.textLabel()) {
          obj['label'] = i.textLabel();
        }
        marks[pt] = obj;
      }

      var out = symbolMap[symbol];
      if (!out) {
        throw new Error('Could not find symbol str for : ' + symbol);
      }
      return out;
    });

    for (var i = 0; i < newBoard.boardArray; i++) {
      if (outStr) {
        outStr += '\n' + newBoard.join('');
      } else {
        outStr = newBoard.join('');
      }
    }
    return outStr;
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

  BSTONE: 'X',
  WSTONE: 'O',

  BSTONE_MARK: '%',
  WSTONE_MARK: '@',
  EMPTY_MARK: '*'
};

goog.provide('gpub.diagrams.igo');

/**
 * Creates igo-diagrams. Note: This is only for creating books using latex.
 */
gpub.diagrams.igo = {
  /**
   * Font sizes supported by igo, in pt.
   * @type {!Object<number, number>}
   */
  fontSize: {
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    15: 15,
    20: 20
  },

  /**
   * Converts a normal Glift point into an Igo coordinate.
   *
   * Note: For Igo, Go boards are indexed from the bottom-left as
   * coordinates of the form <letter><number>:
   *  a12
   *  g5
   * - Numbers are 1 indexed
   * - i is not used for intersections
   *
   * Normal Glift points are indexed from the top left.
   *
   * So, from Igo's perspective, the boards look like this:
   *   ...
   *   ^
   *   2
   *   ^
   *   1
   *     a->b->c->d->e->f->g->h->j->k->l...
   * @param {!glift.Point} pt
   * @param {number} size
   * @return string
   */
  toIgoCoord: function(pt, size) {
    if (!pt) { throw new Error('No point'); }
    if (!size) { throw new Error('No board size'); }
    if (pt.x() < 0 || pt.y() < 0 || pt.x() > size-1 || pt.y() > size-1) {
      throw new Error('Pt out of bounds: ' + pt.toString());
    }
    var letters = 'abcdefghjklmnopqrstuvwxyz';
    var x = letters.charAt(pt.x());
    var y = size - pt.y();
    return x+y;
  },

  /**
   * Create a diagram from a flattened representation.
   *
   * Unlike many other diagram-generators, Igo has lots of built-in logic in the
   * TEX style. Thus, we need only display the stones and marks.
   *
   * @param {!glift.flattener.Flattened} flattened
   * @param {!gpub.api.DiagramOptions} options
   * @return {string} The rendered diagram.
   */
  create: function(flattened, options) {
    var optSize = options.goIntersectionSize || 10;
    var keySize = parseInt(optSize, 10);
    var fontSize = gpub.diagrams.igo.fontSize[keySize] || 10;
    var boardSize = flattened.board().maxBoardSize();
    var symbolStr = glift.flattener.symbolStr;

    var intersections = gpub.diagrams.igo.processIntersections(
        flattened.marks(), flattened.stoneMap(), flattened.labels());

    // Glyphs are used in the context: \white|black[glyph]{intersection-pairs}
    var markToGlyph = {
      XMARK: '\\igocross',
      SQUARE: '\\igosquare',
      TRIANGLE: '\\igotriangle',
      CIRCLE: '\\igocircle'
    };

    var out = [
        '\\cleargoban',
        '\\gobansize{' + boardSize + '}',
        '\\igofontsize{' + fontSize + '}'
    ];

    var toPt = glift.util.pointFromString;
    var toIgoCoord = gpub.diagrams.igo.toIgoCoord;
    var convertPtArr = function(convArr) {
      var out = [];
      for (var i = 0; i < convArr.length; i++) {
        out.push(toIgoCoord(toPt(convArr[i]), boardSize));
      }
      return out.join(',');
    }
    // First add the stones without labels;
    for (var color in intersections.blankStones) {
      var arr = intersections.blankStones[color];
      if (arr.length === 0) { continue; }
      var decl = '\\' + color.toLowerCase() + '{';
      out.push(decl + convertPtArr(arr) + '}');
    }
    // Next, add sequences.
    for (var i = 0; i < intersections.sequences.length; i++) {
      var seq = intersections.sequences[i];
      if (seq.length === 0) { continue; }
      var color = seq[0].color;
      var startNum = seq[0].label;
      var decl = '\\' + color.toLowerCase() + '[' + startNum + ']{';
      var row = [];
      for (var i = 0; i < seq.length; i++) {
        if (seq[i]) {
          row.push(toIgoCoord(toPt(seq[i].ptstr), boardSize));
        } else {
          // There's a sequence break here
          row.push('-');
        }
      }
      out.push(decl + row.join(',') + '}');
    }
    // Now, add stone-marks.
    for (var color in intersections.marks) {
      var marksForColor = intersections.marks[color];
      for (var markstr in marksForColor) {
        var marr = marksForColor[markstr];
        if (marr.length === 0) { continue; }
        var decl = '\\' + color.toLowerCase() + '[' +
            markToGlyph[markstr] + ']{';
        out.push(decl + convertPtArr(marr) + '}');
      }
    }
    // Lastly, add the empty-intersection labels
    for (var label in intersections.emptyTextLabels) {
      var larr = intersections.emptyTextLabels[label];
      if (larr.length === 0) { continue; }
      var decl = '\\gobansymbol{';
      var trailer =  '}{' + label + '}';
      out.push(decl + convertPtArr(larr) + trailer);
    }

    var tl = flattened.board().topLeft();
    var br = flattened.board().botRight();
    var bl = new glift.Point(tl.x(), br.y());
    var tr = new glift.Point(br.x(), tl.y());

    out.push('\\showgoban['
        + toIgoCoord(bl, boardSize) + ',' + toIgoCoord(tr, boardSize) + ']');

    return out.join('\n');
  },

  /**
   * Render go stones that exist in a block of text.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} options
   * @return {string} The processed text
   */
  renderInline: function(text, options) {
    // TODO(kashomon): Implement at some point. See gnos for an example. IGO has
    // good support for inline stones, so it shouldn't be too much trouble.
    return text;
  }
};

gpub.diagrams.igo.init = {
  LATEX: [
    '\\usepackage{igo}'
  ].join('\n')
};

goog.provide('gpub.diagrams.igo.Intersections');

goog.scope(function() {

/**
 * Convenience type
 *
 * @typedef{{
 *  ptstr: glift.PtStr,
 *  color: glift.enums.states,
 *  label: string,
 * }}
 */
var IgoStoneLabel;

/**
 * Mutable container for tracking which stones and marks have been processed, in
 * a way that's useful for Igo.
 *
 * @constructor @struct @final
 */
gpub.diagrams.igo.Intersections = function() {
  /**
   * You can only declare stones once. You get to do this either as a mark
   * declaration, sequence declaraton, or no-label declaration.
   * @type {!Object<!glift.PtStr,boolean>}
   */
  this.seenStones = {};

  /**
   * Igo has an unusual idea of move-sequences where moves are automatically
   * numbered based of a starting black/white stone and a starting number.
   *
   * Note that sequences is an array of arrays, where the inner arrays are the
   * relevant sequences. The inner arrays are arrays of modified-moves, which
   * are simple objects of the form
   *    {ptstr: <string>, color: <BLACK|WHITE>, label: <number-string>}
   *    {ptstr: a1, color: BLACK, label: 12}
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
   *
   * @const{!Object<string, !Array<glift.PtStr>>}
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
  /**
   * Adds a mark to the mark map.
   * @param {glift.enums.states} color
   * @param {string} mark The stringified-mark
   * @param {!glift.PtStr} ptstr
   * @return {!gpub.diagrams.igo.Intersections} this
   */
  addMark: function(color, mark, ptstr) {
    if (color == null) { throw new Error('No color'); }
    if (mark == null) { throw new Error('No mark'); }
    if (ptstr == null) { throw new Error('No ptstr'); }
    this.marks[color][mark].push(ptstr);
    this.seenStones[ptstr] = true;
    return this;
  },

  /**
   * Adds a textlabel mark for empty intersections.
   * @param {glift.PtStr} ptstr
   * @param {string} label
   * @return {!gpub.diagrams.igo.Intersections} this
   */
  addEmptyTextLabel: function(ptstr, label) {
    if (ptstr == null) { throw new Error('No ptstr'); }
    if (label == null) { throw new Error('No label'); }
    if (!this.emptyTextLabels[label]) {
      this.emptyTextLabels[label] = [];
    }
    this.emptyTextLabels[label].push(ptstr);
    return this;
  },

  /**
   * Adds a stone without label or mark if it hasn't already been seen.
   * @param {glift.PtStr} ptstr
   * @param {!glift.rules.Move} stone
   * @return {!gpub.diagrams.igo.Intersections} this
   */
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
   * @param {!Array<!IgoStoneLabel>} stoneLabelArr
   * @return {!gpub.diagrams.igo.Intersections} this
   */
  addStoneTextLabels: function(stoneLabelArr) {
    var arrCopy = [];
    var ln = {}; // label to num
    var colors = {BLACK:'BLACK', WHITE:'WHITE'};
    for (var i = 0; i < stoneLabelArr.length; i++) {
      var item = stoneLabelArr[i];
      if (!colors[item.color]) {
        throw new Error('Unknown color:' + item.color);
      }

      // Conservatively, check here that the labels are numeric.
      if (item.label && item.ptstr && item.color && /^\d+$/.test(item.label)) {
        ln[item.label] = parseInt(item.label, 10);
        arrCopy.push(item);
      } else {
        throw new Error('Invalid item:'
            + item.ptstr + ',' + item.color + ',' + item.label);
      }
    }

    if (arrCopy.length > 1) {
      // Sort the stone label array by
      arrCopy.sort(function(a, b) {
        return ln[a.label] - ln[b.label]
      });
    }

    // Now that it's sorted, we can construct the sequences.
    var curSequence = [];
    for (var i = 0; i < arrCopy.length; i++) {
      var item = arrCopy[i];

      // This should already have been seen. Why do we mark it here?
      this.seenStones[item.ptstr] = true;
      if (curSequence.length === 0) {
        curSequence.push(item);
        continue;
      }

      var last = curSequence[curSequence.length-1];
      if (item.color !== last.color && ln[item.label] === ln[last.label]+1) {
        // It's a sequence!
        curSequence.push(item);
      } else if (item.color === last.color && ln[item.label] === ln[last.label]+2) {
        // It's a sequence with a gap!
        curSequence.push(null);
        curSequence.push(item);
      } else if (item.color !== last.color && ln[item.label] === ln[last.label]+3) {
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
 * Process the marks, stones, and labels into something more useful for Igo.
 *
 * @param {!Object<glift.PtStr, glift.flattener.symbols>} markMap
 * @param {!Object<glift.PtStr, !glift.rules.Move>} stoneMap
 * @param {!Object<glift.PtStr, string>} labelMap
 * @return {!gpub.diagrams.igo.Intersections}
 */
gpub.diagrams.igo.processIntersections =
    function(markMap, stoneMap, labelMap) {
  var tracker = new gpub.diagrams.igo.Intersections();

  var number = /^\d+$/;

  var symbolStr = glift.flattener.symbolStr;

  // With stoneTextLabels, we attempt find sequences of stones, which allows for
  // more compact diagram descriptions. First, we just collect all the text
  // labels. Then we add blank stones if they haven't been seen.
  /** @type {!Array<!IgoStoneLabel>} */
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

})  // goog.scope;

goog.provide('gpub.diagrams.igo.Renderer');

/**
 * @constructor @final @struct
 */
gpub.diagrams.igo.Renderer = function() {}

gpub.diagrams.igo.Renderer.prototype = {
  /**
   * The create method for igo
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    return gpub.diagrams.igo.create(flat, opt);
  },

  /**
   * Render-inline the
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return gpub.diagrams.igo.renderInline(text, opt);
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['IGO'] = function() {
  return new gpub.diagrams.igo.Renderer();
};

goog.provide('gpub.diagrams.pdf');

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

goog.provide('gpub.diagrams.senseisAscii');

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

goog.provide('gpub.diagrams.smartgo');

/**
 * Package for Smartgo-book rendering.
 */
gpub.diagrams.smartgo = {
};

goog.provide('gpub.diagrams.smartgo.Renderer');

/**
 * Spec: http://www.smartgo.com/pdf/gobookformat.pdf
 *
 * Some notes:
 * -   All books must start with something like:
 *     ::book(#mahbook) title="Example Title" author="Somebody"
 * -   Each file contains one book -- the file extension should be .gobook.
 *
 *
 * More details on figure/diagram types: from the doc:
 *
 * fig: Main figures of a game, based on a Go game given as Go data, with move
 * numbers reflecting the moves in the game, and the move numbers listed below
 * the figure. Shown at full size.
 *
 * dia: Diagrams showing alternative move sequences. Move numbering starts at
 * 1.  Usually shown at a slightly smaller scale than the figures. (This
 * default setting can be changed with the fullWidth attribute.)
 *
 * prb: Diagrams showing a problem diagram. Problems are shown at full width,
 * and move input will react differently, giving feedback on correct or wrong
 * solutions.
 *
 * @constructor @final @struct
 */
gpub.diagrams.smartgo.Renderer = function() {
};

gpub.diagrams.smartgo.Renderer.prototype = {
  /**
   * The create method for smartgo
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    var base = '::fig' // Default to fig types.
    var sz = flat.board().maxBoardSize();

    if (sz != 19) {
      base += ' sz=' + sz;
    }

    if (flat.board().isCropped()) {
      // Add cropping only if the board is cropped.
      base += ' vw=' + this.toSGCoord(flat.board().topLeft(), sz) +
          this.toSGCoord(flat.board().botRight(), sz);
    }

    var abpts = '';
    var awpts = '';
    for (var key in flat.stoneMap()) {
      var move = flat.stoneMap()[key];
      if (!move.point) {
        // There should always be points for flattened objs, but it's good to
        // check.
        continue;
      }
      var sgc = this.toSGCoord(move.point, sz);
      if (move.color === glift.enums.states.BLACK) {
        if (!abpts) {
          abpts = sgc;
        } else {
          abpts += ' ' + sgc;
        }
      }
      if (move.color === glift.enums.states.WHITE) {
        if (!awpts) {
          awpts = sgc;
        } else {
          awpts += ' ' + sgc;
        }
      }
    }

    var boardLabels = '';
    for (var key in flat.labels()) {
      var coord = this.toSGCoord(
        glift.util.pointFromString(key), sz);
      var bl = coord + '=' + flat.labels()[key];
      if (!boardLabels) {
        boardLabels = bl;
      } else {
        boardLabels += ' ' + bl;
      }
    }

    if (boardLabels) {
      base += ' ' + boardLabels;
    }
    if (abpts) {
      base += ' ab="' + abpts + '"';
    }
    if (awpts) {
      base += ' aw="' + awpts + '"';
    }

    var marks = this.marksStr_(flat);
    for (var key in marks) {
      var str = marks[key];
      if (str) {
        base += ' ' + key + '="' + str + '"';
      }
    }

    return base;
  },

  /**
   * @param {!glift.flattener.Flattened} flat
   * @return {!Object<string, string>}
   * @private
   */
  marksStr_: function(flat) {
    var sz = flat.board().maxBoardSize();
    /** @type {!Object<glift.flattener.symbols, string>} */
    var markTypeMap = {};
    markTypeMap[glift.flattener.symbols.TRIANGLE] = 'tr';
    markTypeMap[glift.flattener.symbols.SQUARE] = 'sq';
    markTypeMap[glift.flattener.symbols.CIRCLE] = 'cr';
    markTypeMap[glift.flattener.symbols.XMARK] = 'ma';

    var markStr = {
      // Triangle
      'tr': '',
      // Square
      'sq': '',
      // Cross/xmark
      'ma': '',
      // Circle
      'cr': '',
    };
    for (var key in flat.marks()) {
      var coord = this.toSGCoord(glift.util.pointFromString(key), sz);
      var mark = flat.marks()[key];
      var sg = markTypeMap[mark];
      if (!sg) {
        // An known mark appears! Ignore
        continue;
      }
      if (markStr[sg]) {
        markStr[sg] += ' ' + coord;
      } else {
        markStr[sg] = coord;
      }
    }
    return markStr;
  },

  /**
   * Converts a normal Glift point into Smartgo coordinate.
   *
   * Note: smart go diagrams are indexed from the bottom left:
   * 19
   * 18
   * ..
   * 3
   * 2
   * 1
   *   A B C D E F G H J K ...
   *
   * As with Igo, I is skipped. Also, a strange property of SmartGo points is
   * that they are concatenated together: A1M10O4. This is 3 points: A1,M10,O4.
   *
   * @param {!glift.Point} pt
   * @param {number} size
   * @return string
   */
  toSGCoord: function(pt, size) {
    if (!pt) { throw new Error('No point'); }
    if (!size) { throw new Error('No board size'); }
    if (pt.x() < 0 || pt.y() < 0 || pt.x() > size-1 || pt.y() > size-1) {
      throw new Error('Pt out of bounds: ' + pt.toString());
    }
    var letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    var x = letters.charAt(pt.x());
    var y = size - pt.y();
    return x+y;
  },

  /**
   * Render-inline some inline text with smartgo
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return '';
  }
};

// Enabled the Renderer!
gpub.diagrams.enabledRenderers['SMARTGO'] = function() {
  return new gpub.diagrams.smartgo.Renderer();
};

goog.provide('gpub.diagrams.smartgo.SymbolTable');


/**
 * Mapping from Flattener symbol to SmartGo symbol.
 * @type{!Object<string, string>}
 */
gpub.diagrams.smartgo.SymbolTable = {
  TRIANGLE: 'tr',
  SQUARE: 'sq',
  XMARK: 'ma',
  CIRCLE: 'cr',
};

goog.provide('gpub.diagrams.svg');

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
 * - http://svgpocketguide.com/
 */
gpub.diagrams.svg = {
};

/**
 * Create the background lines. These are create at each individual intersection
 * rather than as a whole so that we can clear theme out when we to draw marks
 * on the raw board (rather than on stones).
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints Board points object.
 * @param {!glift.flattener.BoardPt} bpt
 */
gpub.diagrams.svg.lines = function(svg, boardPoints, bpt) {
  gpub.diagrams.svg.intersectionLine(
    svg, bpt, boardPoints.radius, boardPoints.numIntersections);
};

/**
 * @param {!glift.flattener.BoardPt} boardPt
 * @param {!number} radius Size of the space between the lines
 * @param {!number} numIntersections Number of intersections on the board.
 */
gpub.diagrams.svg.intersectionLine = function(
    svg, boardPt, radius, numIntersections) {
  // minIntersects: 0 indexed,
  // maxIntersects: 0 indexed,
  // numIntersections: 1 indexed (it's the number of intersections)
  var minIntersects = 0,
      maxIntersects = numIntersections - 1,
      coordinate = boardPt.coordPt,
      intPt = boardPt.intPt,
      svgpath = glift.svg.pathutils;
  var top = intPt.y() === minIntersects ?
      coordinate.y() : coordinate.y() - radius;
  var bottom = intPt.y() === maxIntersects ?
      coordinate.y() : coordinate.y() + radius;
  var left = intPt.x() === minIntersects ?
      coordinate.x() : coordinate.x() - radius;
  var right = intPt.x() === maxIntersects ?
      coordinate.x() : coordinate.x() + radius;

  var vline =
      // Vertical Line
      svgpath.move(coordinate.x(), top) + ' '
      + svgpath.lineAbs(coordinate.x(), bottom);

  var hline =
      // Horizontal Line
      svgpath.move(left, coordinate.y()) + ' '
      + svgpath.lineAbs(right, coordinate.y());

  if ((intPt.x() === minIntersects || intPt.x() === maxIntersects) &&
      (intPt.y() === minIntersects || intPt.y() === maxIntersects)) {
    // both are edge-lines (corner)
    svg.append(glift.svg.path()
      .setAttr('class', 'nl')
      .setAttr('d', vline + ' ' + hline));
  } else if (intPt.x() === minIntersects || intPt.x() === maxIntersects)  {
    // v-line is an edge
    svg.append(glift.svg.path()
      .setAttr('class', 'el')
      .setAttr('d', vline));
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', hline));
  } else if (intPt.y() === minIntersects || intPt.y() === maxIntersects) {
    // h-line is an edge
    svg.append(glift.svg.path()
      .setAttr('class', 'el')
      .setAttr('d', hline));
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', vline));
  } else {
    // both are center-lines
    svg.append(glift.svg.path()
      .setAttr('class', 'cl')
      .setAttr('d', vline + ' ' + hline));
  }
};

/**
 * Add a mark of a particular type to the GoBoard
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} boardPoints
 * @param {!glift.flattener.BoardPt} bpt
 * @param {!glift.enums.marks} mark
 * @param {string} label
 * @param {!glift.enums.states} stoneColor
 */
gpub.diagrams.svg.mark = function(
    svg, boardPoints, bpt, mark, label, stoneColor) {
  var svgpath = glift.svg.pathutils;
  var rootTwo = 1.41421356237;
  var rootThree = 1.73205080757;
  var marks = glift.enums.marks;
  var coordPt = bpt.coordPt;
  var fudge = boardPoints.radius / 8;

  var clazz = '';
  if (stoneColor == glift.enums.states.BLACK) {
    // Implies white labels, since
    if (label) {
      clazz = 'wl';
    } else {
      clazz = 'wm';
    }
  } else {
    // Default to black, since it's used for stones and empty intersections.
    if (label) {
      clazz = 'bl';
    } else {
      clazz = 'bm';
    }
  }

  // TODO(kashomon): Make these configurable ?
  var strokeWidth = 1;
  var fontSizeMultip = 0.7; // Really, a multiplier.
  var fill = 'black';
  var stroke = 'black';

  if (stoneColor === glift.enums.states.BLACK) {
    strokeWidth = strokeWidth * 0.4;
  }

  if (mark === marks.LABEL
      || mark === marks.VARIATION_MARKER
      || mark === marks.CORRECT_VARIATION
      || mark === marks.LABEL_ALPHA
      || mark === marks.LABEL_NUMERIC) {

    // If the labels are 3 digits, we make them a bit smaller to fit on the
    // stones.
    var threeDigitMod = label.length >= 3 ? 0.75 : 1;
    var textmark = glift.svg.text()
        .setText(label)
        .setAttr('class', clazz)
        .setAttr('dy', '.33em') // for vertical centering
        .setAttr('x', coordPt.x()) // x and y are the anchor points.
        .setAttr('y', coordPt.y())
        .setAttr('font-size',
            threeDigitMod * boardPoints.spacing * fontSizeMultip);
    if (strokeWidth != 1) {
      textmark.setAttr('stroke-width', strokeWidth)
    }
    svg.append(textmark);

  } else if (mark === marks.SQUARE) {
    var baseDelta = boardPoints.radius / rootTwo;
    // If the square is right next to the stone edge, it doesn't look as nice
    // as if it's offset by a little bit.
    var halfWidth = baseDelta - fudge;
    svg.append(glift.svg.rect()
        .setAttr('class', clazz)
        .setAttr('x', coordPt.x() - halfWidth)
        .setAttr('y', coordPt.y() - halfWidth)
        .setAttr('width', 2 * halfWidth)
        .setAttr('height', 2 * halfWidth));

  } else if (mark === marks.XMARK) {
    var baseDelta = boardPoints.radius / rootTwo;
    var halfDelta = baseDelta - fudge;
    var topLeft = coordPt.translate(-1 * halfDelta, -1 * halfDelta);
    var topRight = coordPt.translate(halfDelta, -1 * halfDelta);
    var botLeft = coordPt.translate(-1 * halfDelta, halfDelta);
    var botRight = coordPt.translate(halfDelta, halfDelta);
    svg.append(glift.svg.path()
        .setAttr('class', clazz)
        .setAttr('d',
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(topLeft) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(topRight) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(botLeft) + ' ' +
            svgpath.movePt(coordPt) + ' ' +
            svgpath.lineAbsPt(botRight)));
  } else if (mark === marks.CIRCLE) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 2));
  } else if (mark === marks.STONE_MARKER) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 3)
        .setAttr('fill', fill));
  } else if (mark === marks.TRIANGLE) {
    var r = boardPoints.radius - boardPoints.radius / 5;
    var rightNode = coordPt.translate(r * (rootThree / 2), r * (1 / 2));
    var leftNode  = coordPt.translate(r * (-1 * rootThree / 2), r * (1 / 2));
    var topNode = coordPt.translate(0, -1 * r);
    svg.append(glift.svg.path()
        .setAttr('class', clazz)
        .setAttr('d',
            svgpath.movePt(topNode) + ' ' +
            svgpath.lineAbsPt(leftNode) + ' ' +
            svgpath.lineAbsPt(rightNode) + ' ' +
            svgpath.lineAbsPt(topNode)));
  } else if (mark === marks.KO_LOCATION) {
    svg.append(glift.svg.circle()
        .setAttr('class', clazz)
        .setAttr('cx', coordPt.x())
        .setAttr('cy', coordPt.y())
        .setAttr('r', boardPoints.radius / 2)
        .setAttr('opacity', 0.5)
        .setAttr('fill', 'none')
        .setAttr('stroke', stroke));
  } else {
    // do nothing.  I suppose we could throw an exception here.
  }
};

/**
 * Create the star points.  See boardPoints.starpoints() for details about which
 * points are used
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} bps
 * @param {!glift.flattener.BoardPt} bpt
 */
gpub.diagrams.svg.starpoint = function(svg, bps, bpt) {
  var size = 0.15 * bps.spacing;
  var coordPt = bpt.coordPt;
  svg.append(glift.svg.circle()
    .setAttr('cx', coordPt.x())
    .setAttr('cy', coordPt.y())
    .setAttr('r', size)
    .setAttr('class', 'sp'));
};

/**
 * Create the Go stones.  They are initially invisible to the user, but they
 * all exist at the time of GoBoard creation.
 *
 * @param {!glift.svg.SvgObj} svg Base svg obj
 * @param {!glift.flattener.BoardPoints} bps
 * @param {!glift.flattener.BoardPt} pt
 * @param {!glift.enums.states} color the color of the stone
 */
gpub.diagrams.svg.stone = function(svg, bps, pt, color) {
  var circ = glift.svg.circle()
    .setAttr('cx', pt.coordPt.x())
    .setAttr('cy', pt.coordPt.y())
    .setAttr('fill', color.toLowerCase());
  if (color === glift.enums.states.WHITE) {
    circ.setAttr('class', 'ws')
      .setAttr('r', bps.radius - .4); // subtract for stroke
  } else {
    circ.setAttr('r', bps.radius)
      .setAttr('class', 'bs')
  }
  svg.append(circ);
};

goog.provide('gpub.diagrams.svg.Renderer');

/**
 * The diagrams-specific renderer for svg.
 * @constructor @final @struct
 */
gpub.diagrams.svg.Renderer = function() {};

gpub.diagrams.svg.Renderer.prototype = {
  /**
   * Create an SVG diagarm from a flattened object.
   * @param {!glift.flattener.Flattened} flat
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The rendered diagram.
   */
  render: function(flat, opt) {
    var spz = opt.goIntersectionSize || 20;
    var spacing = gpub.util.size.parseSizeToPt(spz);
    var bps = glift.flattener.BoardPoints.fromFlattened(flat, spacing);
    var data = bps.data();
    var board = flat.board();
    var sym = glift.flattener.symbols;

    var svg = glift.svg.svg()
      .setStyle(gpub.diagrams.svg.style(flat));

    for (var i = 0; i < data.length; i++) {
      var bpt = data[i];
      var ion = board.getIntBoardPt(bpt.intPt);
      // For marks, a white stone is equivalent to an empty stone.
      var stoneCol = glift.enums.states.WHITE;
      if (ion.stone()) {
        if (ion.stone() === sym.BSTONE) {
          stoneCol = glift.enums.states.BLACK;
        }
        gpub.diagrams.svg.stone(svg, bps, bpt, stoneCol);
      } else if (!ion.textLabel()) {
        // Render lines/starpoints if there's no stone && no text-label intersection
        gpub.diagrams.svg.lines(svg, bps, bpt);
        if (ion.base() == sym.CENTER_STARPOINT) {
          gpub.diagrams.svg.starpoint(svg, bps, bpt);
        }
      }

      if (ion.mark()) {
        var label = ion.textLabel() || '';
        var gmark = glift.flattener.symbolMarkToMark[ion.mark()];
        gpub.diagrams.svg.mark(svg, bps, bpt, gmark, label, stoneCol);
      }
    }
    return svg.render();
  },

  /**
   * This isn't really possible with SVG, but it might be possible to rely on a
   * font for inline-rendering. Note that inline-rendering is overloaded here
   * because for SVG, this means raw inclusion in HTML, and here I mean
   * processing text like 'Black 6' into stone-images within the text.
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt
   * @return {string} The processed text
   */
  renderInline: function(text, opt) {
    return text;
  }
};

// Enabled the Renderer.
gpub.diagrams.enabledRenderers['SVG'] = function() {
  return new gpub.diagrams.svg.Renderer();
};

/**
 * Return the style modifications
 * @param {!glift.flattener.Flattened} flat
 * @return {string}
 */
gpub.diagrams.svg.style = function(flat) {
  var out =
    // Black Stone
    '.bs { fill: black; }\n' +

    // White Stone
    '.ws { stroke: black; }\n' +

    // Center line
    '.cl {\n' +
    '  stroke: black;\n' +
    '  stroke-width: 1;\n' +
    '}\n' +

    // Edge line
    '.el {\n' +
    '  stroke: black;\n' +
    '  stroke-width: 2.5;\n' +
    '}\n' +

    // corner line
    '.nl {\n' +
    '  stroke-linecap: round;\n' +
    '  stroke: black;\n' +
    '  stroke-width: 2.5;\n' +
    '}\n' +

    // Starpoint
    '.sp { fill: black; }\n';

  if (Object.keys(flat.labels()).length > 0) {
    out +=
      // Black Label
      '.bl {\n' +
      '  fill: black;\n' +
      '  stroke: black;\n' +
      '  text-anchor: middle;\n' +
      '  font-family: sans-serif;\n' +
      '  font-style: normal;\n' +
      ' }\n' +

      // White Label
      '.wl {\n' +
      '  fill: white;\n' +
      '  stroke: white;\n' +
      '  text-anchor: middle;\n' +
      '  font-family: sans-serif;\n' +
      '  font-style: normal;\n' +
      '}\n';
  }

  if (Object.keys(flat.labels()).length > 0) {
    out +=
      // Black mark
      '.bm {\n' +
      '  fill: none;\n' +
      '  stroke-width: 2;\n' +
      '  stroke: black;\n' +
      '}\n' +

      // White mark
      '.wm {\n' +
      '  fill: none;\n' +
      '  stroke-width: 2;\n' +
      '  stroke: white;\n' +
      '}\n';
  }

  return out;
};

goog.provide('gpub.util');

/**
 * GPub utilities.
 */
gpub.util = {};

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

goog.provide('gpub.util.MoveTreeCache');

/**
 * Movetree cache
 * @param {(!Object<string, string>)=} opt_sgfMapping
 * @param {(!Object<string, glift.rules.MoveTree>)=} opt_mtCache
 * @constructor @struct @final
 */
gpub.util.MoveTreeCache = function(opt_sgfMapping, opt_mtCache) {
  /**
   * Reference to the SGF mapping, for convenience.
   *
   * We assume SGFs are immutable once passed in, as is the SGF Mapping. Thus
   * we don't copy the map here.
   * @type {!Object<string, string>}
   */
  this.sgfMap = opt_sgfMapping || {};

  /**
   * @type {!Object<string, !glift.rules.MoveTree>} mapping from alias to
   *    movetree.
   */
  this.mtCache = opt_mtCache || {};
};

gpub.util.MoveTreeCache.prototype = {
  /**
   * Get a movetree. If a movetree can't be found, throw an exception -- that
   * means an alias hasn't been provided.
   * @param {string} alias
   * @return {!glift.rules.MoveTree}
   */
  get: function(alias) {
    var mt = this.mtCache[alias];
    if (mt) {
      return mt;
    }
    if (this.sgfMap[alias]) {
      var str = this.sgfMap[alias];
      mt = glift.parse.fromString(str);
      this.mtCache[alias] = mt;
    } else {
      throw new Error('No SGF found for alias in sgfMap: ' + alias);
    }
    return mt.getTreeFromRoot();
  }
};

gpub.util.size = {
  /** Various conversion helpers. */
  /**
   * @param {number} ptSize
   * @return {number} Size in inches
   */
  ptToIn: function(ptSize) { return ptSize * (1 / 72); },
  /**
   * @param {number} ptSize
   * @return {number} Size in mm
   */
  ptToMm: function(ptSize) { return ptSize * 0.3528; },

  /**
   * @param {number} mmSize
   * @return {number} Size in pt
   */
  mmToPt: function(mmSize) { return mmSize * (1 / 0.3528); },
  /**
   * @param {number} inSize
   * @return {number} Size in pt
   */
  inToPt: function(inSize) { return inSize * 72 ; },

  /**
   * @param {number} inSize
   * @return {number} Size in mm
   */
  inToMm: function(inSize) { return inSize * 25.4; },
  /**
   * @param {number} mmSize
   * @return {number} Size in in
   */
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
   * @param {number|string} sizeOrNum
   * @return {number}
   */
  parseSizeToPt: function(sizeOrNum) {
    if (typeof sizeOrNum === 'number') {
      // Assume already in point.
      return /** @type {number} */ (sizeOrNum);
    }
    var sizeString = /** @type {string} */ (sizeOrNum);
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

goog.provide('gpub.book');

gpub.book = {
};

goog.provide('gpub.book.File');

/**
 * Represents a file that should be written to disk. Some books (like ebooks)
 * are aggregates of multiple files.
 *
 * For mimetype, the most common will be
 *
 * - application/xhtml+xml
 * - image/svg+xml
 * - text/css
 *
 * @typedef {{
 *  contents: string,
 *  path: (string|undefined),
 *  mimetype: (string|undefined),
 *  id: (string|undefined),
 * }}
 */
gpub.book.File;

goog.provide('gpub.book.BookMaker');
goog.provide('gpub.book.PositionConfig');


/**
 * Position config for an ID. Really, this is a convenince helper so have
 * several things to store in our ID map.
 *
 * @param {!gpub.spec.Position} pos
 * @param {!gpub.diagrams.Metadata} meta
 * @param {!string} diagram
 * @param {!Object<string, boolean>} labelSet
 * @param {number} index The base position index.
 *
 * @struct @final @constructor
 */
gpub.book.PositionConfig = function(pos, meta, diagram, labelSet, index) {
  /** @const {string} */
  this.id = pos.id;

  /**
   * The position object that generated this position. Sometimes useful for
   * debugging, but not usually useful for rendering.
   * @const {!gpub.spec.Position}
   */
  this.position = pos;

  /**
   * Diagram metadata configuration for this position.
   * @const {!gpub.diagrams.Metadata}
   */
  this.metadata = meta;

  /**
   * Optional diagram. This will be an empty string if streaming-rendering was
   * used.
   * @const {string}
   */
  this.diagram = diagram;

  /** @const {!Object<string, boolean>} */
  this.labelSet = labelSet;

  /**
   * The index of the base position; I.e., this is a way to track the index of
   * the non-generated positions. Practically, this should be the index of the
   * original SGF that this position came from.
   * @const {number}
   */
  this.basePosIndex = index;
};


gpub.book.PositionConfig.prototype = {
  /**
   * Creates a full move + collision caption from the diagram metadata.
   * If on the main path, has the form:
   *    (Moves 1-3)
   *    Black 10, White 13 at a
   *    Black 14 at 5
   *
   * Otherwise, just an ordinary collision annotation
   *    Black 10, White 13 at a
   *    Black 14 at 5
   * unless there are no collisions, in which case empty string is returned.
   * @return {string}
   */
  fullAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.fullLabelFromCollisions(
      m.collisions,
      m.isOnMainPath,
      m.startingMoveNum,
      m.endingMoveNum);
  },

  /**
   * Creates a collision annotation. Has the form
   *    Black 10, White 13 at a
   *    Black 14 at 5
   * unless there are no collisions, in which case empty string is returned.
   * @return {string}
   */
  collisionAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.labelFromCollisions(m.collisions);
  },

  /**
   * Creates a move-number annotation. Has the form:
   *    (Moves 1-3)
   * @return {string}
   */
  moveNumberAnnotation: function() {
    var m = this.metadata;
    return glift.flattener.labels.constructMoveLabel(
        m.startingMoveNum, m.endingMoveNum);
  },

  /**
   * Returns true/false whether this position has a label.
   * @param {string} label
   * @return {boolean}
   */
  hasLabel: function(label) {
    return !!this.labelSet[label];
  },
};


/**
 * Book maker helper. Contains helpful methods for making books.
 *
 * @param {!gpub.spec.Grouping} rootGrouping The root position grouping
 * @param {!gpub.diagrams.Rendered} rendered The diagram wrapper
 *
 * @struct @final @constructor
 */
gpub.book.BookMaker = function(rootGrouping, rendered) {
  /** @private {number} */
  this.seenPos_ = 0;

  /** @const @private {!Object<string, !gpub.book.PositionConfig>} */
  this.idToConfig_ = {};

  /** @const @private {!Object<string, string>} */
  this.diagrams_ = {};

  /** @const @private {!Object<string, !gpub.diagrams.Metadata>} */
  this.diagramMeta_ = {};

  /**
   * An ordered list of all the position ids.
   * @private {!Array<string>}
   */
  this.posIds_ = [];

  this.initLookupsFromRendered_(rendered);
  this.initFromGrouping_(rootGrouping);
};


gpub.book.BookMaker.prototype = {
  /**
   * Looping functionality. Loop over each Position ID and Position Config.
   * @param {function(number, !gpub.book.PositionConfig)} fn Processing
   *  Function that has the form:
   *    - Diagram index
   *    - Position config
   */
  forEachDiagram: function(fn) {
    for (var i = 0; i < this.posIds_.length; i++) {
      var id = this.posIds_[i];
      var config = this.getConfig(id);
      if (!config) {
        throw new Error('Null config when looping! Should be impossible.');
      }
      fn(i, config);
    }
  },

  /**
   * Gets the position id from an index. Returns an empty string if no ID can
   * be found.
   * @param {number} num
   * @return {string} the position ID
   */
  idFromIdx: function(num) {
    return this.posIds_[num] || '';
  },

  /**
   * Gets the position config for an ID.
   * @param {string} id
   * @return {?gpub.book.PositionConfig} The relevant position config or null if
   * none was found.
   */
  getConfig: function(id) {
    return this.idToConfig_[id] || null;
  },

  /**
   * Replace some text with inline go stones (possibly). This doesn't work for
   * all rendering types, but is a nice addition especially for commentary.
   * @param {gpub.diagrams.Type} dtype
   * @param {string} text
   * @param {!gpub.api.DiagramOptions} opt_diagramOpts
   * @return {string} The rendered text
   */
  renderInline: function(dtype, text, opt_diagramOpts) {
    var opt = opt_diagramOpts || {};
    return gpub.diagrams.Renderer.typeRenderer(dtype).renderInline(text, opt);
  },

  /**
   * Create a new latex helper.
   * @return {!gpub.book.latex.LatexHelper}
   */
  latexHelper: function() {
    return new gpub.book.latex.LatexHelper();
  },

  /////////////////////
  // Private helpers //
  /////////////////////

  /**
   * Initialize the position config from the rendered data.
   * @param {!gpub.diagrams.Rendered} ren Rendered wrapper
   * @private
   */
  initLookupsFromRendered_: function(ren) {
    for (var i = 0; i < ren.metadata.length; i++) {
      var m = ren.metadata[i];
      this.diagramMeta_[m.id] = m;
    }
    for (var i = 0; i < ren.diagrams.length; i++) {
      var d = ren.diagrams[i];
      if (d.rendered) {
        this.diagrams_[d.id] = d.rendered;
      }
    }
  },

  /**
   * Initialization function called in the book-maker constructor.
   * @param {!gpub.spec.Grouping} group
   * @private
   */
  initFromGrouping_: function(group) {
    for (var i = 0; i < group.positions.length; i++) {
      this.seenPos_++;
      var index = this.seenPos_;
      var pos = group.positions[i];
      var gen = group.generated[pos.id];

      /**
       * @param {!gpub.spec.Position} p
       */
      var processPos = function(p) {
        var meta = this.diagramMeta_[p.id];
        if (!meta) {
          throw new Error('Couldn\'t find diagram metadata for ID ' + p.id);
        }
        var labelSet = {};
        for (var k = 0; k < p.labels.length; k++) {
          labelSet[p.labels[k]] = true;
        }
        var diagramStr = this.diagrams_[p.id] || '';

        var config = new gpub.book.PositionConfig(
          p, meta, diagramStr, labelSet, index);
        this.idToConfig_[p.id] = config;
        this.posIds_.push(p.id);
      }.bind(this);

      if (!gen) {
        // There are no generated positions. Consider just the non-generated position.
        processPos(pos);
      } else {
        for (var j = 0; j < gen.positions.length; j++) {
          processPos(gen.positions[j]);
        }
      }

      // Hopefully the user hasn't created a data structure with loops.
      for (var m = 0; m < group.groupings.length; m++) {
        this.initFromGrouping_(group.groupings[m]);
      }
    }
  },
};

goog.provide('gpub.book.PageSize');
goog.provide('gpub.book.pageDimensions');
goog.provide('gpub.book.PageDim');


goog.scope(function() {

/**
 * Some predefined page sizes for convenince.
 * @enum {string}
 */
gpub.book.PageSize = {
  A4: 'A4',
  /** Standard printer paper. */
  LETTER: 'LETTER',
  /**
   * 6x9. Octavo is probably the most common size for professionally printed go
   * books.
   */
  OCTAVO: 'OCTAVO',
  /**
   * 5x7 paper. Doesn't have an official name, as far as I know, so we'll call
   * it Notecard.
   */
  NOTECARD: 'NOTECARD',

  /** Miscellaneous sizes, named by the size. */
  EIGHT_TEN: 'EIGHT_TEN',
  FIVEFIVE_EIGHTFIVE: 'FIVEFIVE_EIGHTFIVE',
};

/**
 * @typedef{{
 *  heightMm: number,
 *  widthMm: number,
 *  heightIn: number,
 *  widthIn: number
 * }}
 */
gpub.book.PageDim;

/**
 * Mapping from page-size to col-maping.
 *
 * Note: height and width in mm.
 * @type {Object<gpub.book.PageSize,gpub.book.PageDim>}
 *
 */
gpub.book.pageDimensions = {};

var pd = gpub.book.pageDimensions;
var ps = gpub.book.PageSize;

pd[ps.A4] = {
  heightMm: 297,
  widthMm: 210,
  widthIn: 8.268,
  heightIn: 11.693
};
pd[ps.LETTER] = {
 heightMm: 280,
  widthMm: 210,
  heightIn: 11,
  widthIn: 8.5
};
pd[ps.OCTAVO] = {
  heightMm: 229,
  widthMm: 152,
  heightIn: 9,
  widthIn: 6
};
pd[ps.NOTECARD] = {
  heightMm: 178,
  widthMm: 127,
  heightIn: 7,
  widthIn: 5
};
pd[ps.EIGHT_TEN] = {
  heightMm: 254,
  widthMm: 203,
  heightIn: 10,
  widthIn: 8
};
pd[ps.FIVEFIVE_EIGHTFIVE] = {
  heightMm: 216,
  widthMm: 140,
  heightIn: 8.5,
  widthIn: 5.3
};

})  // goog.scope

goog.provide('gpub.book.epub');

/**
 * Tools for generating EPub ebooks.
 *
 * Some tools:
 * - Kindle-gen tool: https://www.amazon.com/gp/feature.html?docId=1000765211
 * - Epub-checking tool: https://github.com/IDPF/epubcheck
 *
 * Some resources:
 * - Kindle format: https://www.amazon.com/gp/feature.html?docId=1000729511
 * - Epub wikipedia: https://en.wikipedia.org/wiki/EPUB
 * - Worked Epub example: http://www.hxa.name/articles/content/epub-guide_hxa7241_2007.html
 *
 * Specs:
 * - EPub Specs: http://idpf.org/epub
 * - EPub SVG Spec: http://www.idpf.org/epub/301/spec/epub-contentdocs.html#sec-svg
 * - EPub Standard: http://idpf.org/epub
 * - EPub 3.0.1 standard: http://idpf.org/epub/301
 * - EPub OPF Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
 *
 * Notes:
 * - currently no sanitization is done on inputs, so you must trust your inputs.
 * - it will generally be preferable to control page breaks for go
 * diagrams directly with directly with CSS:
 * .group {
 *   page-break-inside: {avoid|always}
 *   page-break-before: {avoid|always}
 *   page-break-after: {avoid|always}
 * } 
 */
gpub.book.epub = {
  /**
   * Returns the mimetype file. Static. Must be the first file in the epub-zip
   * file.
   * @return {!gpub.book.File}
   */
  mimetype: function() {
    return {
      contents: 'application/epub+zip',
      path: 'mimetype',
    };
  },

  /**
   * Returns the XML container file. Static. A reference to the OPF file.
   * @return {!gpub.book.File}
   */
  container: function() {
    var contents =
      '<?xml version="1.0" encoding="UTF-8" ?>\n' +
      '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n' +
      '  <rootfiles>\n' +
      '    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n' +
      '  </rootfiles>\n' +
      '</container>';

    return {
      contents: contents,
      path: 'META-INF/container.xml',
    }
  },

  /**
   * Creates the content.opf file, which has all the interesting metadata.
   *
   * See the following for more info:
   * - Spec: http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @param {!Array<!gpub.book.File>} files
   * @param {!Array<string>} spineIds
   * @return {!gpub.book.File}
   */
  opfContent: function(opt, files, spineIds) {
    if (!opt) {
      throw new Error('Options must be defined');
    }
    if (!files || !files.length > 0) {
      throw new Error('Files must be defined and > 0. Was: '
          + JSON.stringify(files));
    }
    if (!spineIds || !spineIds.length > 0) {
      throw new Error('Spine IDs must be defined and > 0. Was: '
          + JSON.stringify(spineIds));
    }

    var buffer = '<?xml version="1.0"?>\n' +
      '\n' +
      '<package xmlns="http://www.idpf.org/2007/opf" ' +
          'unique-identifier="' + opt.id + '" version="2.0">"\n' +
      '\n';

    buffer += gpub.book.epub.opfMetadata(opt)
     + '\n'
     + gpub.book.epub.opfManifest(files)
     + '\n'
     + gpub.book.epub.opfSpine(files, spineIds)
     + '\n'
     + gpub.book.epub.opfGuide(opt)
     + '\n'
     + '</package>\n';

    return {
      contents: buffer,
      path: 'OEBPS/content.opf',
    }
  },

  /**
   * Generates the OPF Metadata.
   *
   * Publication metadata (title, author, publisher, etc.).
   *
   * For more details about the fields, see:
   * http://dublincore.org/documents/2004/12/20/dces/
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string} The metadata block.
   */
  opfMetadata: function(opt) {
    var content =
      '  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" \n' +
      '    xmlns:dcterms="http://purl.org/dc/terms/"\n' +
      '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
      '    xmlns:opf="http://www.idpf.org/2007/opf">\n' +
      '    <dc:title>' + opt.title + '</dc:title>\n' +
      '    <dc:language xsi:type="dcterms:RFC3066">' + opt.lang + '</dc:language>\n' +
      '    <dc:subject>' + opt.subject + '</dc:subject>\n' +
      '    <dc:rights>' + opt.rights + '</dc:rights>\n' +
      '    <dc:date opf:event="generation">' + opt.generationDate + '</dc:date>\n';

    if (opt.description) {
      content +=
      '    <dc:description>' + opt.description + '</dc:description>\n';
    }

    if (opt.isbn) {
      content +=
      '    <dc:identifier id="' + opt.id + '" opf:scheme="ISBN">\n' +
          opt.isbn + '</dc:identifier>\n';
    } else {
      content +=
      '    <dc:identifier id="' + opt.id + '" opf:scheme="URI">' + opt.uriId +
          '</dc:identifier>\n';
    }

    if (opt.relation) {
      content +=
      '    <dc:relation>' + opt.relation + '</dc:relation>\n';
    }
    if (opt.publisher) {
      content +=
      '    <dc:publisher>' + opt.publisher + '</dc:publisher>\n';
    }
    if (opt.creator) {
      content +=
      '    <dc:creator>' + opt.creator + '</dc:creator>\n';
    }
    if (opt.publicationDate) {
      content +=
      '    <dc:date opf:event="publication">' + opt.publicationDate + '</dc:date>\n';
    }
    content +=
      '  </metadata>\n';

    return content;
  },

  /**
   * Generates the OPF Manifest.
   *
   * A list of files (documents, images, style sheets, etc.) that make up the
   * publication. The manifest also includes fallback declarations for files of
   * types not supported by this specification.
   *
   * @param {!Array<!gpub.book.File>} files
   * @return {string}
   */
  opfManifest:  function(files) {
    var out = '  <manifest>\n'
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      if (!f.path || !f.mimetype || !f.id) {
        throw new Error('EPub Manifest files must hava a path, mimetype, and ID. ' +
            'File [' + i + '] was: ' + JSON.stringify(f));
      }
      out += '    <item id="' + f.id + '" href="' + f.path
        + '" media-type="' + f.mimetype + '" />\n'
    }
    out += '  </manifest>\n';
    return out;
  },

  /**
   * Generates the OPF Spine.
   *
   * An arrangement of documents providing a linear reading order.
   * @param {!Array<!gpub.book.File>} files
   * @param {!Array<string>} spineIds
   * @return {string}
   */
  opfSpine: function(files, spineIds) {
    var out = '  <spine toc="ncx">\n';
    var fmap = {};
    for (var i = 0; i < files.length; i++) {
      fmap[files[i].id] = files[i];
    }
    for (var i = 0; i < spineIds.length; i++) {
      var id = spineIds[i];
      var file = fmap[id];
      if (!file) {
        throw new Error('For every spineId, there must exist a file in the manifest. '
            + 'Files: ' + JSON.stringify(files) + ' SpineIDs: ' + JSON.stringify(spineIds));
      }
      if (!(file.mimetype === 'application/xhtml+xml' ||
          file.mimetype === 'application/x-dtbook+xml')) {
        throw new Error('File mimetype must be application/xhtml+xml ' +
            'or application/x-dtbook+xml. Was: ' + file.mimetype);
      }
      // TODO(kashomon): Should this support non-linear readings? Might be
      // useful for problem-answers.
      out += '    <itemref idref="' + id + '" />\n';
    }
    out += '  </spine>\n';
    return out;
  },

  /**
   * Generates the OPF Guide. The guide is optional.
   *
   * A set of references to fundamental structural features of the publication,
   * such as table of contents, foreword, bibliography, etc.
   *
   * @param {!gpub.book.epub.EpubOptions} opt
   * @return {string}
   */
  opfGuide: function(opt) {
    return '<!-- OPF Guide would be here -->';
  },
};

goog.provide('gpub.book.epub.EpubOptions');

// TODO(kashomon): Generalize this and/or combine with book options.

/**
 * Options for ebook generation.
 * @param {!gpub.book.epub.EpubOptions=} opt_o
 * @constructor @struct @final
 */
gpub.book.epub.EpubOptions = function(opt_o) {
  var o = opt_o || {};

  if (!o.id) {
    throw new Error('Id was not defined. Options provided were: ' +
        JSON.stringify(o))
  }

  if (!o.title) {
    throw new Error('Title was not defined. Options provided were: ' +
        JSON.stringify(o))
  }

  /**
   * Should be an ISBN, if it's available.
   * @type {string}
   */
  this.id = o.id;

  /** @type {string} */
  this.isbn = o.isbn || '';

  /**
   * URI Identifier.
   * @type {string}
   */
  this.uriId = o.uriId || 'http://github.com/Kashomon/gpub';

  /** @type {string}  */
  this.title = o.title || '';

  /** @type {string} */
  this.lang = o.lang || 'en';

  /** @type {string} */
  this.subject = o.subject || 'Go, Baduk, Wei-qi, Board Games, Strategy Games';

  /** @type {string} */
  this.description = o.description || '';

  /** @type {string} */
  this.rights = o.rights || 'All Rights Reserved.'

  /** @type {string} */
  this.publisher = o.publisher || '';

  /** @type {string} */
  this.creator = o.creator || ''; // AKA Author.

  /** @type {string} */
  this.relation = o.relation || 'http://github.com/Kashomon/gpub';

  var dpad = function(dnum) {
    return dnum < 10 ? '0' + dnum : '' + dnum;
  }
  var d = new Date();
  /**
   * ISO 8601 Date String
   * @type {string}
   */
  this.generationDate = o.generationDate || (d.getUTCFullYear() +
      '-' + dpad(d.getUTCMonth() + 1) +
      '-' + dpad(d.getUTCDate()));

  /** @type {string} */
  this.publicationDate = o.publicationDate || '';
  if (this.publicationDate && (
      !/\d\d\d\d/.test(this.publicationDate) ||
      !/\d\d\d\d-\d\d-\d\d/.test(this.publicationDate))) {
    throw new Error('Publication date must have the form YYYY-MM-DD. ' +
        'Was: ' + this.publicationDate);
  }
};

goog.provide('gpub.book.latex');
goog.provide('gpub.book.latex.LatexHelper');

/*
 * LaTeX helper utilities.
 */
gpub.book.latex = {
  /**
   * Sanitizes latex input. This isn't particularly robust, but it is meant to
   * protect us against accidental problematic characters rather than malicious
   * user input.
   * @param {string} text LaTeX text to process.
   * @return {string} processed text
   * @package
   */
  sanitize: function(text) {
    return text
      .replace(/\\/g, '\\textbackslash')
      .replace(/[$}{%&]/g, function(match) {
        return '\\' + match;
      });
  },
};

/**
 * A Latex Helper to make rendering LaTeX books a bit easier.
 * @struct @final @constructor
 */
gpub.book.latex.LatexHelper = function() {};

gpub.book.latex.LatexHelper.prototype = {
  /**
   * Professional printing often requires that PDFs be compliant with PDF/X-1a
   * (or a similar standard). Here, we provide some headers for LaTeX that
   * should make this a bit easier. Note that this provides some goo to make a
   * document compliant, but it's still easy to screw up. In particular, adding
   * hyperlinks breaks PDF/X-1a compliance.
   *
   * @param {!gpub.book.latex.PdfxOptions} options for rendering the
   *    PDF/X-1a:2001 header.
   * @return {string}
   */
  pdfx1aHeader: function(options) {
    return gpub.book.latex.pdfx.header(options);
  },

  /**
   * Sanitizes latex input by transforming control characters into their escaped form.
   * @param {string} text LaTeX text to process.
   * @return {string} processed text
   */
  sanitize: function(text) {
    return gpub.book.latex.sanitize(text);
  },

  /**
   * Render some markdown as latex.
   * @param {string} text Markdown text to process
   * @param {!Object=} opt_overrides Optional object containing renderer-method
   *    overrides.
   * @return {gpub.book.latex.ProcMarkdown} rendered latex, split into the
   *    pramble (headers) and the body text.
   */
  renderMarkdown: function(text, opt_overrides) {
    return gpub.book.latex.renderMarkdown(text, opt_overrides);
  },
};

goog.provide('gpub.book.latex.ProcMarkdown');
goog.provide('gpub.book.latex.MarkdownBase');

/**
 * Processed markdown.
 * @typedef {{
 *   preamble: string,
 *   text: string
 * }}
 */
gpub.book.latex.ProcMarkdown;

/**
 * Creates a marked-Markdown renderer for LaTe, which relies on the Marked
 * library provided in the Glift functionality.
 * @param {!Object=} opt_overrides Optional object containing renderer-method
 *    overrides.
 * @return {!glift.markdown.Renderer}
 * @private
 */
gpub.book.latex.renderer_ = function(opt_overrides) {
  var renderer = new glift.marked.Renderer();
  for (var key in gpub.book.latex.MarkdownBase.prototype) {
    if (opt_overrides
        && opt_overrides[key]
        && typeof opt_overrides[key] === 'function') {
      renderer[key] = opt_overrides[key];
    } else {
      renderer[key] = gpub.book.latex.MarkdownBase.prototype[key].bind(renderer);
    }
  }
  renderer.preamble_ = [];
  return /** @type {!glift.markdown.Renderer} */ (renderer);
};

/**
 * Transforms markdown into LaTeX.
 * @param {string} str The text to process.
 * @param {!Object=} opt_overrides Optional object containing renderer-method
 *    overrides.
 * @return {!gpub.book.latex.ProcMarkdown}
 * @package
 */
gpub.book.latex.renderMarkdown = function(str, opt_overrides) {
  var renderer = gpub.book.latex.renderer_(opt_overrides)
  str = gpub.book.latex.sanitize(str);
  var opts = /** @type {!glift.marked.Options} */ ({
    renderer: renderer,
    silent: true
  });

  var extractPreamble = function(r) {
    return r.preamble_.join('\n');
  };

  var text = glift.marked(str, opts);
  // Now we need to post-process and escape #
  text = text.replace(/#/g, '\\#');
  return {
    preamble: extractPreamble(renderer),
    text: text
  };
};


/**
 * A constructor type to satify the compiler
 * @struct @constructor
 * @private
 */
gpub.book.latex.MarkdownBase = function() {
  this.preamble_ = [];
};

/** Set of markdown methods for the renderer */
gpub.book.latex.MarkdownBase.prototype = {
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
   * @param {string} text
   * @param {number} level
   * @return string
   */
  heading: function(text, level) {
    if (level === 1) {
      // this.preamble_.push('\\book{' + text + '}'); -- memoir only.
      this.preamble_.push('\\part{' + text + '}');
    } else if (level === 2) {
      this.preamble_.push('\\chapter{' + text + '}');
    } else if (level === 3) {
      this.preamble_.push('\\section{' + text + '}');
    } else if (level === 4) {
      this.preamble_.push('\\subsection{' + text + '}');
    } else {
      // A chapter heading without
      this.preamble_.push('\\subsection*{' + text + '}');
    }
    return ''; // Don't return anything. Header should be part of the preamble.
    // TODO(kashomon): Should \\section{...} go here?
  },

  /** @return {string} */
  hr: function() {
    return '\\hrule';
  },

  /**
   * @param {string} body
   * @param {boolean} ordered
   * @return string}
   */
  list: function(body, ordered) {
    if (ordered) {
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

  /**
   * @param {string} text
   * @return {string}
   */
  listitem: function(text) {
    return '\\item ' + text;
  },

  /**
   * @param {string} text
   * @return {string}
   */
  paragraph: function(text) {
    // Nothing special for paragraphs. Blank lines separate paragraphs in
    // LaTeX.
    return text + '\n\n';
  },

  ///////////////////////////////////
  // Inline level renderer methods //
  ///////////////////////////////////

  /**
   * @param {string} text
   * @return {string}
   */
  strong: function(text) {
    return '\\textbf{' +  text + '}';
  },

  /**
   * @param {string} text
   * @return {string}
   */
  em: function(text) {
    return '\\textit{' +  text + '}';
  },

  /**
   * @return {string}
   */
  br: function() {
    // TODO(kashomon): Should this be \\\\?
    return '\\newline{}';
  },

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   * @return {string}
   */
  // requires: \usepackage{hyperref}. Which can't be used with PDF/X-1a:2001
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
  /**
   * @param {string} code
   * @param {string} language
   * @return {string}
   */
  code: function(code, language) { return code; },
  /**
   * @param {string} quote
   * @return {string}
   */
  blockquote: function(quote) { return quote; },
  /**
   * @param {string} html
   * @return {string}
   */
  html: function(html) { return html; },
  // table: function(header, body) {return table},
  // tablerow: function(content) {},
  // tablecell: function(content, flags) {},
  /**
   * @param {string} code
   * @return {string}
   */
  codespan: function(code) { return code; },
  /**
   * @param {string} text
   * @return {string}
   */
  del: function(text) { return text; }
};

goog.provide('gpub.book.latex.pdfx');
goog.provide('gpub.book.latex.PdfxOptions');

/**
 * Package for Pdf/X-1a:2001 compatibility for Latex.
 *
 * This is a package to add support for the above mentioned compatibility, which
 * is required by some professional printers.
 *
 * Requirements (from http://www.prepressure.com/pdf/basics/pdfx-1a):
 *
 * http://tex.stackexchange.com/questions/242303/pdf-x-1a-on-tex-live-2014-for-publishing-with-pod-lightining-source
 *
 * Requirements that we care about:
 * - PDF/X-1a files are regular PDF 1.3
 * - All color data must be grayscale, CMYK or named spot colors. The file
 *   should not contain any RGB, LAB, data.
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
   * "PDF version is newer than 1.3"
   * @private {string}
   */
  pdfMinorVersion_: '\\pdfminorversion=3',

  /**
   * Fixes this error:
   * "Compressed object streams used"
   * @private {string}
   */
  compressLevel_: '\\pdfobjcompresslevel=0',

  /**
   * Fixes the error:
   * "OutputIntent for PDF/X missing"
   *
   * typicacally, the colorProfileFilePath should be something like:
   * 'ISOcoated_v2_300_eci.icc'
   * @param {string} colorProfileFilePath file-path to the color profile file.
   * @return {string}
   * @private
   */
  outputIntent_: function(colorProfileFilePath) {
    return '\\immediate\\pdfobj stream attr{/N 4} file{' + colorProfileFilePath + '}\n' +
      '\\pdfcatalog{%\n' +
      '/OutputIntents [ <<\n' +
      '/Type /OutputIntent\n' +
      '/S/GTS_PDFX\n' +
      '/DestOutputProfile \\the\\pdflastobj\\space 0 R\n' +
      '/OutputConditionIdentifier (ISO Coated v2 300 (ECI))\n' +
      '/Info(ISO Coated v2 300 (ECI))\n' +
      '/RegistryName (http://www.color.org/)\n' +
      '>> ]\n' +
      '}\n';
  },

  /**
   * Returns the PDF Info, which contains the title and spec (PDF/X-1a:2001)
   * Fixes:
   *  - "Document title empty/missing",
   *  - "PDF/X version key (GTS_PDFXVersion) missing"
   * @param {string} title of the work
   * @return {string}
   * @private
   */
  pdfInfo_: function(title) {
    return '\\pdfinfo{%\n' +
      '/Title(' + title + ')%\n' +
      '/GTS_PDFXVersion (PDF/X-1:2001)%\n' +
      '/GTS_PDFXConformance (PDF/X-1a:2001)%\n' +
      '}\n';
  },

  /**
   * Returns the relevant page boxes.
   * @param {number} hpt
   * @param {number} wpt
   * @return string
   * @private
   */
  pageBoxes_: function(hpt, wpt) {
    return '\\pdfpageattr{/MediaBox[0 0 ' + wpt + ' ' + hpt + ']\n' +
           '             /BleedBox[0 0 ' + wpt + ' ' + hpt + ']\n' +
           '             /TrimBox[0 0 ' + wpt + ' ' + hpt + ']}\n'
  },

  /**
   * Creates the appropriate header/metadata information for PDF/X-1a:2001
   * comptabible documents.
   *
   * Note: There are still other ways to break PDF/X-1a compatibility! You must
   * not, for example, include hyperlinks.
   * 
   * @param {!gpub.book.latex.PdfxOptions} opts
   * @return {string}
   */
  header: function(opts) {
    if (!opts.title) {
      throw new Error('title is required for PDF/X-1a header.');
    }
    if (!opts.colorProfileFile) {
      throw new Error('Color profile file path not specified:' +
          opts.colorProfileFile);
    }
    var wpt, hpt;
    if (opts.pageSize) {
      if (!gpub.book.PageSize[opts.pageSize]) {
        throw new Error('Page size not a member of gpub.book.PageSize. ' +
            opts.pageSize);
      }
      var pageObj = gpub.book.pageDimensions[opts.pageSize];
      hpt = gpub.util.size.mmToPt(pageObj.heightMm);
      wpt = gpub.util.size.mmToPt(pageObj.widthMm);
    } else if (opts.pageHeightPt && opts.pageWidthPt) {
      hpt = opts.pageHeightPt;
      wpt = opts.pageWidthPt;
    } else {
      throw new Error('Either pageSize must be defined or ' +
          'pageHeightPt and pageWidthPt must be defined. Options were: ' +
          opts);
    }
    return [
      gpub.book.latex.pdfx.pdfMinorVersion_,
      gpub.book.latex.pdfx.compressLevel_,
      gpub.book.latex.pdfx.pageBoxes_(hpt, wpt),
      gpub.book.latex.pdfx.pdfInfo_(opts.title),
      gpub.book.latex.pdfx.outputIntent_(opts.colorProfileFile)
    ].join('\n');
  }
};

/**
 * Options for constructing the PDF/X-1a header for latex. Note that one of
 * pageSize or (pageHeightPt,pageWidthPt) most be defined.
 *
 * title: Title of the work.
 * colorProfileFile: Path to a color profile file. Usually something like
 * 'ISOcoated_v2_300_eci.icc'
 * pageSize: Optional page size enum.
 * pageHeightPt: Optional page height in pt
 * pageWidthPt: Optional page width in pt
 *
 * @typedef {{
 *  title: string,
 *  colorProfileFile: string,
 *  pageSize: (undefined|gpub.book.PageSize),
 *  pageHeightPt: (undefined|number),
 *  pageWidthPt: (undefined|number),
 * }}
 */
gpub.book.latex.PdfxOptions;
