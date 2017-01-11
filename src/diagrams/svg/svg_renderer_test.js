(function() {
  module('gpub.diagrams.svg.svgRendererTest');

  var marksSvg = testdata.sgfs.marktest;
  var sr = new gpub.diagrams.svg.Renderer();
  var mt = glift.parse.fromString(marksSvg);
  var flat = glift.flattener.flatten(mt);
  var opt = {};

  test('That rendering marks works', function() {
    var out = sr.render(flat, opt);

    ok(out);

    ok(/\.bs \{/.test(out), 'black stone def');
    ok(/\.ws \{/.test(out), 'white mark def');
    ok(/\.cl \{/.test(out), 'center line def');
    ok(/\.el \{/.test(out), 'edge line def');
    ok(/\.sp \{/.test(out), 'starpoint def');

    // marks
    ok(/\.bm \{/.test(out), 'black mark def');
    ok(/\.wm \{/.test(out), 'white mark def');
    ok(/\.bl \{/.test(out), 'black label def');
    ok(/\.wl \{/.test(out), 'white label def');
  });
})();
