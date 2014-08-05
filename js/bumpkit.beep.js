// Beep Subclass
// Simple sine oscillator for metronome
var Beep = function(output) {

  Bumpkit.call(this);

  this.output = output || 0;
  this.context = output.context;
  this.duration = .0625;
  this.frequency = 256;

};

Beep.prototype = Object.create(Bumpkit.prototype);
Beep.prototype.contructor = Bumpkit;

Beep.prototype.play = function(when) {
  var osc = this.context.createOscillator();
  osc.type = 0;
  osc.frequency.value = this.frequency;
  this.trigger(osc, when, this.output, { duration: this.duration });
};

// Beep.prototype.envelopeNode;

