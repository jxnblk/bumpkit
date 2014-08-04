// Beep Subclass
// Simple sine oscillator for metronome
Bumpkit.Beep = function(output) {
  Bumpkit.call(this);
  this.output = output || 0;
  this.context = output.context;
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

Bumpkit.Beep.prototype = Object.create(Bumpkit.prototype);
Bumpkit.Beep.prototype.contructor = Bumpkit;

Bumpkit.Beep.prototype.duration = .0625;
Bumpkit.Beep.prototype.frequency = 200;
Bumpkit.Beep.prototype.pattern = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];
Bumpkit.Beep.prototype.output = 0;
Bumpkit.Beep.prototype.play = function(when) {
  var osc = this.context.createOscillator();
  osc.type = 0;
  osc.frequency.value = this.frequency;
  this.trigger(osc, when, this.output, { duration: this.duration });
};

// Beep.prototype.envelopeNode;

