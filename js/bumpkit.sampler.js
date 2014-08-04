// Bumpkit Sampler

'use strict';

Bumpkit.Sampler = function(output) {
  Bumpkit.call(this);
  this.output = output || 0;
  this.context = this.output.context;
  this.offset = 0;
  this.duration = 0.6;

  // Move pattern controller to separate object
  var self = this;
  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (self.pattern[step] == 1) {
      self.play(when)
    }
  });
};

Bumpkit.Sampler.prototype = Object.create(Bumpkit.prototype);
Bumpkit.Sampler.prototype.constructor = Bumpkit;
Bumpkit.Sampler.prototype.buffer;

Bumpkit.Sampler.prototype.play = function(when) {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  this.trigger(source, when, this.output, { duration: this.duration });
};

Bumpkit.Sampler.prototype.loadBuffer = function(file) {
  var self = this;
  this.context.decodeAudioData(file, function(buffer) {
    console.log(buffer);
    self.buffer = buffer;
  });
};

Bumpkit.Sampler.prototype.loadSample = function(url) {
  console.log('get', url);
  var self = this;
  this.get(url, function(response) {
    console.log('got binary response');
    self.loadBuffer(response);
  });
  console.log(this);
  console.log(self);
};

Bumpkit.Sampler.prototype.pattern = [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch

