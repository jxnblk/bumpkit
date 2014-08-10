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

