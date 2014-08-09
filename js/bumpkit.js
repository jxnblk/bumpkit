// Bumpkit
// Main audio context with decorators


var Bumpkit = function() {

  this.trigger = function(source, options) {
    var defaults = {
      when: 0,
      offset: 0,
      output: this.destination
    }
    var options = options || defaults;
    source.connect(options.output);
    source.start(options.when, options.offset);
    if (options.duration) {
      source.stop(options.when + options.duration);
    }
  };

  this.getArrayBuffer = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function () {
      if (!xhr.response) console.error('Could not load');
      callback(xhr.response);
    };
  };

  this.buffers = {};

  this.loadBuffer = function(url, callback) {
    var self = this;
    if (self.buffers[url]) {
      if (callback) callback(self.buffers[url]);
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

};

Bumpkit.prototype = new AudioContext();
Bumpkit.prototype.constructor = Bumpkit;


/*

*/
