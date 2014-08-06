// Bumpkit Clock
//
// - Consider making this its own class??

'use strict';

// Scheduler / Clock
Bumpkit.prototype.tempo = 120;
Bumpkit.prototype.stepDuration = function() {
  return (60/this.tempo) / 4;
};
Bumpkit.prototype.nextStepTime = 0;
Bumpkit.prototype.currentStep = 0;
Bumpkit.prototype.isPlaying  = false;
Bumpkit.prototype.loopLength = null;
Bumpkit.prototype.timerID = 0;
Bumpkit.prototype.step = new CustomEvent('step', { detail: {} });

Bumpkit.prototype.scheduleStep = function(when) {
  if (!this.currentTime) { // Start the clock
    var dummySource = this.createBufferSource();
  }
  this.step.detail.step = this.currentStep;
  this.step.detail.when = when;
  var self = this;
  //console.log('step',this.currentStep);
  window.dispatchEvent(self.step);
};

Bumpkit.prototype.scheduler = function() {
  var self = this,
      scheduleAhead = .1,
      lookahead = 25;

  while (this.nextStepTime < this.currentTime + scheduleAhead) {
    this.scheduleStep(this.nextStepTime);
    this.nextStepTime += this.stepDuration();
    this.currentStep++;
    if (this.currentStep == this.loopLength) {
      this.currentStep = 0;
    }
  };
  this.timerID = setTimeout(function() { self.scheduler() }, lookahead);
};

Bumpkit.prototype.stop = function() {
  var self = this;
  this.isPlaying = false;
  window.clearTimeout(self.timerID);
};

Bumpkit.prototype.playPause = function() {
  if (!this.isPlaying) {
    this.currentStep = 0;
    this.nextStepTime = this.currentTime;
    this.scheduler();
    this.isPlaying = !this.isPlaying;
  } else {
    this.stop();
  }
};


