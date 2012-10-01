
var series = function(fns, callback, context, scope) {
  scope = scope || this;
  var completed = -1;
  var data = [];
  if (!callback) {
    callback = function() {};
  }
  var iterate = function() {
    var args = Array.prototype.slice.call(arguments);

    //check for error
    if (args[0]) {
      return callback(args[0]);
    }

    if (completed != -1) {
      args[0] = null;
      data[completed] = args;
    }

    //all done
    if (++completed == fns.length) {
      return callback.apply(data, args);
    } 

    args[0] = iterate;
    if (completed == 0) {
      args[1] = context;
    }
    fns[completed].apply(scope, args);

  };
  iterate();
};

module.exports = series;
