// Clip
//
// Used for storing patterns, listening to the clock,
// and triggering instruments

var Clip = function(output) {

  Bumpkit.call(this);
  var self = this;

  this.output = output || 0;
  // Is this needed?
  this.context = output.context || this.context;
  this.active = true;
  this.pattern = [];

  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (self.active && self.pattern[step] == 1) {
      self.play(when);
    };
  });

};

Clip.prototype = Object.create(Bumpkit.prototype);
Clip.prototype.constructor = Bumpkit;

Clip.prototype.play = function(when) {
  this.output.play(when);
};

