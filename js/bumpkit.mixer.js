// Bumpkit Mixer

'use strict';

// Mixer
Bumpkit.Mixer = function(output) {
  //Bumpkit.call(this);
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
// May not need this with current approach
//Bumpkit.Mixer.prototype = Object.create(Bumpkit.prototype);
//Bumpkit.Mixer.prototype.contructor = Bumpkit;

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
