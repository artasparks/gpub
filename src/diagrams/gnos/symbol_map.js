/**
 * Symbol map.
 */
gpub.diagrams.gnos.symbolMap = {
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
  BSTONE_TRIANGLE: 'S',
  WSTONE_TRIANGLE: 's',
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
  WSTONE_NUMLABEL_300_399: '{\\gnoswiii\\char%s}'
};
