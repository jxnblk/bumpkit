// Audio Analysers

var createAmplitudeAnalyser = function(options) {

  var self = this;

  var analyser = self.createAnalyser();
  analyser.fftSize = 32;
  var bufferLength = analyser.frequencyBinCount;
  var array = new Uint8Array(bufferLength);

  analyser.amp = function() {
    analyser.getByteTimeDomainData(array);
    return(array[0]);
  };

  return analyser;
  
};

var createFrequencyAnalyser = function(options) {
};

module.exports = {
  createAmplitudeAnalyser: createAmplitudeAnalyser
}

