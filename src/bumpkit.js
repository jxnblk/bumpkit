var clock = require('./clock');
var mixer = require('./mixer');
var clip = require('./clip');

var edgeFader = require('./edge-fader');
var beep = require('./beep');
var sampler = require('./sampler');

var peakAnalyser = require('./peak-analyser');
var analyser = require('./analyser');

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

