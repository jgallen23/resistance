var expect = (typeof chai === 'undefined')?require('chai').expect:chai.expect;
if (typeof window === 'undefined') { //browser
  var R = require('../');
}

describe('series', function() {
  it('should wait until previous finishes', function(done) {
    var count = 0;
    R.series([
      function(next) {
        count++;
        next();
      },
      function(next) {
        expect(count).to.equal(1);
        count++;
        next();
      }
    ], function(data) {
      expect(count).to.equal(2);
      done();
    }); 
  });
  it('should work with async tests', function(done) {
    var count = 0;
    R.series([
      function(next) {
        setTimeout(function() {
          count++;
          next();
        }, 200);
      },
      function(next) {
        expect(count).to.equal(1);
        setTimeout(function() {
          count++;
          next();
        }, 100);
      }
    ], function(data) {
      expect(count).to.equal(2);
      done();
    }); 
  });
  it('should pass data to the final callback', function(done) {
    var count = 0;
    R.series([
      function(next) {
        count++;
        next(1);
      },
      function(next) {
        expect(count).to.equal(1);
        count++;
        next(2);
      }
    ], function(val1, val2) {
      expect(count).to.equal(2);
      expect(this.length).to.equal(2);
      expect(this[0]).to.equal(1);
      expect(this[1]).to.equal(2);
      expect(val1).to.equal(1);
      expect(val2).to.equal(2);
      done();
    }); 
  });

  it('should allow multiple series to be run at once', function(done) {
    R.series([
      function(next) {
        setTimeout(function() {
          next(1);
        }, 200);
      }], function(data) {
        expect(data).to.equal(1);
        done();
    });
    R.series([
      function(next) {
        setTimeout(function() {
          next(2);
        }, 100);
      }], function(data) {
        expect(data).to.equal(2);
    });
    
  });
  
  it('should callback instantly if nothing passed in', function() {
    var ran = false;
    R.series([], function() { 
      ran = true;
    });
    expect(ran).to.be.true;
  });
});

describe('parallel', function() {
  it('should not wait until previous finishes', function(done) {
    var count = 0;
    R.parallel([
      function(next) {
        setTimeout(function() {
          count++;
          next();
        }, 200);
      },
      function(next) {
        expect(count).to.equal(0);
        count++;
        next();
      }
    ], function(data) {
      expect(count).to.equal(2);
      done();
    }); 
  });
  it('should pass data to the final callback', function(done) {
    var count = 0;
    R.parallel([
      function(next) {
        count++;
        next(1);
      },
      function(next) {
        expect(count).to.equal(1);
        count++;
        next(2);
      }
    ], function(val1, val2) {
      expect(count).to.equal(2);
      expect(val1).to.equal(1);
      expect(val2).to.equal(2);
      done();
    }); 
  });

  it('should allow multiple to be run at once', function(done) {
    R.parallel([
      function(next) {
        setTimeout(function() {
          next(1);
        }, 200);
      }], function(data) {
        expect(data).to.equal(1);
        done();
    });
    R.parallel([
      function(next) {
        setTimeout(function() {
          next(2);
        }, 100);
      }], function(data) {
        expect(data).to.equal(2);
    });
    
  });
  
  it('should callback instantly if nothing passed in', function() {
    var ran = false;
    R.parallel([], function() { 
      ran = true;
    });
    expect(ran).to.be.true;
  });
});

describe('queue', function() {
  
  it('should return a new queue object', function() {
    var q = R.queue(function() {});
    expect(q.push).to.exist;
    expect(q.run).to.exist;
    expect(q.clear).to.exist;
  });

  describe('run', function() {
    
    it('should run function for each value and return results', function(done) {
      var testsRun = 0;

      var q = R.queue(function(val, next) {
        var delay = val*100;
        setTimeout(function() {
          if (val == 1) { //verify running parallel
            expect(testsRun).to.equal(0);
          } else {
            expect(testsRun).to.equal(1);
          }
          testsRun++;
          next(delay);
        }, delay);
      });

      q.push(2);
      q.push(1);

      q.run(function(val1, val2) {
        expect(val1).to.equal(200);
        expect(val2).to.equal(100);
        expect(testsRun).to.equal(2);
        done();
      });
      
    });
    it('should be able to have two queues running at once', function(done) {
      
        var testsRun = 0;

        var q = R.queue(function(duration, next) {
          setTimeout(function() {
            testsRun++;
            next(duration);
          }, duration);
        });

        q.push(500);
        q.push(200);
        q.run(function(val1, val2) {
          expect(val1).to.equal(500);
          expect(val2).to.equal(200);
        });
        
        var q2 = R.queue(function(duration, next) {
          setTimeout(function() {
            testsRun++;
            next(duration);
          }, duration);
        });

        q2.push(600);
        q2.push(100);
        q2.run(function(val1, val2) {
          expect(val1).to.equal(600);
          expect(val2).to.equal(100);
          expect(testsRun).to.equal(4);
          done();
        });
    });
    
    
  });

  describe('push', function() {
    it('should take an array', function(done) {
      var q = R.queue(function(val, next) {
        var delay = val*100;
        setTimeout(function() {
          next(delay);
        }, delay);
      });

      q.push([1, 2]);

      q.run(function(val1, val2) {
        expect(val1).to.equal(100);
        expect(val2).to.equal(200);
        done();
      });
    });
  });

  it('should take a second parameter to run in series', function(done) {
    
    var testsRun = 0;

    var q = R.queue(function(duration, next) {
      setTimeout(function() {
        if (duration == 500) //make sure running in series
          expect(testsRun).to.equal(0);
        testsRun++;
        next(duration);
      }, duration);
    }, true);

    q.push(500);
    q.push(200);
    q.run(function(val1, val2) {
      expect(testsRun).to.equal(2);
      expect(val1).to.equal(500);
      expect(val2).to.equal(200);
      done();
    });
  });
  

  it('should still callback if nothing in queue', function(done) {
    var testsRun = 0;

    var q = R.queue(function(duration, next) {
      setTimeout(function() {
        testsRun++;
        next(duration);
      }, duration);
    });
    q.run(function(data) {
      expect(testsRun).to.equal(0);
      done();
    });
  });
  

  describe('clear', function() {
    it('should clear queue', function(done) {
      var testsRun = 0;

      var q = R.queue(function(duration, next) {
        setTimeout(function() {
          testsRun++;
          next(duration);
        }, duration);
      }, true);

      q.push(500);
      q.push(200);
      q.clear();
      q.run(function(data) {
        expect(testsRun, 0);
        done();
      });
    });
    
    it('should be able to run twice', function(done) {
      
      var testsRun = 0;

      var q = R.queue(function(duration, callback) {
        setTimeout(function() {
          testsRun++;
          callback(duration);
        }, duration);
      }, true);

      q.push(500);
      q.push(200);
      q.run(function(val1, val2) {
        expect(testsRun).to.equal(2);
        expect(val1).to.equal(500);
        expect(val2).to.equal(200);
        q.clear();
        q.push(100);
        q.run(function(val3) {
          expect(val3).to.equal(100);
          expect(testsRun).to.equal(3);
        });
        done();
      });
    });
    
    
  });
});

