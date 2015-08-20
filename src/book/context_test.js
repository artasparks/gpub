(function() {
  module('glift.book.contextTest');
  var wtypes = glift.enums.widgetTypes;
  var ctx = gpub.book.contextType;
  var newCtx = gpub.book.newDiagramContext;

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

  test('Problem', function() {
    var spec = constructSpec([
      { widgetType: wtypes.STANDARD_PROBLEM, sgfString: '(;GM[1]C[foo])' },
      { widgetType: wtypes.STANDARD_PROBLEM, sgfString: '(;GM[1]C[### foo])' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.PROBLEM, false, {}),
      newCtx(ctx.PROBLEM, true, {}),
    ]);
  });

  test('Variations', function() {
    var spec = constructSpec([
      { widgetType: wtypes.GAME_VIEWER, sgfString: '(;GM[1]C[foo])' },
      { widgetType: wtypes.GAME_VIEWER, sgfString: '(;GM[1]C[### foo])' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.VARIATIONS, false, {}),
      newCtx(ctx.VARIATIONS, true, {}),
    ]);
  });

  test('Description', function() {
    var spec = constructSpec([
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1])' },
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1]C[## foo])' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.DESCRIPTION, false, {}),
      newCtx(ctx.DESCRIPTION, true, {}),
    ]);
  });

  test('Example', function() {
    var spec = constructSpec([
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1]AB[aa])' },
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1];B[aa])',
          initialPosition: '1' },
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1]AB[aa]C[## foo])' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.EXAMPLE, false, {}),
      newCtx(ctx.EXAMPLE, false, {}),
      newCtx(ctx.EXAMPLE, true, {}),
    ]);
  });

  test('Example: Not Mainline', function() {
    var spec = constructSpec([
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1](;B[aa])(;B[bb]))',
          initialPosition: '0.1' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.EXAMPLE, false, {}),
    ]);
  });

  test('Example: variation from beginning', function() {
    var spec = constructSpec([
      { widgetType: wtypes.EXAMPLE, sgfString: '(;GM[1](;B[aa])(;B[bb]))',
          initialPosition: '', nextMovesPath: '0' },
    ]);
    deepEqual(getCtxFromSpec(spec), [
      newCtx(ctx.EXAMPLE, false, {}),
    ]);
  })
})();
