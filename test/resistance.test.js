var assert = require('assert');

var Resistance = require('../');
console.log(Resistance);

suite('resistance', function() {

  suite('Constructor', function() {

    test('new optional', function() {

      var res = new Resistance();
      var res2 = Resistance();

      assert.equal(res instanceof Resistance, true);
      assert.equal(res2 instanceof Resistance, true);
      
    });

    test('default type is set to series', function() {
      var res = new Resistance();
      assert.equal(res.type, 'series');
    });
    
  });

  suite('#use', function() {

    test('add to flow array', function() {
      var res = new Resistance();

      res.use(function(next, num) {});
      res.use(function(next, num) {});

      assert.equal(res.flow.length, 2);
      
    });

    test('returns instance for chaining', function() {

      var res = new Resistance();
      var ret = res.use(function() {});

      assert.equal(res, ret);
      
    });
  });

  suite('#series', function() {
    test('set type to series', function() {
      var res = new Resistance().series();
      assert.equal(res.type, 'series');
    });

    test('return itself for chaining', function() {
      var res = new Resistance().series();
      assert.equal(res instanceof Resistance, true);
    });
  });

  suite('#parallel', function() {
    test('set type to parallel', function() {
      var res = new Resistance().parallel();
      assert.equal(res.type, 'parallel');
    });

    test('return itself for chaining', function() {
      var res = new Resistance().parallel();
      assert.equal(res instanceof Resistance, true);
    });
  });

  suite('#queue', function() {
    test('set type to queue', function() {
      var res = new Resistance().queue();
      assert.equal(res.type, 'queue');
    });

    test('return itself for chaining', function() {
      var res = new Resistance().queue();
      assert.equal(res instanceof Resistance, true);
    });

    test('pass in data', function() {
      var res = new Resistance().queue([1, 2, 3]);
      assert.deepEqual(res.queueData, [1, 2, 3]);
    });
  });

  suite('#context', function() {
    test('set context data', function() {
      var res = new Resistance().context(5);
      assert.equal(res.context, 5);
    });
    test('return itself for chaining', function() {
      var res = new Resistance().context(5);
      assert.equal(res instanceof Resistance, true);
    });
  });
  
  
});

