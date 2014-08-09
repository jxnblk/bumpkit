// Clip
//
// Used for storing patterns, listening to the clock,
// and triggering instruments

bumpkit.createClip = function(options) {

  // TO DO: handle options
 
  var self = this;

  var clip = {};
  clip.output = 0;
  clip.active = true;
  clip.pattern = [];

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

