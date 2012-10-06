
var series = require('./series');
var parallel = require('./parallel');

var runSeries = function(fns, context, scope) {
  return function(done) {
    series(fns, done, context, scope);
  }
}
var queue = function(data, fns, done) {

  var pFns = [];
  var scope = {
    push: function(value) {
      pFns.push(runSeries(fns, value, scope));
    }
  }
  for (var i = 0, c = data.length; i < c; i++) {
    var item = data[i];
    pFns.push(runSeries(fns, item, scope));
  }
  series(pFns, done);

}

module.exports = queue;
