var assert = require('assert');

var resistance = require('../');

suite('#series', function() {

  test('pass data to use fn, return result', function(done) {

    resistance()
      .series() //optional
      .use(function(next) {
        next(null, 5);
      })
      .end(function(err, result) {
        assert.equal(err, null);
        assert.deepEqual(result, 5);
        done();
      });
  });

  test('pass data to use multiple fn, return result', function(done) {


    resistance()
      .use(function(next, num) {
        next(null, 5);
      })
      .use(function(next, num) {
        next(null, num + 5);
      })
      .end(function(err, result) {

        assert.equal(err, null);
        assert.deepEqual(result, 10);
        done();

      });
    
  });

  test('return error will stop chain', function(done) {

    var count = 0;
    resistance()
      .use(function(next) {
        count++;
        next(null, 1);
      })
      .use(function(next, num) {
        count++;
        next(new Error('some error message'));
      })
      .use(function(next, num) {
        count++;
        next(null, num++);
      })
      .end(function(err, results) {
        assert.notEqual(err, null);
        assert.equal(err.message, 'some error message')
        assert.equal(count, 2);
        done();
      });

  });

  test('async', function(done) {
    resistance()
      .use(function(next) {
        setTimeout(function() {
          next(null, 5);
        }, 20);
      })
      .use(function(next, num) {
        setTimeout(function() {
          next(null, num + 5);
        }, 20);
      })
      .end(function(err, results) {
        assert.equal(err, null);
        assert.deepEqual(results, 10);
        done();
      });
  });

  test('no fns', function(done) {
    resistance()
      .end(function(err, results) {

        assert.equal(err, null);
        assert.equal(results, null);
        done();

      });
  });

  test('context passed to first fn', function(done) {
    resistance()
      .context(1)
      .use(function(next, context) {
        next(null, context);
      })
      .end(function(err, results) {
        assert.equal(err, null);
        assert.equal(results, 1);
        done();
      });
    
  });
    
});
