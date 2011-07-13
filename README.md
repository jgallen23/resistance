# Resistance
----
Resistance is a tiny (463 bytes, 298 bytes gzipped) flow control library for javascript.

## Usage

``` js

//Test function A
var testA = function(cb) {
  setTimeout(function() {
    console.log("Test A Complete");
    cb();
  }, 500);
};

//Test function B
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

```

## Node.js Support

``` npm install resistance ```

## Ender Support

``` ender build resistance ```

``` js

$.runSeries([]);
$.runParallel([]);

```
