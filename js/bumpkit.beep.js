// Beep Subclass
// Simple sine oscillator for metronome
  // This might not be the right approach
var Beep = function(output) {
  Bumpkit.call(this);
  this.output = output || 0;
  var self = this;
  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (self.pattern[step] == 1) {
      //console.log('BEEP', step);
      self.play(when);
    };
  });
};
Beep.prototype = Object.create(Bumpkit.prototype);
Beep.prototype.contructor = Bumpkit;
Beep.prototype.duration = .0625;
Beep.prototype.frequency = 200;
Beep.prototype.pattern = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];
Beep.prototype.output = 0;
Beep.prototype.play = function(when) {
  var osc = this.output.context.createOscillator();
  osc.type = 0;
  osc.frequency.value = this.frequency;
  this.trigger(osc, when, this.output, { duration: this.duration });
};
// Beep.prototype.envelopeNode;
