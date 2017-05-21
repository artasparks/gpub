/**
 * Transform a raw grouping into a spec-grouping.
 * @param {!gpub.opts.RawGrouping} ingp
 * @param {!gpub.spec.IdGen} idGen
 * @return {!gpub.spec.Grouping} processed group
 */
gpub.spec.preprocessGrouping = function(ingp, idGen) {
  if (!ingp) {
    throw new Error('Grouping was undefined');
  }
  var newgp = new gpub.spec.Grouping();
  if (ingp.description) {
    newgp.description = ingp.description
  }
  if (ingp.title) {
    newgp.title = ingp.title
  }
  if (ingp.positionType) {
    var ptype = gpub.spec.PositionType[ingp.positionType];
    if (!ptype) {
      throw new Error('Provided position type ' + ingp.positionType +
          ' was unknown position type: ' + ptype);
    }
    newgp.positionType = ptype;
  }

  if (ingp.positions) {
    for (var i = 0; i < ingp.positions.length; i++) {
      newgp.positions.push(
          gpub.spec.preprocessPosition(ingp.positions[i], idGen));
    }
  }
  if (ingp.groupings) {
    for (var i = 0; i < ingp.groupings.length; i++) {
      newgp.groupings.push(
          gpub.spec.preprocessGrouping(ingp.groupings[i], idGen));
    }
  }
  return newgp;
};

/**
 * Preprocess a single raw-position and does parameter validation.
 * @param {!string|gpub.opts.RawPosition} rawPos
 * @param {!gpub.spec.IdGen} idGen
 * @return {!gpub.spec.Position}
 */
gpub.spec.preprocessPosition = function(rawPos, idGen) {
  var rawPosObj = /** @type {!gpub.opts.RawPosition} */ ({});
  var posOpt = /** @type {gpub.spec.PositionTypedef} */ ({});

  var alias = '';
  if (typeof rawPos === 'string') {
    alias = /** @type {string} */ (rawPos);
  } else if (typeof rawPos === 'object') {
    rawPosObj = /** @type {!gpub.opts.RawPosition} */ (rawPos);
    alias = rawPosObj.alias;
  } else {
    throw new Error('Bad type for grouping. ' +
        'Expected object or string but was: ' + typeof rawPos);
  }
  if (!alias) {
    throw new Error('SGF identifier (alias) ' +
        'must be defined. Was: ' + alias);
  }
  posOpt.alias = alias;

  var initPosStr = undefined;
  if (rawPos.initialPosition) {
    initPosStr = rawPos.initialPosition;
    var path = glift.rules.treepath.parseInitialPath(initPosStr);
    initPosStr = glift.rules.treepath.toInitPathString(path);
  }
  posOpt.initialPosition = initPosStr;

  var nextMovesStr = undefined;
  if (rawPos.nextMovesPath) {
    nextMovesStr = rawPos.nextMovesPath;
    var path = glift.rules.treepath.parseFragment(nextMovesStr);
    nextMovesStr = glift.rules.treepath.toFragmentString(path);
  }
  posOpt.nextMovesPath = nextMovesStr;

  var id = rawPosObj.id;
  if (!id) {
    id = idGen.next(alias, initPosStr, nextMovesStr);
  }
  posOpt.id = id;

  if (rawPosObj.positionType) {
    var ptype = gpub.spec.PositionType[rawPosObj.positionType];
    if (!ptype) {
      throw new Error('Provided position type ' + rawPos.positionType +
          ' was unknown position type: ' + ptype);
    }
    posOpt.positionType = ptype;
  }
  return new gpub.spec.Position(posOpt);
};
