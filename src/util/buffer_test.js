gpub.util.bufferTest = function() {
  module('gpub.util.bufferTest');

  var newBuffer = function(s) {
    return new gpub.util.Buffer(s);
  };

  test('Construct', function() {
    var buffer = newBuffer();
    deepEqual(buffer._maxSize, 1);
    deepEqual(buffer._buffer, []);

    buffer = newBuffer(3);
    deepEqual(buffer._maxSize, 3);
    deepEqual(buffer._buffer, []);
  });

  test('Add', function() {
    var buffer = newBuffer();
    buffer.add('zed');
    deepEqual(buffer._buffer, ['zed']);
  });

  test('atCapacity', function() {
    var buffer = newBuffer();
    ok(!buffer.atCapacity())

    buffer.add('zed');
    ok(buffer.atCapacity())
  });

  test('flush', function() {
    var buffer = newBuffer();
    buffer.add('zed');
    var out = buffer.flush();
    deepEqual(buffer._maxSize, 1);
    deepEqual(buffer._buffer, []);
    deepEqual(out, ['zed']);
  });
};
