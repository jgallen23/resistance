# Resistance
----
Resistance is a tiny (463 bytes, 298 bytes gzipped) flow control library for javascript.

## Usage

``` js

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

```

## Ender Support

``` ender build resistance ```

``` js

$.runSeries([]);
$.runParallel([]);

```
