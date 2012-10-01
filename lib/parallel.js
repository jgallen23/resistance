
var parallel = function(fns, callback, context) {
  if (fns.length === 0) return callback();

  var started = 0;
  var completed = 0;
  var data = [];
  var interrupt = false;

  var iterate = function() {

    //done
    var cb = (function(i) {
      return function(err, results) {
        //already errored
        if (interrupt) {
          return;
        } 

        if (err) {
          interrupt = true;
          return callback(err);
        }

        data[i] = results;
        if (++completed == fns.length) {
          return callback(null, data);
        }
      }
    })(started);

    fns[started].apply(this, [cb, context]);
    if (++started != fns.length) iterate();
  };
  iterate();
};

module.exports = parallel;
