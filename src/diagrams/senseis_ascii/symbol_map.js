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
   * Marks and StoneMarks layer. Gooe combines squashes marks and stones into a
   * single symbol. Also, if we display a symbol or stone, we don't display the
   * base layer.
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
