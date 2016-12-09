(function() {
  module('glift.page.pdfxTest');

  test('PDX Header with PageSize', function() {
    var opts = {
      title: 'foo',
      colorProfileFile: 'bar.icc',
      pageSize: gpub.book.PageSize.LETTER
    };
    var header = gpub.book.latex.pdfx.header(opts);
    ok(header.indexOf('foo') > -1, 'Must have title. header was:' + header);
    ok(header.indexOf('bar.icc') > -1, 'Must have color profile. header was:' + header);
    var dim = gpub.book.pageDimensions[gpub.book.PageSize.LETTER];
    var hpt = gpub.util.size.mmToPt(dim.heightMm);
    var wpt = gpub.util.size.mmToPt(dim.widthMm);
    ok(header.indexOf(hpt) > -1,
        'Must have height in media box. header was:' + header);
    ok(header.indexOf(wpt) > -1,
        'Must have height in media box. header was:' + header);
    ok(header.indexOf('pdfminorversion=3') > 0, 'Must have pdf minor version=3');
    ok(header.indexOf('pdfobjcompresslevel=0') > 0,
        'Must have pdf obj compressionversion=0');
  });
})();
