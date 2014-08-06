// Bumpkit Sampler

'use strict';

var Sampler = function(output) {

  Bumpkit.call(this);

  this.output = output || 0;
  this.context = this.output.context;
  this.offset = 0;
  this.duration = 0.6;
  this.pitch = 0;

};

Sampler.prototype = Object.create(Bumpkit.prototype);
Sampler.prototype.constructor = Bumpkit;

Sampler.prototype.buffer;

Sampler.prototype.play = function(when) {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  this.trigger(source, when, this.output, { duration: this.duration });
};

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch

