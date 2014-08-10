// Bumpkit Mixer

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
      if (track.effects.length > 0) {
        track.effectsNode.connect(track.effects[0]);
        for (var i = 0; i < track.effects.length - 1; i++) {
          console.log('multiple effects', i);
          var next = track.effects[i+1];
          track.effects[i].disconnect(0);
          track.effects[i].connect(next);
        };
        track.effects[track.effects.length - 1].disconnect(0);
        track.effects[track.effects.length - 1].connect(track.mute);
      } else {
        track.effectsNode.connect(track.mute);
      }
      return track;
    };

    track.addEffect = function(node, index) {
      var i = index || track.effects.length;
      track.effects.splice(i, 0, node);
      track.updateConnections();
      return track;
    };

    track.removeEffect = function(index) {
      track.effects.splice(index, 1);
      track.updateConnections();
      return track;
    };

    track.connect = function(node) {
      track.volume.disconnect(0);
      track.volume.connect(node);
      return track;
    };
    track.toggleMute = function() {
      track.mute.gain.value = 1 - track.mute.gain.value;
      return track;
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
    return mixer;
  };

  mixer.removeTrack = function(index) {
    mixer.tracks.splice(index, 1);
    return mixer;
  };

  return mixer;

};

module.exports = { createMixer: createMixer };

