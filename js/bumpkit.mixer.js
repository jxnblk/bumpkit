// Bumpkit Mixer

'use strict';

// Mixer
var Mixer = function(context, output) {
 
  //Bumpkit.call(this);
 
  this.context = context;
  this.output = output || 0;

  this.master = {};
  this.master.effects = [];
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

Mixer.prototype.addTrack = function(callback) {
  var track = {};
  track.effects = [];
  track.input = this.context.createGain();
  track.mute = this.context.createGain();
  track.volume = this.context.createGain();
  track.input.connect(track.mute);
  track.mute.connect(track.volume);
  track.volume.connect(this.master.input);
  this.tracks.push(track);
  if (callback) callback({ track: track, index: this.tracks.length - 1 });
};

Mixer.prototype.removeTrack = function(index) {
  this.tracks.splice(index, 1);
};

Mixer.prototype.addEffect = function(track, effect) {
  track.effects.push(effect);
  track.input.disconnect(0);
  track.input.connect(track.effects[0]);
  for (var i = 0; i < track.effects.length - 1; i++) {
    console.log('multiple effect', i);
    var next = track.effects[i+1];
    track.effects[i].disconnect(0);
    track.effects[i].connect(next);
  };
  track.effects[track.effects.length - 1].connect(track.mute);
};

Mixer.prototype.removeEffect = function(track, index) {
};

