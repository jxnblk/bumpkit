// Compressor

// This doesn't provide any extra utility
// Ditch this

var Compressor = function(output) {

  Bumpkit.call(this);
  this.output = output || 0;
  if (output) this.context = output.context;
  this.node = this.context.createDynamicsCompressor();

};

Compressor.prototype = Object.create(Bumpkit.prototype);
Compressor.prototype.constructor = Bumpkit;
