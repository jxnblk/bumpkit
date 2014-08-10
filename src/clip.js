// Clip
//
// Used for storing patterns, listening to the clock, and triggering instruments

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

  clip.toggle = function() {
    clip.active = !clip.active;
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

