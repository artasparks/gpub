/**
 * NodeData object.
 */
gpub.book.NodeData = function(purpose) {
  if (!gpub.diagrams.diagramPurpose[purpose]) {
    throw new Error(
        'Purpose not defined in gpub.diagrams.diagramPurpose: ' + purpose)
  }
  this.purpose = purpose;

  this.sectionTitle = null;
  this.sectionNumber = -1;

  this.chapterTitle = null;
  this.chapterNumber = -1;
};

/** Methods */
gpub.book.NodeData.prototype = {
  /** Sets the section title from the context. */
  setSectionFromCtx: function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.SECTION_INTRO) {
      // We're at the beginning of the game. Create a new section
      this.sectionTitle =
          mt.getTreeFromRoot().properties().getOneValue('GN') || '';
      this.sectionNumber = idx;
      return idx + 1;
    }
    return idx;
  },

  /** Sets the chapter title from the context. */
  setChapterFromCtx : function(mt, previousPurpose, idx) {
    var diagramPurpose = gpub.diagrams.diagramPurpose;
    if (this.purpose === diagramPurpose.GAME_REVIEW_CHAPTER) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    } else if ((this.purpose === diagramPurpose.PROBLEM || 
        this.purpose === diagramPurpose.ANSWER) &&
        this.purpose !== previousPurpose) {
      this.chapterTitle = 'Chapter: ' + idx;
      this.chapterNumber = idx;
      return idx + 1;
    }
    return idx;
  }
};

/**
 * Staticly creates NodeData based on some context.  Basically, this uses
 * hueristics
 *
 * This method is pretty hacky and may need to be rethought.
 */
gpub.book.NodeData.fromContext = function(
    mt, flattened, sgfMetadata, nextMovesPath) {
  var diagramPurpose = gpub.diagrams.diagramPurpose;
  var exampleType = gpub.spec.exampleType;
  var purpose = diagramPurpose.GAME_REVIEW;
  sgfMetadata = sgfMetadata || {};

  if (diagramPurpose[sgfMetadata.exampleType]) {
    purpose = sgfMetadata.exampleType;
  }

  // We're at the beginning of a game. Don't display a board, but display the
  // comment (assuming there is one).
  if (mt.node().getNodeNum() === 0 &&
      nextMovesPath.length === 0 &&
      purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.SECTION_INTRO;
  }

  // Try out the chapter-title stuff.
  if (flattened.isOnMainPath() && purpose === diagramPurpose.GAME_REVIEW) {
    purpose = gpub.diagrams.diagramPurpose.GAME_REVIEW_CHAPTER;
  }

  return new gpub.book.NodeData(purpose);
};
