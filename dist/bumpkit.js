!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Bumpkit=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// Audio Analysers

var createAmplitudeAnalyser = function(options) {

  var self = this;

  var analyser = self.createAnalyser();
  analyser.fftSize = 32;
  var bufferLength = analyser.frequencyBinCount;
  var array = new Uint8Array(bufferLength);

  analyser.amp = function() {
    analyser.getByteTimeDomainData(array);
    return(array[0]);
  };

  return analyser;
  
};

var createFrequencyAnalyser = function(options) {
};

module.exports = {
  createAmplitudeAnalyser: createAmplitudeAnalyser
}


},{}],2:[function(_dereq_,module,exports){
// Beep Subclass
// Simple sine oscillator for metronome


var createBeep = function(options) {
  var self = this;
  var options = options || {};

  var Beep = function() {

    this.duration = options.duration || .0625;
    //this.frequency = options.frequency || 256;
    this.output = options.connect || self.destination;
    this.envelope = function() {
      var gain = self.createGain();
    };

    var freq = options.frequency || 256;
    this.frequency = function(newFreq) {
      if (!newFreq) return freq;
      freq = newFreq;
      return this;
    };

    this.connect = function(node) {
      this.output = node;
      return this;
    };

    this.play = function(when) {
      var when = when || 0;
      var osc = self.createOscillator();
      var env = self.createEdgeFader({ when: when, duration: this.duration });
      osc.type = 0;
      osc.frequency.value = this.frequency();
      osc.connect(env);
      env.connect(this.output);
      self.trigger(osc, { when: when, duration: this.duration });
      return this;
    };

  };

  return new Beep();

};

module.exports = {
  createBeep: createBeep
};


},{}],3:[function(_dereq_,module,exports){
// Clip
//
// Used for storing patterns, listening to the clock, and triggering instruments

var createClip = function(options) {

  var options = options || {};

  // Change this to a class to support chaining on creation

  var clip = {};
  clip.output = options.connect || 0;
  clip.active = options.active || true;
  clip.pattern = options.pattern || [];

  clip.connect = function(node) {
    clip.output = node;
    return clip;
  };

  clip.play = function(when) {
    clip.output.play(when);
    return clip;
  };

  clip.toggle = function() {
    clip.active = !clip.active;
    return clip;
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


},{}],4:[function(_dereq_,module,exports){
// Bumpkit Clock

//define(function() {

  var initClock = function(options) {

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
      return this;
    };

    return this;
  };

  //return initClock;

//});

//bumpkit.initClock();

module.exports = initClock;

},{}],5:[function(_dereq_,module,exports){
// Edge Fader envelope
// For fading non-zero crossing popping sounds

var createEdgeFader = function(options) {

  var options = options || {};
  var when = options.when || 0;
  var duration = options.duration || 0;
  var fadeDuration = options.fadeDuration || 0.005;

  var env = this.createGain();

  env.gain.linearRampToValueAtTime(0, this.currentTime + when);
  env.gain.linearRampToValueAtTime(1, this.currentTime + when + fadeDuration);
  env.gain.linearRampToValueAtTime(1, this.currentTime + when + duration - fadeDuration);
  env.gain.linearRampToValueAtTime(0, this.currentTime + when + duration);

  return env;

};

module.exports = { createEdgeFader: createEdgeFader };


},{}],6:[function(_dereq_,module,exports){
var clock = _dereq_('./clock');
var mixer = _dereq_('./mixer');
var clip = _dereq_('./clip');

var edgeFader = _dereq_('./edge-fader');
var beep = _dereq_('./beep');
var sampler = _dereq_('./sampler');

var peakAnalyser = _dereq_('./peak-analyser');
var analyser = _dereq_('./analyser');

var Bumpkit = function() {

  //try {
    //var window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var bumpkit = new (window.AudioContext || window.webkitAudioContext)(); 
  //}
  //catch {
  //  console.error('Web Audio API not supported in this browser');
  //}

  bumpkit.trigger = function(source, options) {
    var options = {
      when: options.when || 0,
      offset: options.offset || 0,
      duration: options.duration || 0
    };
    source.start(options.when, options.offset || 0);
    if (options.duration) {
      source.stop(options.when + options.duration);
    }
    return this;
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
    function getArrayBuffer(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url, true);
      xhr.send();
      xhr.onload = function () {
        if (!xhr.response) console.error('Could not load');
        callback(xhr.response);
      };
    };
    getArrayBuffer(url, function(response) {
      decode(response);
    });
    return this;
  };

  bumpkit.initClock = clock;
  bumpkit.initClock();

  bumpkit.createMixer = mixer.createMixer;

  bumpkit.createEdgeFader = edgeFader.createEdgeFader;
  bumpkit.createBeep = beep.createBeep;
  bumpkit.createSampler = sampler.createSampler;
  bumpkit.createClip = clip.createClip;

  bumpkit.createAmplitudeAnalyser = analyser.createAmplitudeAnalyser;

  bumpkit.analysePeaks = peakAnalyser.analysePeaks;

  return bumpkit;
 
};

module.exports = Bumpkit;


},{"./analyser":1,"./beep":2,"./clip":3,"./clock":4,"./edge-fader":5,"./mixer":7,"./peak-analyser":8,"./sampler":9}],7:[function(_dereq_,module,exports){
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


},{}],8:[function(_dereq_,module,exports){
// Peak Analyser

var analysePeaks = function(buffer) {

    var length = 256;
    var sampleSize = buffer.length / length;
    var sampleStep = ~~(sampleSize / 10) || 1;
    var channels = buffer.numberOfChannels;
    var peaks = new Float32Array(length);

    for (var c = 0; c < channels; c++) {
      var chan = buffer.getChannelData(c);
      for (var i = 0; i < length; i++) {
        var start = ~~(i * sampleSize);
        var end = ~~(start + sampleSize);
        var max = 0;
        for (var j = start; j < end; j += sampleStep) {
          var value = chan[j];
          if (value > max) {
            max = value;
            // faster than Math.abs
          } else if (-value > max) {
            max = -value;
          }
        }
        if (c == 0 || max > peaks[i]) {
          peaks[i] = max;
        }
      }
    }

    return peaks;

};

module.exports = { analysePeaks: analysePeaks };


},{}],9:[function(_dereq_,module,exports){
// Bumpkit Sampler

var createSampler = function(options) {

  var self = this;
  var options = options || {};

  var Sampler = function() {
    this.output = options.connect || self.destination;
    this.offset = options.offset || 0;
    this.duration = options.duration || 0.6;

    var buffer = options.buffer || 0;
    this.buffer = function(b) {
      if (!b) return buffer;
      buffer = b;
      return this;
    };

    this.connect = function(node) {
      this.output = node;
      return this;
    };

    this.play = function(when) {
      var source = self.createBufferSource();
      var env = self.createEdgeFader({ when: when, duration: this.duration });
      source.buffer = this.buffer();
      source.connect(env);
      env.connect(this.output);
      self.trigger(source, { when: when, duration: this.duration });
      return this;
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


},{}]},{},[6])
(6)
});