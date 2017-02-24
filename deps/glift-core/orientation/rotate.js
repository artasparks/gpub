goog.provide('glift.orientation.AutoRotateCropPrefs');

/**
 * Options for cropping
 * - What are the preferred cropping-regions.
 *
 *
 * @typedef {{
 *  corner: glift.enums.boardRegions,
 *  side: glift.enums.boardRegions,
 * }}
 */
glift.orientation.AutoRotateCropPrefs;

/**
 * Automatically rotate a movetree. Relies on findCanonicalRotation to find the
 * correct orientation.
 *
 * Size is determined by examining the sz property of the game.
 * @param {!glift.rules.MoveTree} movetree
 * @param {!glift.orientation.AutoRotateCropPrefs=} opt_prefs
 * @return {!glift.rules.MoveTree}
 */
glift.orientation.autoRotateCrop = function(movetree, opt_prefs) {
  var nmt = movetree.newTreeRef();
  var rotation = glift.orientation.findCanonicalRotation(movetree, opt_prefs);
  nmt.recurseFromRoot(function(mt) {
    var props = mt.properties();
    props.forEach(function(prop, vals) {
      var size = movetree.getIntersections();
      props.rotate(prop, size, rotation);
    });
  });
  return nmt;
};

/**
 * Calculates the desired rotation for a movetree, based on rotation
 * preferences and the movetrees quad-crop.
 *
 * Region ordering should specify what regions the rotation algorithm should
 * target. If not specified, defaults to TOP_RIGHT / TOP.
 *
 * This is primarily intended to be used for problems. It doesn't make sense to
 * rotate commentary diagrams.
 *
 * @param {!glift.rules.MoveTree} movetree
 * @param {!glift.orientation.AutoRotateCropPrefs=} opt_prefs
 * @return {!glift.enums.rotations} The rotation that should be performed.
 */
glift.orientation.findCanonicalRotation =
    function(movetree, opt_prefs) {
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

  var prefs = opt_prefs;
  if (!prefs) {
    prefs = {
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
      end = cornerRegions[prefs.corner];
    }

    if (sideRegions[region] !== undefined) {
      start = sideRegions[region];
      end = sideRegions[prefs.side];
    }

    var rot = (360 + start - end) % 360;
    switch(rot) {
      case 0: return rotations.NO_ROTATION;
      case 90: return rotations.CLOCKWISE_90;
      case 180: return rotations.CLOCKWISE_180;
      case 270: return rotations.CLOCKWISE_270;
      default: return rotations.NO_ROTATION;
    }
  }

  // No rotations. We only rotate when the quad crop region is either a corner
  // or a side.
  return rotations.NO_ROTATION;
};
