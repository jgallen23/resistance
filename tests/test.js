var R = require("../src/resistance").R;

var testA = function(cb) {
  setTimeout(function() {
    console.log("Test A Complete");
    cb();
  }, 500);
};

var testB = function(cb) {
  setTimeout(function() {
    console.log("Test B Complete");
    cb();
  }, 500);
};

R.series([
  testA,
  testA,
  testA
  ], function() {
    console.log("Series Complete");
});

R.parallel([
  testB,
  testB,
  testB
  ], function() {
    console.log("Parallel Complete");
});


R.series([], function() { console.log("Empty Series Complete"); });
R.parallel([], function() { console.log("Empty Parallel Complete"); });
