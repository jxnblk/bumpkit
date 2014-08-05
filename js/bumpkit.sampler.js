// Bumpkit Sampler

'use strict';

var Sampler = function(output) {

  Bumpkit.call(this);

  this.output = output || 0;
  this.context = this.output.context;
  this.offset = 0;
  this.duration = 0.6;

  // Move pattern controller to separate object
  /*
  var self = this;
  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (self.pattern[step] == 1) {
      self.play(when)
    }
  });
  */

};

Sampler.prototype = Object.create(Bumpkit.prototype);
Sampler.prototype.constructor = Bumpkit;

Sampler.prototype.buffer;

Sampler.prototype.play = function(when) {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  this.trigger(source, when, this.output, { duration: this.duration });
};

/*
 * Replaced with loadBuffer()
Sampler.prototype.loadBuffer = function(file) {
  var self = this;
  this.context.decodeAudioData(file, function(buffer) {
    console.log(buffer);
    self.buffer = buffer;
  });
};

Sampler.prototype.loadSample = function(url) {
  console.log('get', url);
  var self = this;
  this.get(url, function(response) {
    console.log('got binary response');
    self.loadBuffer(response);
  });
  console.log(this);
  console.log(self);
};
*/

// Replace with clip
//Sampler.prototype.pattern = [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch

