/**
 * NodeData object.
 */
gpub.book.NodeData = function(purpose) {
  if (!gpub.diagrams.diagramPurpose[purpose]) {
    throw new Error(
        'Purpose not defined in gpub.diagrams.diagramPurpose: ' + purpose)
  }
  this.purpose = purpose;
  this.chapterTitle = null;
};

/** Methods */
gpub.book.NodeData.prototype = {};

/**
 * Staticly creates NodeData based on some context.
 *
 * This method is pretty hacky and may need to be rethought.
 */
gpub.book.NodeData.fromContext = function(
    mt, flattened, sgfMetadata, idx) {
  var diagramPurpose = gpub.diagrams.diagramPurpose;
  var exampleType = gpub.spec.exampleType;
  var purpose = diagramPurpose.GAME_REVIEW;
  sgfMetadata = sgfMetadata || {};

  if (diagramPurpose[sgfMetadata.exampleType]) {
    purpose = sgfMetadata.exampleType;
  }

  if (mt.node().getNodeNum() === 0 &&
      sgfObj.nextMovesPath.length === 0) {
    purpose = gpub.diagrams.diagramPurpose.SECTION_INTRO;
  }

  // Try out the chapter-title stuff.
  if (flattened.isOnMainPath() && purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.GAME_REVIEW_CHAPTER;
  }

  var nodeData = new NodeData(purpose);

  if (purpose === gpub.diagrams.diagramPurpose.SECTION_INTRO) {
    // We're at the beginning of the game. Create a new section
    nodeData.sectionTitle =
        mt.getTreeFromRoot().properties().getOneValue('GN') || '';
    nodeData.chapterTitle = 'Chapter: ' + chapter;
    part++;
    chapter++;
  } else if (purpose === gpub.diagrams.diagramPurpose.GAME_REVIEW_CHAPTER) {
    nodeData.chapterTitle = 'Chapter: ' + chapter;
    chapter++;
  }
};
