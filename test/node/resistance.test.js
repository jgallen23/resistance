var R = require("../../");

exports.seriesTest = function(t) {
  var testsRun = 0;
  R.series([
    function(callback) {
      t.equal(testsRun, 0);
      setTimeout(function() {
        testsRun++;
        callback(1);
      }, 200);
    },
    function(callback) {
      t.equal(testsRun, 1);
      setTimeout(function() {
        testsRun++;
        callback(2);
      }, 100);
    }
  ], function(data) {
    t.equal(data[0], 1);
    t.equal(data[1], 2);
    t.equal(testsRun, 2);
    t.done();
  });
};

exports.testParallel = function(t) {
  var testsRun = 0;
  R.parallel([
    function(callback) {
      t.equal(testsRun, 0);
      setTimeout(function() {
        testsRun++;
        callback(1);
      }, 200);
    },
    function(callback) {
      t.equal(testsRun, 0);
      setTimeout(function() {
        testsRun++;
        callback(2);
      }, 100);
    }
  ], function(data) {
    t.equal(data[0], 1);
    t.equal(data[1], 2);
    t.equal(testsRun, 2);
    t.done();
  });
};

exports.multipleSeries = function(t) {
  t.expect(2);
  R.series([
    function(callback) {
      setTimeout(function() {
        callback(1);
      }, 200);
    }], function(data) {
      t.equal(data[0], 1);
      t.done();
  });
  R.series([
    function(callback) {
      setTimeout(function() {
        callback(2);
      }, 100);
    }], function(data) {
      t.equal(data[0], 2);
  });
};

exports.emptySeries = function(t) {
  t.expect(1);
  R.series([], 
   function() { 
     t.ok(true);
     t.done();
 });
};

exports.emptyParallel = function(t) {
  t.expect(1);
  R.parallel([],
    function() {
      t.ok(true);
      t.done();
  });
};

exports.testQueue = function(t) {
  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      if (duration == 500) //test if 200 finished before it
        t.equal(testsRun, 1);
      testsRun++;
      callback(duration);
    }, duration);
  });

  q.push(500);
  q.push(200);
  q.run(function(data) {
    t.equal(testsRun, 2);
    t.equal(data[0], 500);
    t.equal(data[1], 200);
    t.done();
  });
};

exports.testQueueWithArray = function(t) {
  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      if (duration == 500) //test if 200 finished before it
        t.equal(testsRun, 1);
      testsRun++;
      callback(duration);
    }, duration);
  });

  q.push([500, 200]);
  q.run(function(data) {
    t.equal(testsRun, 2);
    t.equal(data[0], 500);
    t.equal(data[1], 200);
    t.done();
  });
};

exports.testQueueSeries = function(t) {
  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      if (duration == 500) //make sure running in series
        t.equal(testsRun, 0);
      testsRun++;
      callback(duration);
    }, duration);
  }, true);

  q.push(500);
  q.push(200);
  q.run(function(data) {
    t.equal(testsRun, 2);
    t.equal(data[0], 500);
    t.equal(data[1], 200);
    t.done();
  });
};

exports.testEmptyQueue = function(t) {
  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      testsRun++;
      callback(duration);
    }, duration);
  });
  q.run(function(data) {
    t.equal(testsRun, 0);
    t.done();
  });
};

exports.testQueueClear = function(t) {

  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      testsRun++;
      callback(duration);
    }, duration);
  }, true);

  q.push(500);
  q.push(200);
  q.clear();
  q.run(function(data) {
    t.equal(testsRun, 0);
    t.done();
  });
};

exports.testTwoQueues = function(t) {

  var testsRun = 0;

  var q = R.queue(function(duration, callback) {
    setTimeout(function() {
      testsRun++;
      callback(duration);
    }, duration);
  }, true);

  q.push(500);
  q.push(200);
  q.run(function(data) {
    t.equal(data[0], 500);
    t.equal(data[1], 200);
  });
  
  var q2 = R.queue(function(duration, callback) {
    setTimeout(function() {
      testsRun++;
      callback(duration);
    }, duration);
  }, true);

  q2.push(600);
  q2.push(300);
  q2.run(function(data) {
    t.equal(data[0], 600);
    t.equal(data[1], 300);
    t.done();
  });
};
