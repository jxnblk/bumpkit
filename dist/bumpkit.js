!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Bumpkit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// Beep Subclass
// Simple sine oscillator for metronome

var createBeep = function(options) {
  var self = this;
  var options = options || {};

  var Beep = function() {

    this.duration = options.duration || .0625;
    this.frequency = options.frequency || 256;
    this.output = options.output || self.destination;
    //this.envelope = 0;

    this.connect = function(node) {
      this.output = node;
    };

    this.play = function(when) {
      var osc = self.createOscillator();
      osc.type = 0;
      osc.frequency.value = this.frequency;
      self.trigger(osc, { when: when, output: this.output, duration: this.duration });
    };

  };

  return new Beep();

};

module.exports = {
  createBeep: createBeep
};


},{}],2:[function(_dereq_,module,exports){
// Clip
//
// Used for storing patterns, listening to the clock,
// and triggering instruments

var createClip = function(options) {

  var options = options || {};
  var clip = {};
  clip.output = options.output || 0;
  clip.active = options.active || true;
  clip.pattern = options.pattern || [];

  clip.connect = function(node) {
    clip.output = node;
  };

  clip.play = function(when) {
    clip.output.play(when);
  };

  window.addEventListener('step', function(e) {
    var step = e.detail.step;
    var when = e.detail.when;
    if (clip.active && clip.pattern[step] == 1) {
      clip.play(when);
    };
  });

  return clip;

};

module.exports = {
  createClip: createClip
}


},{}],3:[function(_dereq_,module,exports){
// Bumpkit Clock

//define(function() {

  var initClock = function() {

    var self = this;

    this.tempo = 120;
    this.isPlaying  = false;
    this.loopLength = null;
    this.timeSignature = [4,4];
    this.stepResolution = 16; // 16th note steps

    var stepDuration = function() {
      return (60/self.tempo) / 4;
    };
    var nextStepTime = 0;
    var currentStep = 0;
    var timerID = 0;
    var stepEvent = new CustomEvent('step', { detail: {} });

    var scheduleStep = function(when) {
      // Start the clock if it's not running
      if (!self.currentTime) {
        var dummySource = self.createBufferSource();
      }
      stepEvent.detail.step = currentStep;
      stepEvent.detail.when = when;
      window.dispatchEvent(stepEvent);
    };

    var scheduler = function() {
      var scheduleAhead = .1,
          lookahead = 25;

      while (nextStepTime < self.currentTime + scheduleAhead) {
        scheduleStep(nextStepTime);
        nextStepTime += stepDuration();
        currentStep++;
        if (currentStep == self.loopLength) {
          currentStep = 0;
        }
      };
      timerID = setTimeout(function() { scheduler() }, lookahead);
    };

    var stop = function() {
      self.isPlaying = false;
      window.clearTimeout(timerID);
    };

    this.playPause = function() {
      if (!self.isPlaying) {
        currentStep = 0;
        nextStepTime = self.currentTime;
        scheduler();
        self.isPlaying = !self.isPlaying;
      } else {
        stop();
      }
    };

    return this;
  };

  //return initClock;

//});

//bumpkit.initClock();

module.exports = initClock;

},{}],4:[function(_dereq_,module,exports){
var clock = _dereq_('./clock');
var mixer = _dereq_('./mixer');
var clip = _dereq_('./clip');

var beep = _dereq_('./beep');
var sampler = _dereq_('./sampler');

var Bumpkit = function() {

  try {
    var bumpkit = new AudioContext() || new webkitAudioContext();
  }
  catch(e) {
    console.error('Web Audio API not supported in this browser');
  }

  bumpkit.trigger = function(source, options) {
    var options = {
      when: options.when || 0,
      offset: options.offset || 0,
      duration: options.duration || 0,
      output: options.output || 0
    };
    source.connect(options.output);
    source.start(options.when, options.offset || 0);
    if (options.duration) {
      source.stop(options.when + options.duration);
    }
  };

  bumpkit.getArrayBuffer = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function () {
      if (!xhr.response) console.error('Could not load');
      callback(xhr.response);
    };
  };

  bumpkit.buffers = {};

  bumpkit.loadBuffer = function(url, callback) {
    var self = this;
    if (this.buffers[url]) {
      if (callback) callback(this.buffers[url]);
    }
    function decode(file) {
      self.decodeAudioData(file, function(buffer) {
        self.buffers[url] = buffer;
        if(callback) callback(buffer);
      });
    };
    this.getArrayBuffer(url, function(response) {
      decode(response);
    });
  };

  bumpkit.initClock = clock;
  bumpkit.initClock();

  bumpkit.createMixer = mixer.createMixer;

  bumpkit.createBeep = beep.createBeep;
  bumpkit.createSampler = sampler.createSampler;
  bumpkit.createClip = clip.createClip;

  return bumpkit;
 
};

module.exports = Bumpkit;


},{"./beep":1,"./clip":2,"./clock":3,"./mixer":5,"./sampler":6}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
// Bumpkit Sampler

var createSampler = function(options) {

  var self = this;
  var options = options || {};

  var Sampler = function() {
    this.output = options.output || self.destination;
    this.offset = options.offset || 0;
    this.duration = options.duration || 0.6;
    this.buffer = options.buffer || 0;

    this.connect = function(node) {
      this.output = node;
    };

    this.play = function(when) {
      var source = self.createBufferSource();
      source.buffer = this.buffer;
      self.trigger(source, { when: when, output: this.output, duration: this.duration });
    };

  };

  return new Sampler();

};

module.exports = {
  createSampler: createSampler
}

// TO DO:
// - envelopeNode
// - ASDR
// - Pitch


},{}]},{},[4])
(4)
});