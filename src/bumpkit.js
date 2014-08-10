var clock = require('./clock');
var mixer = require('./mixer');
var clip = require('./clip');

var beep = require('./beep');
var sampler = require('./sampler');

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

