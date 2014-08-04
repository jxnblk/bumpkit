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
  this.context = this.context || new (window.AudioContext || window.webkitAudioContext)();
  this.speaker = this.context.destination;
  // Mixer
  //this.mixer = {};
  //this.mixer.master = {};
  //  this.mixer.master.input = this.context.createGain();
  //  this.mixer.master.mute = this.context.createGain();
  //  this.mixer.master.volume = this.context.createGain();
  //  this.mixer.master.input.connect(this.mixer.master.mute);
  //  this.mixer.master.mute.connect(this.mixer.master.volume);
  //  this.mixer.master.volume.connect(this.speaker);
  //this.mixer.tracks = [];
};

/*
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
*/

// Trigger playback, pass source with buffer, and output node
Bumpkit.prototype.trigger = function(source, when, output, options) {
  var options = options || {};
  source.connect(output);
  source.start(when, options.offset || 0);
  if (options.duration) {
    source.stop(when + options.duration);
  }
};

// Mixer v2
Bumpkit.Mixer = function(output) {
  this.output = output || 0;
  this.context = this.output.context;

  this.master = {};
  this.master.input = this.context.createGain();
  this.master.mute = this.context.createGain();
  this.master.volume = this.context.createGain();
  this.master.input.connect(this.master.mute);
  this.master.mute.connect(this.master.volume);
  this.master.volume.connect(this.output);

  this.tracks = [];
};

Bumpkit.Mixer.prototype.addTrack = function(callback) {
  var track = {};
  track.input = this.context.createGain();
  track.mute = this.context.createGain();
  track.volume = this.context.createGain();
  track.input.connect(track.mute);
  track.mute.connect(track.volume);
  track.volume.connect(this.master.input);
  this.tracks.push(track);
  if (callback) callback({ track: track, index: this.tracks.length - 1 });
};

Bumpkit.Mixer.prototype.removeTrack = function(index) {
  this.tracks.splice(index, 1);
};

