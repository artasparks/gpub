(function() {
  module('gpub.book.metadataTest');

  test('That options can be constructed', function() {
    var o = new gpub.book.Metadata({
      id: 'zip',
      title: 'Zap',
    })
    ok(o);
    ok(/\d\d\d\d-\d\d-\d\d/.test(o.generationDate),
        'Date must be of the form YYYY-MM-DD');
  });
})();
