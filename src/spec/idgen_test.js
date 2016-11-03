(function() {
  module('gpub.spec.IdGenTest')

  test('That PATH ID Gen works as expected', function() {
    var idGen = new gpub.spec.IdGen(gpub.spec.IdGenType.PATH);
    deepEqual(idGen.next('foo', '1.2.3:4.5', ''), 'foo__1_2_3-4_5');
    deepEqual(idGen.next('foo', '1.2.3:4.5', '0:5.1'), 'foo__1_2_3-4_5__0-5_1');
    deepEqual(idGen.next('bar', '1.2.3:4.5', '0:5.1'), 'bar__1_2_3-4_5__0-5_1');
    throws(function() {idGen.next('bar', '1.2.3:4.5', '0:5.1') });
  });

  test('That SEQUENTIAL ID Gen works as expected', function() {
    var idGen = new gpub.spec.IdGen(gpub.spec.IdGenType.SEQUENTIAL);
    deepEqual(idGen.next('foo', '1.2.3:4.5', ''), 'foo-0');
    deepEqual(idGen.next('foo', '1.2.3:4.5', '0:5.1'), 'foo-1');
    deepEqual(idGen.next('bar', '1.2.3:4.5', '0:5.1'), 'bar-0');
  });
})();
