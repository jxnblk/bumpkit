// Beep Subclass
// Simple sine oscillator for metronome


var createBeep = function(options) {
  var self = this;
  var options = options || {};

  var Beep = function() {

    this.duration = options.duration || .0625;
    //this.frequency = options.frequency || 256;
    this.output = options.connect || self.destination;
    this.envelope = function() {
      var gain = self.createGain();
    };

    var freq = options.frequency || 256;
    this.frequency = function(newFreq) {
      if (!newFreq) return freq;
      freq = newFreq;
      return this;
    };

    this.connect = function(node) {
      this.output = node;
      return this;
    };

    this.play = function(when) {
      var when = when || self.currentTime;
      var osc = self.createOscillator();
      var env = self.createEdgeFader({ when: when, duration: this.duration });
      osc.type = 0;
      osc.frequency.value = this.frequency();
      osc.connect(env);
      env.connect(this.output);
      self.trigger(osc, { when: when, duration: this.duration });
      return this;
    };

  };

  return new Beep();

};

module.exports = {
  createBeep: createBeep
};

