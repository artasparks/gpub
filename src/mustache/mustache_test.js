(function() {
  module('gpub.mustacheTest');
  var Mustache = gpub.Mustache;

  test('Testing basic example', function() {
    var view = {
      title: "Joe",
      calc: function () {
        return 2 + 4;
      }
    };
    ok(Mustache.render, 'render method must be defined');

    var output = Mustache.render('{{title}} spends {{calc}}', view);

    deepEqual(output, 'Joe spends 6');
  });

})();
