(function() {
  module('gpub.api.endToEndTest');
  var sgfs = testdata.sgfs;
  var sgf = testdata.gogameguru_commentary;
  var base = testdata.base;

  test('Setup', function() {
    ok(sgf, 'testdata defined');
    ok(glift, 'glift global defined');
    ok(gpub, 'gpub global defined');
  });

  test('Testing validation: no template', function() {
    try {
      var out = gpub.create({
      });
    } catch (e) {
      ok(/Template parameter/.test(e).toString());
    }
  });

  test('Testing full happy path, no exceptions', function() {
    var output = gpub.create({
      template: 'PROBLEM_EBOOK',
      games: {sgf: sgf},
      grouping: [
        'sgf',
      ],
      diagramOptions: {
        maxDiagrams: 20
      },
    })
    ok(output, 'Output should be defined');
  });

  test('Testing full happy path, groupings', function() {
    var output = gpub.create({
      template: 'PROBLEM_EBOOK',
      games: {z1: sgf},
      grouping: {
        title: 'zed',
        positions: [
          'z1',
        ],
      },
      diagramOptions: {
        maxDiagrams: 20
      },
    })
    ok(output, 'Output should be defined');
  });

  test('Testing full happy path: game commentary', function() { var output = gpub.create({
      template: 'GAME_COMMENTARY_EBOOK',
      games: {z1: sgf},
      grouping: ['z1'],
    })
    ok(output, 'Output should be defined');
    ok(output.spec, 'Should have spec');
    ok(output.files, 'Should have files');
  });

  // TODO(kashomon): Add back in once book conversion is complete.

  // test('Testing PDF/X-1a:2001 compatibility (no exceptions)', function() {
    // var output = gpub.create({
      // games: {'zed': sgfs.base},
      // colorProfileFilePath: 'ISOcoated_v2_300_eci.icc',
      // pdfx1a: true
    // });

    // ok(/\/MediaBox/.test(output), 'Media box must be defined');
    // ok(/\/GTS_PDFXVersion/.test(output), 'PDFXVersion must be specified');
    // ok(/\/Title/.test(output), 'Title must be specified');
    // ok(/\\pdfminorversion=3/.test(output), 'PDF version be 1.3');
    // ok(/\\pdfobjcompresslevel=0/.test(output), 'Compression should be off');
    // ok(/\/OutputIntent/.test(output), 'OutputIntent must be specified');
  // });
})();
