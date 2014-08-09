// Bumpkit
// audio context with decorators


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
  if (Bumpkit.buffers[url]) {
    if (callback) callback(Bumpkit.buffers[url]);
  }
  function decode(file) {
    Bumpkit.decodeAudioData(file, function(buffer) {
      Bumpkit.buffers[url] = buffer;
      if(callback) callback(buffer);
    });
  };
  Bumpkit.getArrayBuffer(url, function(response) {
    decode(response);
  });
};


