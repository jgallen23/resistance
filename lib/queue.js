
var series = require('./series');
var parallel = require('./parallel');

var runSeries = function(fns, context, scope) {
  return function(done) {
    series(fns, done, context, scope);
  }
}
var queue = function(data, fns, done) {

  var pFns = [];
  for (var i = 0, c = data.length; i < c; i++) {
    var item = data[i];
    pFns.push(runSeries(fns, item));
  }
  parallel(pFns, done);

}

module.exports = queue;
