
var series = require('./series');
var parallel = require('./parallel');
var queue = require('./queue');

var Resistance = function() {
  if (!(this instanceof Resistance)) {
    return new Resistance();
  }

  this.type = 'series';
  this.flow = [];
}

Resistance.prototype.context = function(data) {
  this.context = data;
  return this;
}

Resistance.prototype.use = function(fn) {
  this.flow.push(fn);
  return this;
}

Resistance.prototype.series = function() {
  this.type = 'series';
  return this;
}

Resistance.prototype.parallel = function() {
  this.type = 'parallel';
  return this;
}

Resistance.prototype.queue = function(data) {
  this.type = 'queue';
  this.queueData = data;
  return this;
}

Resistance.prototype.end = function(fn) {

  if (this.type == 'series') {
    series(this.flow, fn, this.context);
  } else if (this.type == 'parallel') {
    parallel(this.flow, fn, this.context);
  } else if (this.type == 'queue') {
    queue(this.queueData, this.flow, fn);
  }

}

module.exports = Resistance;
