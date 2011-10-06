var R = require("../src/resistance").R;

R.series([
  function(cb) { setTimeout(function() { console.log("Series 1 (500)"); cb(1); }, 500); },
  function(cb) { setTimeout(function() { console.log("Series 2 (250)"); cb(2); }, 250); },
  function(cb) { setTimeout(function() { console.log("Series 3 (100)"); cb(3); }, 100); }
  ], function(data) {
    console.log("Series Complete", data);
});

R.parallel([
  function(cb) { setTimeout(function() { console.log("Parallel 1 (500)"); cb(1); }, 500); },
  function(cb) { setTimeout(function() { console.log("Parallel 2 (250)"); cb(2); }, 250); },
  function(cb) { setTimeout(function() { console.log("Parallel 3 (100)"); cb(3); }, 100); }
  ], function(data) {
    console.log("Parallel Complete "+ data);
});

R.series([], function() { console.log("Empty Series Complete"); });
R.parallel([], function() { console.log("Empty Parallel Complete"); });

var q = R.queue(function(duration, callback) {
  setTimeout(function() {
    console.log("Queue ("+duration+")");
    callback(duration);
  }, duration);
}, true);

q.push(500);
q.push(200);
q.run(function(data) {
  console.log("Queue Done "+ data);
});

