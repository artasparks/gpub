goog.provide('gpub.spec.Processor');

/**
 * A processor takes as input a single SGF, implicitly with a specified type,
 * and outputs a series of EXAMPLE Sgf objects.
 *
 * @record
 */
gpub.spec.Processor = function() {};


/**
 * @param {!glift.rules.MoveTree} movetree Parsed movetree.
 * @param {!string} alias For the SGF string.
 * @param {!glift.enums.boardRegions} boardRegion
 *
 * @return {!gpub.spec.Grouping} a procesed grouping for the sgf.
 */
gpub.spec.Processor.prototype.process = function(movetree, alias, boardRegion) {};
