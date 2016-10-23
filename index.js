#!/usr/bin/env node

/**
 * Some base globals, so it doesn't bomb out.
 */
window = {};
goog = {
  require: function(ns) {},
  scope: function(fn) { fn(); },
  provide: function(ns) { ns; },
};
gpub = {};
glift = {};

require('./compiled/gpub-concat.js');

// require('./deps/glift-core/glift.js')
// require('./deps/glift-core/util/util.js')
// require('./deps/glift-core/util/array.js')
// require('./deps/glift-core/util/colors.js')
// require('./deps/glift-core/util/enums.js')
// require('./deps/glift-core/util/obj.js')
// require('./deps/glift-core/util/point.js')
// require('./deps/glift-core/global.js')
// require('./deps/glift-core/flattener/flattener.js')
// require('./deps/glift-core/flattener/board.js')
// require('./deps/glift-core/flattener/flattened.js')
// require('./deps/glift-core/flattener/intersection.js')
// require('./deps/glift-core/flattener/labels.js')
// require('./deps/glift-core/flattener/symbols.js')
// require('./deps/glift-core/markdown/markdown.js')
// require('./deps/glift-core/markdown/marked.js')
// require('./deps/glift-core/markdown/renderer.js')
// require('./deps/glift-core/orientation/orientation.js')
// require('./deps/glift-core/orientation/bbox.js')
// require('./deps/glift-core/orientation/cropbox.js')
// require('./deps/glift-core/orientation/cropping.js')
// require('./deps/glift-core/orientation/min_bbox.js')
// require('./deps/glift-core/orientation/rotate.js')
// require('./deps/glift-core/parse/parse.js')
// require('./deps/glift-core/parse/sgf_parser.js')
// require('./deps/glift-core/parse/tygem.js')
// require('./deps/glift-core/rules/rules.js')
// require('./deps/glift-core/rules/all_properties.js')
// require('./deps/glift-core/rules/autonumber.js')
// require('./deps/glift-core/rules/goban.js')
// require('./deps/glift-core/rules/move.js')
// require('./deps/glift-core/rules/movenode.js')
// require('./deps/glift-core/rules/movetree.js')
// require('./deps/glift-core/rules/problems.js')
// require('./deps/glift-core/rules/properties.js')
// require('./deps/glift-core/rules/treepath.js')
// require('./deps/glift-core/sgf/sgf.js')
// require('./src/gpub.js')
// require('./src/api/api.js')
// require('./src/api/book_options.js')
// require('./src/api/diagram_options.js')
// require('./src/api/enums.js')

// require('./src/api/options.js')
// require('./src/api/spec_options.js')
// require('./src/spec/spec.js')
// require('./src/spec/game_commentary.js')
// require('./src/spec/generated.js')
// require('./src/spec/grouping.js')
// require('./src/spec/position.js')
// require('./src/spec/problem.js')
// require('./src/spec/processor.js')
// require('./src/spec/spec_def.js')
// require('./src/diagrams/diagrams.js')
// require('./src/diagrams/diagram_def.js')
// require('./src/diagrams/diagram_type.js')
// require('./src/diagrams/renderer.js')
// require('./src/diagrams/gnos/gnos.js')
// require('./src/diagrams/gnos/gnos_renderer.js')
// require('./src/diagrams/gnos/symbol_map.js')
// require('./src/diagrams/gooe/gooe.js')
// require('./src/diagrams/gooe/init.js')
// require('./src/diagrams/gooe/symbol_map.js')
// require('./src/diagrams/gpub_ascii/gpub_ascii.js')
// require('./src/diagrams/gpub_ascii/symbol_map.js')
// require('./src/diagrams/igo/igo.js')
// require('./src/diagrams/igo/igo_init.js')
// require('./src/diagrams/igo/igo_intersections.js')
// require('./src/diagrams/pdf/pdf.js')
// require('./src/diagrams/senseis_ascii/senseis_ascii.js')
// require('./src/diagrams/senseis_ascii/symbol_map.js')
// require('./src/diagrams/smartgo/smartgo.js')
// require('./src/diagrams/svg/svg.js')
// require('./src/util/util.js')
// require('./src/util/buffer.js')
// require('./src/util/movetree_cache.js')
// require('./src/util/size.js')

for (var key in gpub) {
  module.exports[key] = gpub[key];
}

var k = gpub.create({
  sgfs: ['(;GM[1]C[Try these Problems out!])']
})

console.log(k);
