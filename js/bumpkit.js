
'use strict';

console.log('Bumpkit');
  try {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }
  catch(e) {
    console.error('Web Audio API not supported in this browser.');
  }

var Bumpkit = function() {};

// Initialize context
Bumpkit.prototype.context = new(window.AudioContext || window.webkitAudioContext)();

// Speaker Destination
Bumpkit.prototype.speaker = this.context.destination;
// Add offline audio context for renderer


// Mixer

// Generic track object
var Track = function() {
  this.input = self.context.createGain();
  this.mute = self.context.createGain();
  this.volume = self.context.createGain();
  // Add effects chain array and compressor node
  this.input.connect(this.mute);
  this.mute.connect(this.volume);
};

Bumpkit.prototype.mixer = function() {
};

Bumpkit.prototype.mixer.tracks = [];
Bumpkit.prototype.mixer.master = new Track();
// Connect master to speaker
//Bumpkit.prototype.mixer.master.volume.connect(this.speaker);

Bumpkit.prototype.mixer.addTrack = function() {
  var track = new Track();
  track.volume.connect(this.master.input);
  this.tracks.push(track);
};

Bumpkit.prototype.mixer.removeTrack = function(index) {
  this.tracks.splice(index, 1);
};


// Bootstrap and connect the mixer
Bumpkit.prototype.init = function() {
  // Connect master channel to speaker
  this.mixer.master.volume.connect(this.speaker);
};



////////////////////////////////
// Debugging
var test = new Bumpkit();
test.init();
test.mixer.addTrack();
console.log(test.mixer.master);
console.log(test.mixer.tracks);

