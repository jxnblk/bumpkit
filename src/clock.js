// Bumpkit Clock

//define(function() {

  var initClock = function(options) {

    var self = this;

    this.tempo = 120;
    this.isPlaying  = false;
    this.loopLength = null;
    this.timeSignature = [4,4];
    this.stepResolution = 16; // 16th note steps

    var stepDuration = function() {
      return (60/self.tempo) / 4;
    };
    var nextStepTime = 0;
    var currentStep = 0;
    var timerID = 0;
    var stepEvent = new CustomEvent('step', { detail: {} });

    var scheduleStep = function(when) {
      // Start the clock if it's not running
      if (!self.currentTime) {
        var dummySource = self.createBufferSource();
      }
      stepEvent.detail.step = currentStep;
      stepEvent.detail.when = when;
      window.dispatchEvent(stepEvent);
    };

    var scheduler = function() {
      var scheduleAhead = .1,
          lookahead = 25;

      while (nextStepTime < self.currentTime + scheduleAhead) {
        scheduleStep(nextStepTime);
        nextStepTime += stepDuration();
        currentStep++;
        if (currentStep == self.loopLength) {
          currentStep = 0;
        }
      };
      timerID = setTimeout(function() { scheduler() }, lookahead);
    };

    var stop = function() {
      self.isPlaying = false;
      window.clearTimeout(timerID);
    };

    this.playPause = function() {
      if (!self.isPlaying) {
        currentStep = 0;
        nextStepTime = self.currentTime;
        scheduler();
        self.isPlaying = !self.isPlaying;
      } else {
        stop();
      }
      return this;
    };

    return this;
  };

  //return initClock;

//});

//bumpkit.initClock();

module.exports = initClock;
