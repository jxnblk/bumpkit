// Bumpkit Mixer

'use strict';

// Unsure of how to split this out
Bumpkit.prototype.mixer = {
  master: {},
  master.input: this.context.createGain(),
  master.mute: = this.context.createGain(),
  master.volume: = this.context.createGain(),
  master.input.connect(this.mixer.master.mute),
  master.mute.connect(this.mixer.master.volume),
  master.volume.connect(this.speaker),
  tracks: [],
};

Bumpkit.prototype.addTrack = function() {
  var track = {};
  track.input = this.context.createGain();
  track.mute = this.context.createGain();
  track.volume = this.context.createGain();
  track.input.connect(track.mute);
  track.mute.connect(track.volume);
  console.log(this.mixer);
  track.volume.connect(this.mixer.master.input);
  this.mixer.tracks.push(track);
};

Bumpkit.prototype.removeTrack = function(index) {
  this.mixer.tracks.splice(index, 1);
};
