(function() {
  module('gpub.api.endToEndTest');
  var sgfs = testdata.sgfs;
  var sgf = testdata.gogameguru_commentary;

  test('Setup', function() {
    ok(sgf, 'testdata defined');
    ok(glift, 'glift global defined');
    ok(gpub, 'gpub global defined');
  });

  test('Testing validation: no SGFs', function() {
    try {
      gpub.create();
    } catch (e) {
      ok(/SGF array must be defined and non-empty/.test(e).toString());
    }
  });

  test('Testing full happy path, no exceptions', function() {
    var output = gpub.create({
      sgfs: [sgf],
      diagramOptions: {
        maxDiagrams: 20
      },
    })
    ok(output, 'Output should be defined');
  });

  // TODO(kashomon): Add back in once book conversion is complete.

  // test('Testing PDF/X-1a:2001 compatibility (no exceptions)', function() {
    // var output = gpub.create({
      // sgfs: [sgfs.base],
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
