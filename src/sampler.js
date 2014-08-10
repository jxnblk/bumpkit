// Bumpkit Sampler

var createSampler = function(options) {

  var self = this;
  var options = options || {};

  var Sampler = function() {
    this.output = options.connect || self.destination;
    this.offset = options.offset || 0;
    this.duration = options.duration || 0.6;

    var buffer = options.buffer || 0;
    this.buffer = function(b) {
      if (!b) return buffer;
      buffer = b;
      return this;
    };


    this.connect = function(node) {
      this.output = node;
      return this;
    };

    this.play = function(when) {
      var source = self.createBufferSource();
      var env = self.createEdgeFader({ when: when, duration: this.duration });
      source.buffer = this.buffer();
      source.connect(env);
      env.connect(this.output);
      self.trigger(source, { when: when, duration: this.duration });
      return this;
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

