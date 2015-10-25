/**
 *
 * Creates igo-diagrams. Note: This is only for creating books using latex.
 */
gpub.diagrams.igo = {
  /**
   * Create a diagram from a flattened representation.
   *
   * Unlike many other diagram-generators, Igo has lots of built-in logic in the
   * TEX style. Thus, we need only display the stones and marks.
   *
   * Also note: For Igo, Go boards are indexed from the bottom as coordinates of
   * the form <letter><number>:
   *  a12
   *  g5
   * - Numbers are 1 indexed
   * - i is not used for intersections
   *
   * So, the boards look like this:
   *   ...
   *   ^
   *   2
   *   ^
   *   1
   *     a->b->c->d->e->f->g->h->j->k->l...
   */
  create: function(flattened, options) {
    var letters = 'abcdefghjklmnopqrstuvwxyz';
    var wIntersections = [];
    var bIntersections = [];
    return '';
  },
  /**
   * Render go stones that exist in a block of text.
   */
  renderInline: function(text, options) {
    // TODO(kashomon): Implement at some point. See gnos for an example.
    return text;
  }
};
