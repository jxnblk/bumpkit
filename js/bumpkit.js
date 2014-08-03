
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


Bumpkit.prototype.mixer = function() {};

// Generic track object
// TO DO: Figure out the best way to implement this
Bumpkit.Track = function() {
  this.input = self.context.createGain();
  this.mute = self.context.createGain();
  this.volume = self.context.createGain();
  // Add effects chain array and compressor node
  this.input.connect(this.mute);
  this.mute.connect(this.volume);
};

Bumpkit.prototype.mixer.tracks = [];
Bumpkit.prototype.mixer.master = new Bumpkit.Track();
// TO DO: Connect master to speaker
//Bumpkit.prototype.mixer.master.volume.connect(this.speaker);

Bumpkit.prototype.mixer.addTrack = function() {
  var track = new Bumpkit.Track();
  track.volume.connect(this.master.input);
  this.tracks.push(track);
};

Bumpkit.prototype.mixer.removeTrack = function(index) {
  this.tracks.splice(index, 1);
};


// Scheduler / Clock
Bumpkit.prototype.tempo = 120;
Bumpkit.prototype.stepDuration = (60/120) / 4;
Bumpkit.prototype.nextStepTime = 0;
Bumpkit.prototype.currentStep = 0;
Bumpkit.prototype.isPlaying  = false;
Bumpkit.prototype.loopLength = null;
Bumpkit.prototype.timerID = 0;


//Bumpkit.prototype.step = new CustomEvent('step', function() {
//  return { detail: { step: this.currentStep, test: 'derp' } };
//});
Bumpkit.prototype.step = new CustomEvent('step', { detail: {} });

Bumpkit.prototype.scheduleStep = function(when) {
  if (!this.context.currentTime) { // Start the clock
    var dummySource = this.context.createBufferSource();
  }
  this.step.detail.step = this.currentStep;
  var self = this;
  window.dispatchEvent(self.step);
};

Bumpkit.prototype.scheduler = function() {
  var self = this,
      scheduleAhead = .1,
      lookahead = 25;

  while (this.nextStepTime < this.context.currentTime + scheduleAhead) {
    this.scheduleStep(this.nextStepTime);
    this.nextStepTime += this.stepDuration;
    this.currentStep++;
  };
  this.timerID = setTimeout(function() { self.scheduler() }, lookahead);
};

Bumpkit.prototype.stop = function() {
  var self = this;
  this.isPlaying = false;
  window.clearTimeout(self.timerID);
};

Bumpkit.prototype.playPause = function() {
  if (!this.isPlaying) {
    this.currentStep = 0;
    this.nextStepTime = this.context.currentTime;
    this.scheduler();
    this.isPlaying = !this.isPlaying;
  } else {
    this.stop();
  }
};

//
// Trigger playback, pass source with buffer, and output node
Bumpkit.prototype.trigger = function(source, when, output, options) {
  source.connect(output);
  source.start(when, options.offset || 0);
  if (options.duration) {
    source.stop(when + options.duration);
  }
};



// Sampler
  // loadSample
  // offset
  // duration
  // envelopeNode
  // ASDR
  // Pitch



// Bootstrap and connect the mixer
Bumpkit.prototype.init = function() {
  // TO DO: Figure out best implementation
  // Connect master channel to speaker
  this.mixer.master.volume.connect(this.speaker);
};



////////////////////////////////
// Debugging and testing
var test = new Bumpkit();
test.init();
test.mixer.addTrack();
test.mixer.addTrack();
console.log('master and tracks ', test.mixer.master, test.mixer.tracks);
test.mixer.removeTrack(0);
console.log('removed track 0', test.mixer.tracks);
console.log('tempo and stepDuration:', test.tempo, test.stepDuration);
window.addEventListener('step', function(e) {
  console.log('test step', e.detail.step);
});

