// Bumpkit
//
// TO DO:
// - add offline audio context for rendering
// - add return tracks to mixer


'use strict';

// from: https://github.com/mmckegg/inheritable-audio-context
var AudioContext = (window.AudioContext || window.webkitAudioContext);
var baseContext = new AudioContext();

//function InheritableAudioContext(audioContext, copyExtendedAttributes){
function Bumpkit(audioContext, copyExtendedAttributes){
  if (!(this instanceof Bumpkit)){
    if (audioContext && audioContext instanceof Bumpkit){
      return Object.create(audioContext)
    } else {
      return new Bumpkit(audioContext, copyExtendedAttributes)
    }
  }

  this.parentContext = audioContext || baseContext

    if (audioContext && copyExtendedAttributes){
      for (var k in audioContext){
        if (k in audioContext && baseContext[k] == undefined){
          this[k] = audioContext[k]
        }
      }
    }
};

function functionProxy(k){
  return function(){
    return this.parentContext[k].apply(this.parentContext, arguments)
  }
};

function proxyProperty(target, k){
  Object.defineProperty(target, k, {
    get: function(){
      return this.parentContext[k]
    }
  })
};

var proto = Bumpkit.prototype = {
  constructor : Bumpkit
}

for (var k in baseContext){
  if (typeof baseContext[k] == 'function'){
    proto[k] = functionProxy(k)
  }
}

proxyProperty(proto, 'currentTime')
proxyProperty(proto, 'sampleRate')
proxyProperty(proto, 'destination')
proxyProperty(proto, 'listener')


//var Bumpkit = InheritableAudioContext;

//var Bumpkit = function() {
//  var self = this;
//  try {
//    console.log('Bumpkit');
//    //self = new (window.AudioContext || window.webkitAudioContext)();
//  }
//  catch (e) {
//    console.log(e);
//  }
//  this.context = this.context || new (window.AudioContext || window.webkitAudioContext)();
//  // Use the same name?
//  //this.speaker = this.destination;
//};


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
    self.decodeAudioData(file, function(buffer) {
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

