// Bumpkit Mixer
//
var createMixer = function() {
   
  var self = this;
  var mixer = {};


  var Track = function() {

    var track = self.createGain();
    track.effectsNode = self.createGain();
    track.mute = self.createGain();
    track.volume = self.createGain();
    track.effects = [];
    track.connect(track.effectsNode);
    track.effectsNode.connect(track.mute);
    track.mute.connect(track.volume);

    track.updateConnections = function() {
      track.effectsNode.disconnect(0);
      track.effectsNode.connect(track.effects[0]);
      for (var i = 0; i < track.effects.length - 1; i++) {
        console.log('multiple effects', i);
        var next = track.effects[i+1];
        track.effects[i].disconnect(0);
        track.effects[i].connect(next);
      };
      track.effects[track.effects.length - 1].connect(track.mute);
    };

    track.addEffect = function(node, index) {
      var i = index || track.effects.length;
      track.effects.splice(i, 0, node);
      track.updateConnections();
    };

    track.connect = function(node) {
      track.volume.connect(node);
    };
    track.toggleMute = function() {
      track.mute.gain.value = 1 - track.mute.gain.value;
    };

    return track;

  };


  mixer.master = new Track();
  mixer.master.connect(self.destination);

  mixer.tracks = [];

  mixer.addTrack = function() {
    var track = new Track();
    track.connect(mixer.master);
    mixer.tracks.push(track);
    // callback?
    return this;
  };

  mixer.removeTrack = function(index) {
    self.tracks.splice(index, 1);
  };

  //mixer.addEffect = function(track, node) {
  //};

  return mixer;

};

module.exports = { createMixer: createMixer };

/*
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
