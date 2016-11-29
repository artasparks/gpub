(function() {
  module('gpub.book.generatorTest');

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

  test('Generator Options: (LATEX)', function() {
    var opts = gpub.Options({
      pageSize: 'EIGHT_TEN'
    });
    var gen = gpub.book.generator('LATEX', opts);
    deepEqual(gen.options().pageSize, 'EIGHT_TEN');
  });

  test('Testing getSgfId', function() {
    var gen = new gpub.book._Generator();

    deepEqual(gen.getSgfId({alias: 'fooo'}), 'fooo');
    deepEqual(gen.getSgfId({sgfString: 'zed'}), 'zed');
  });
})();
