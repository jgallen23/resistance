/*!
  * Resistance - A javascript flow controller 
  * https://github.com/jgallen23/resistance
  * copyright JGA 2011
  * MIT License
  */

!function(obj) {

  var runSerial = function(fns, callback) {
    var completed = 0;
    var iterate = function() {
      fns[completed](function() {
        if (++completed == fns.length) {
          if (callback) callback();
        } else {
          iterate();
        }
      });
    };
    iterate();
  };
  
  var runParallel = function(fns, callback) {
    var started = 0;
    var completed = 0;
    var iterate = function() {
      fns[started](function() {
        if (++completed == fns.length) {
          if (callback) callback();
          return;
        }
      });
      if (++started != fns.length)
        iterate();
    };
    iterate();
  };

  var orig = obj.R;
  obj.R = {
    noConflict: function() {
      obj.R = orig;
      return this;
    },
    serial: runSerial,
    parallel: runParallel
  };
}(typeof exports === 'undefined' ? this : exports);
