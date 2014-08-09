// Bumpkit
// Main audio context with decorators


var Bumpkit = window.AudioContext || window.webkitAudioContext;

Bumpkit.prototype.trigger = function() {
  console.log('hi', this.currentTime);
  this.source = 0;
};

Bumpkit.prototype.Beep = function() {
  console.log('Beep', this);
  this.a = 'test';
  this.context = Bumpkit;
};



