var instant = function(fn) {
  setTimeout(fn, 0);
};

var runSeries = function(fns, callback) {
  if (fns.length === 0) return callback();
  var completed = 0;
  var data = [];
  var iterate = function() {
    fns[completed](function(results) {
      data[completed] = results;
      if (++completed == fns.length) {
        if (callback) callback(data);
      } else {
        iterate();
      }
    });
  };
  iterate();
};

var runParallel = function(fns, callback) {
  if (fns.length === 0) return callback();
  var started = 0;
  var completed = 0;
  var data = [];
  var iterate = function() {
    fns[started]((function(i) {
      return function(results) {
        data[i] = results;
        if (++completed == fns.length) {
          if (callback) callback(data);
          return;
        }
      };
    })(started));
    if (++started != fns.length) iterate();
  };
  iterate();
};

var queue = function(fn, series) {
  var q = [];
  return {
    push: function(obj) {
      if (obj instanceof Array) {
        for (var i = 0, c = obj.length; i < c; i++) {
          var item = obj[i];
          this.push(item);
        }
      } else {
        q.push(function(cb) {
          fn(obj, cb);
        });
      }
    },
    run: function(cb) {
      if (!series)
        runParallel(q, cb);
      else
        runSeries(q, cb);
    },
    clear: function() {
      q = [];
    }
  };
};

var R = {
  series: runSeries,
  parallel: runParallel,
  queue: queue
};
