var assert = require('assert');

var resistance = require('../');

suite('#queue', function() {


  test('run fns against an array of data', function(done) {

    var data = [1, 2, 3];

    resistance()
      .queue(data)
      .use(function(next, num) {
        next(null, num * 10);
      })
      .use(function(next, num) {
        next(null, num + 5);
      })
      .end(function(err, results) {
        assert.equal(err, null);
        assert.equal(results.length, 3);
        assert.deepEqual(results, [15, 25, 35]);
        done();
      });
  });

  test('be able to add new data to queue', function(done) {

    var data = [1, 2, 3];

    resistance()
      .queue(data)
      .use(function(next, num) {
        next(null, num * 10);
      })
      .use(function(next, num) {
        if (num == 30) {
          this.push(4);
        }
        next(null, num + 5);
      })
      .end(function(err, results) {
        assert.equal(err, null);
        assert.equal(results.length, 4);
        assert.deepEqual(results, [15, 25, 35, 45]);
        done();
      });
    
  });
});



/*

  suite('#push', function() {

    test('add single item to data', function() {
      var data = [1,2,3]
      var res = new Resistance(data);
      res.push(4);
      assert.equal(data.length, 4);
      assert.equal(data[3], 4);
    });

    test('add multiple items to data', function() {
      var data = [1,2,3]
      var res = new Resistance(data);
      res.push([4, 5]);
      assert.equal(data.length, 5);
      assert.equal(data[3], 4);
      assert.equal(data[4], 5);
    });

    test('returns instance for chaining', function() {
      var res = new Resistance(data);
      var ret = res.push(4);

      assert.equal(res, ret);
    });
    
  });

 */
