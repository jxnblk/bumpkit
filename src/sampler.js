// Bumpkit Sampler

var createSampler = function(options) {

  var self = this;
  var options = options || {};

  var Sampler = function() {
    this.output = options.output || self.destination;
    this.offset = options.offset || 0;
    this.duration = options.duration || 0.6;
    this.buffer = options.buffer || 0;

    this.connect = function(node) {
      this.output = node;
    };

    this.play = function(when) {
      var source = self.createBufferSource();
      source.buffer = this.buffer;
      self.trigger(source, { when: when, output: this.output, duration: this.duration });
    };

  };

  return new Sampler();

};

module.exports = {
  createSampler: createSampler
}

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch

