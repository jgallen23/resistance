/*!
  * Resistance - A javascript flow controller 
  * v1.1.0
  * https://github.com/jgallen23/resistance
  * copyright JGA 2011
  * MIT License
  */

!function(obj) {

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

  var orig = obj.R;
  obj.R = {
    noConflict: function() {
      obj.R = orig;
      return this;
    },
    series: runSeries,
    parallel: runParallel
  };
}(typeof exports === 'undefined' ? this : exports);
