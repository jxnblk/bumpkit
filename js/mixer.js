// Bumpkit Mixer

bumpkit.createMixer = function() {
 
  var self = this;
  var mixer = {};

  var Track = function() {
    var track = self.createGain();
    track.mute = self.createGain();
    track.volume = self.createGain();
    track.effects = [];
    track.connect(track.mute);
    track.mute.connect(track.volume);
    this.connect = function(node) {
      track.volume.connect(node);
    };
    return track;
  };
  mixer.master = new Track();
  mixer.master.connect(self.destination);

  mixer.tracks = [];

  mixer.addTrack = function() {
  };
  mixer.removeTrack = function() {
  };

  return mixer;

};

/*
Bumpkit.createMixer.prototype.addTrack = function(callback) {
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

Bumpkit.createMixer.prototype.removeTrack = function(index) {
  this.tracks.splice(index, 1);
};

Bumpkit.createMixer.prototype.addEffect = function(track, effect) {
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

Bumpkit.createMixer.prototype.removeEffect = function(track, index) {
};
*/
