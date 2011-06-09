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

R.serial([
  testA,
  testA,
  testA
  ], function() {
    console.log("Serial Complete");
});

R.parallel([
  testB,
  testB,
  testB
  ], function() {
    console.log("Parallel Complete");
});
