(function() {
  module('glift.book.generatorTest');

  test('Test all outputFormat for generators', function() {
    for (var key in gpub.outputFormat) {
      var p = gpub.book.generator(key, {});
      ok(p, 'generator not defined for key: ' + key);
    }
  });

  test('Test all generator methods', function() {
    var interface = gpub.book.Generator;
    for (var key in gpub.outputFormat) {
      var pkg = gpub.book[key.toLowerCase()];
      var gen = pkg.generator;
      ok(gen, 'generator not defined for key: ' + key);

      for (var method in interface) {
        ok(gen[method], 'Method: ' + method + 
            ' not defined for Output Format: ' + key);
      }
    }
  });

  test('SGF Signature', function() {
    var absgen = new gpub.book._Generator();
    deepEqual(absgen._sgfSignature('abc'), 'abc', 'less than 100');

    var exactlyHundred =
      '01234567690123456769012345676901234567690123456769' +
      '01234567690123456769012345676901234567690123456769';
    deepEqual(absgen._sgfSignature(exactlyHundred), exactlyHundred);

    var firstFifty =  '01234567690123456769012345676901234567690123456769';
    var secondFifty = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx';
    deepEqual(
      absgen._sgfSignature(firstFifty + 'aouarugsoecuhaeosruch' + secondFifty),
      firstFifty + secondFifty);
  });

  test('Book Options / view from SGF', function() {
    var gen = new gpub.book._Generator()._initOptions({
      bookOptions: { zed: 'fred' }
    });

    var spec = {
      sgfCollection: [
        { sgfString: '(;GM[1]GC[{"zed": "frood", "zod": "frod"}])' }
      ]
    };

    var view = gen.view(spec);
    deepEqual(view, { zed: 'fred', zod: 'frod' });
  });

  test('Book process options: defaults for type', function() {
    var gen = new gpub.book._Generator();
    gen.defaultOptions = function() {
      return {
        zap: 'bang',
        bookOptions: {
          zed: 'fred',
          zod: 'frod'
        }
      };
    };
    gen._initOptions({bookOptions: { zed: 'frood' }});

    deepEqual(gen._opts, {
      zap: 'bang',
      bookOptions: {
        zed: 'frood',
      }
    });
  });

  test('Book process options: defaults for type + SGF', function() {
    var gen = new gpub.book._Generator();
    gen.defaultOptions = function() {
      return {
        zap: 'bang',
        bookOptions: {
          zed: 'fred',
          zod: 'frod',
          zeed: 'freed'
        }
      };
    };

    var spec = {
      sgfCollection: [
        { sgfString: '(;GM[1]GC[{"zed": "frood", "zod": "frod"}])' }
      ]
    };
    gen._initOptions({bookOptions: { zed: 'frood' }});

    var view = gen.view(spec);
    deepEqual(view, {
      zed: 'frood', // explicit
      zod: 'frod', // SGF
      zeed: 'freed' // Default
    });
  });
})();
