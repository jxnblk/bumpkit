// Beep Subclass
// Simple sine oscillator for metronome

bumpkit.createBeep = function(options) {

  // TO DO Handle options
 
  var self = this;

  var Beep = function() {

    this.duration = .0625;
    this.frequency = 256;
    this.output = 0;

    this.connect = function(node) {
      this.output = node;
    };

    this.play = function(when) {
      var osc = self.createOscillator();
      osc.type = 0;
      osc.frequency.value = this.frequency;
      self.trigger(osc, { when: when, output: this.output, duration: beep.duration });
    };

  };


  return new Beep();


};

/*
bumpkit.Beep.prototype.connect = function(node) {
  this.output = node;
};

bumpkit.Beep.prototype.play = function(when) {
  var osc = bumpkit.createOscillator();
  osc.type = 0;
  osc.frequency.value = this.frequency;
  bumpkit.trigger(osc, { when: when, output: this.output, duration: this.duration });
};
*/

// Beep.prototype.envelopeNode;

