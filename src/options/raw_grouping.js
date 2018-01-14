goog.provide('gpub.opts.RawGrouping');
goog.provide('gpub.opts.RawPosition');

/**
 * A RawGrouping object allows very precise control about which positions /
 * problems are displayed and how. This corresponds roughly to
 * gpub.spec.Grouping,
 *
 * A note about some of the parameters.
 * - positionType must be a gpub.spec.PositionType enum.
 * - positions may be either an SGF-id (string) or more complex RawPosition
 *   type.
 * - A grouping can contain subgroupings! Useful for sub-sections in a book.
 *
 * @typedef {{
 *  description: (string|undefined),
 *  title: (string|undefined),
 *  positionType: (string|undefined),
 *  positions: (!Array<(string|!gpub.opts.RawPosition)>|undefined),
 *  groupings: (!Array<(string|!gpub.opts.RawGrouping)>|undefined),
 * }}
 */
gpub.opts.RawGrouping;

/**
 * A RawPosition object specifies the details of how a specific position is
 * rendered
 *
 * - sgfId is the ID of the originating SGF. Must always be specified.
 * - ID is ID of this particular position. It will be generated if it's not
 *   specified.
 *
 * @typedef {{
 *  id: (string|undefined),
 *  gameId: (string),
 *  initialPosition: (string|undefined),
 *  nextMovesPath: (string|undefined),
 *  positionType: (string|undefined),
 * }}
 */
gpub.opts.RawPosition;
