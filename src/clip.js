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

