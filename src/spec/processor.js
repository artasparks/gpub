/**
 * The inteface for a spec processor. All spec processors must implement this
 * interface.
 */
gpub.spec.processor = {
  /**
   * Sets any relevant header info on the SGF Spec. Usually, the processor will
   * specify a widgetType, but other SGF Defaults or metadata may make sense.
   */
  setHeaderInfo: function(spec, options) {},

  /**
   * Process one SGF instance. Processing one SGF can result in multiple entries
   * in the SGF collection and so the return type is an array of sgf objects.
   * The most common case for this is that processing one Game results in many
   * commentary diagrams.
   *
   * movetree: The parsed SGF.
   * alias: the 'key' used for the SGF in the sgf collection in the SGF cache.
   * options: any additional options: .e.g., boardRegion.
   *
   * Returns: an array of sgf objects for the SGF collection.
   */
  processOneSgf: function(movetree, alias, options) {}
};
