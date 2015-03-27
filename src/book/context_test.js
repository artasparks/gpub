(function() {
  module('glift.book.generatorTest');
  var wtypes = glift.enums.widgetTypes;
  var ctx = gpub.book.diagramContext;

  var constructSpec = function(objs) {
    var spec = { sgfCollection: [] };
    for (var i = 0; i < objs.length; i++) {
      spec.sgfCollection.push(objs[i]);
    }
    return spec;
  };

  var getCtxFromSpec = function(spec) {
    var opts = gpub.processOptions();
    var gen = gpub.book.generator(opts.outputFormat, opts);
    var out = [];
    gen.forEachSgf(spec, function(i, mt, flat, ctx) {
      out.push(ctx);
    });
    return out;
  };

  test('Testing diagram context: simple', function() {
    var spec = constructSpec([
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1])' }
    ]);
    deepEqual(getCtxFromSpec(spec), [ctx.EXAMPLE]);
  });
})();
