// Bumpkit Sampler

//var Sampler = function(output) {
bumpkit.createSampler = function(options) {

  var self = this;

  var Sampler = function() {
    this.output = 0;
    this.offset = 0;
    this.duration = 0.6;
    this.buffer = 0;

    this.connect = function(node) {
    };

    this.play = function(when) {
    };

  };

  return new Sampler();

};

/*
Sampler.prototype.buffer;

Sampler.prototype.play = function(when) {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  this.trigger(source, when, this.output, { duration: this.duration });
};
*/

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch

