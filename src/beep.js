// Beep Subclass
// Simple sine oscillator for metronome

var createBeep = function(options) {
  var self = this;
  var options = options || {};

  var Beep = function() {

    this.duration = options.duration || .0625;
    this.frequency = options.frequency || 256;
    this.output = options.output || self.destination;
    //this.envelope = 0;

    this.connect = function(node) {
      this.output = node;
    };

    this.play = function(when) {
      var osc = self.createOscillator();
      osc.type = 0;
      osc.frequency.value = this.frequency;
      self.trigger(osc, { when: when, output: this.output, duration: this.duration });
    };

  };

  return new Beep();

};

module.exports = {
  createBeep: createBeep
};

