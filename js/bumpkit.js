// Bumpkit
//
// TO DO:
// - add offline audio context for rendering
// - add return tracks to mixer


'use strict';

console.log('Bumpkit');
try { var testcontext = new (window.AudioContext || window.webkitAudioContext)(); }
catch(e) { console.error('Web Audio API not supported in this browser.'); }

var Bumpkit = function() {
  this.self = this;
  this.context = new(window.AudioContext || window.webkitAudioContext)();
  this.speaker = this.context.destination;

  // Mixer
  this.mixer = {};
  this.mixer.master = {};
    this.mixer.master.input = this.context.createGain();
    this.mixer.master.mute = this.context.createGain();
    this.mixer.master.volume = this.context.createGain();
    this.mixer.master.input.connect(this.mixer.master.mute);
    this.mixer.master.mute.connect(this.mixer.master.volume);
    this.mixer.master.volume.connect(this.speaker);
  this.mixer.tracks = [];
};

Bumpkit.prototype.addTrack = function() {
  var track = {};
  track.input = this.context.createGain();
  track.mute = this.context.createGain();
  track.volume = this.context.createGain();
  track.input.connect(track.mute);
  track.mute.connect(track.volume);
  track.volume.connect(this.mixer.master.input);
  this.mixer.tracks.push(track);
};

Bumpkit.prototype.removeTrack = function(index) {
  this.mixer.tracks.splice(index, 1);
};


// Scheduler / Clock
Bumpkit.prototype.tempo = 120;
Bumpkit.prototype.stepDuration = function() {
  return (60/this.tempo) / 4;
};
Bumpkit.prototype.nextStepTime = 0;
Bumpkit.prototype.currentStep = 0;
Bumpkit.prototype.isPlaying  = false;
Bumpkit.prototype.loopLength = null;
Bumpkit.prototype.timerID = 0;
Bumpkit.prototype.step = new CustomEvent('step', { detail: {} });

Bumpkit.prototype.scheduleStep = function(when) {
  if (!this.context.currentTime) { // Start the clock
    var dummySource = this.context.createBufferSource();
  }
  this.step.detail.step = this.currentStep;
  this.step.detail.when = when;
  var self = this;
  console.log('step',this.currentStep);
  window.dispatchEvent(self.step);
};

Bumpkit.prototype.scheduler = function() {
  var self = this,
      scheduleAhead = .1,
      lookahead = 25;

  while (this.nextStepTime < this.context.currentTime + scheduleAhead) {
    this.scheduleStep(this.nextStepTime);
    this.nextStepTime += this.stepDuration();
    this.currentStep++;
    if (this.currentStep == this.loopLength) {
      this.currentStep = 0;
    }
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


// Trigger playback, pass source with buffer, and output node
Bumpkit.prototype.trigger = function(source, when, output, options) {
  var options = options || {};
  source.connect(output);
  console.log(when, when + options.duration);
  source.start(when, options.offset || 0);
  if (options.duration) {
    source.stop(when + options.duration);
  }
};


// Beep Subclass
// This might not be the right approach // Simple sine oscillator for metronome
var Beep = function() {
  Bumpkit.call(this);
  var self = this;
  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (self.pattern[step] == 1) {
      console.log('BEEP', step);
      self.play(when);
    };
  });
};
Beep.prototype = Object.create(Bumpkit.prototype);
Beep.prototype.contructor = Bumpkit;
Beep.prototype.duration = .0625;
Beep.prototype.pattern = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];
Beep.prototype.output = 0;
Beep.prototype.play = function(when) {
  var osc = this.context.createOscillator();
  osc.type = 0;
  osc.frequency.value = 200;
  this.trigger(osc, when, this.output, { duration: this.duration });
};
// Beep.prototype.envelopeNode;

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
  //  this.mixer.master.volume.connect(this.speaker);
};



////////////////////////////////
// Debugging and testing
var test = new Bumpkit();
console.log(test.context === test.mixer.master.volume.context);
test.addTrack();
test.addTrack();
test.loopLength = 16;
//console.log(test.context === test.mixer.tracks[0].volume.context);
var beep = new Beep();
beep.context = test.context; // Figure out how to negate the need for this
//console.log(test.context === beep.context);
beep.output = test.mixer.tracks[0].input;

