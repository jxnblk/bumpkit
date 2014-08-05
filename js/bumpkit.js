// Bumpkit
//
// TO DO:
// - add offline audio context for rendering
// - add return tracks to mixer


'use strict';

console.log('Bumpkit');
try { var testcontext = new (window.AudioContext || window.webkitAudioContext)(); }
catch(e) { console.error('Web Audio API not supported in this browser.'); }

var Bumpkit = function() {
  this.self = this;
  this.context = this.context || new (window.AudioContext || window.webkitAudioContext)();
  this.speaker = this.context.destination;
};


// Trigger playback, pass source with buffer, and output node
Bumpkit.prototype.trigger = function(source, when, output, options) {
  var options = options || {};
  source.connect(output);
  source.start(when, options.offset || 0);
  if (options.duration) {
    source.stop(when + options.duration);
  }
};

Bumpkit.prototype.get = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'arraybuffer';
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onload = function () {
    if (!xhr.response) console.error('Could not load');
    callback(xhr.response);
  };
};

Bumpkit.prototype.buffers = {};

Bumpkit.prototype.loadBuffer = function(url, callback) {
  var self = this;
  if (self.buffers[url]) {
    if (callback) callback(self.buffers[url]);
  }
  function decode(file) {
    self.context.decodeAudioData(file, function(buffer) {
      self.buffers[url] = buffer;
      if(callback) callback(buffer);
    });
  };
  this.get(url, function(response) {
    decode(response);
  });
  // Maybe use promises?
  // return self.buffers[url];
};

