var assert = require('assert');

var resistance = require('../');

suite('#parallel', function() {

  test('functions don\'t wait for previous to finish', function(done) {

    var firstFinished = false;
    var fnCount = 0;
    resistance()
      .parallel()
      .use(function(next) {
        setTimeout(function() {
          //doing work
          firstFinished = true;
          fnCount++;
          next(null, 1);
        }, 20);
      })
      .use(function(next) {
        assert.equal(firstFinished, false);
        setTimeout(function() {
          //doing work
          fnCount++;
          next(null, 2);
        }, 10);
      })
      .end(function(err, results) {

        assert.equal(err, null);
        assert.equal(fnCount, 2);
        //results return in the same order they were defined, not order they finished
        assert.deepEqual(results, [1, 2]);
        done();
      });
    
  });

  test('returning an error will stop flow', function(done) {

    var count = 0;
    resistance()
      .parallel()
      .use(function(done) {
        count++;
        done();
      })
      .use(function(done) {
        count++;
        done(new Error('you messed up'));
      })
      .use(function(done) {
        count++;
        done();
      })
      .end(function(err, results) {
        assert.equal(err.message, 'you messed up');
        assert.equal(results, null);
        assert.equal(count, 2);
        done();

      })

  });
    
  test('context passed in to each fn', function(done) {

    resistance()
      .parallel()
      .context(5)
      .use(function(done, context) {
        assert.equal(context, 5);
        done();
      })
      .use(function(done, context) {
        assert.equal(context, 5);
        done();
      })
      .end(function() {
        done();
      });
    
  });

});
