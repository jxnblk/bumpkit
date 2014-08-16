// MPKey Bumpkit Demo

var app = angular.module('app', ['ngTouch']);

  var bumpkit = new Bumpkit();
  bumpkit.createBeep().frequency(384);
  bumpkit.mixer = bumpkit.createMixer()
    .addTrack().addTrack().addTrack().addTrack()
    .addTrack().addTrack().addTrack().addTrack();

  bumpkit.samplers = [];
  bumpkit.samplePaths = [
    'docs/examples/mpkey/audio/kick.mp3',
    'docs/examples/mpkey/audio/rim.mp3',
    'docs/examples/mpkey/audio/snare.mp3',
    'docs/examples/mpkey/audio/clap.mp3',
    'docs/examples/mpkey/audio/tom-low.mp3',
    'docs/examples/mpkey/audio/tom-mid.mp3',
    'docs/examples/mpkey/audio/tom-hi.mp3',
    'docs/examples/mpkey/audio/hat.mp3'
  ];

  //var reverb = bumpkit.createConvolver();
  //bumpkit.mixer.tracks[0].addEffect(reverb);


  for (var i = 0; i < 8; i++) {
    var index = i;
    (function(index) {
      var sampler = bumpkit.createSampler();
      bumpkit.loadBuffer(bumpkit.samplePaths[index], function(buffer) {
        sampler.buffer(buffer).connect(bumpkit.mixer.tracks[index]);
        sampler.play((index + 1)*.125);
        bumpkit.samplers[index] = sampler;
      });
    })(i);
  };

  bumpkit.beep = bumpkit.createBeep().frequency(512);


app.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.bumpkit = bumpkit;

  $scope.play = function(i) {
    var sampler = bumpkit.samplers[i];
    sampler.play();
  };

  $scope.beep = function() {
    bumpkit.beep.play(bumpkit.currentTime);
  };

  $scope.keydown = function(e) {
    //console.log(e.which);
    if (e.which == 81) {
      // Q
      bumpkit.samplers[4].play();
    } else if (e.which == 87) {
      // W
      bumpkit.samplers[5].play();
    } else if (e.which == 69) {
      // E
      bumpkit.samplers[6].play();
    } else if (e.which == 82) {
      // R
      bumpkit.samplers[7].play();
    } else if (e.which == 65) {
      // A
      bumpkit.samplers[0].play();
    } else if (e.which == 83) {
      // S
      bumpkit.samplers[1].play();
    } else if (e.which == 68) {
      // D
      bumpkit.samplers[2].play();
    } else if (e.which == 70) {
      // R
      bumpkit.samplers[3].play();
    }
  };

  $http.get('https://bipkit.herokuapp.com/api/kits.json').success(function(response) {
    $scope.kits = response;
  });

  $scope.loadKit = function(i) {
    var kit = $scope.kits[i];
    for (var j = 0; j < kit.samples.length; j++) {
      if (j > 7) return false;
      var index = j;
      var sample = kit.samples[j];
      (function(index) {
        var sampler = bumpkit.samplers[index];
        bumpkit.loadBuffer(sample.sound, function(buffer) {
          sampler.buffer(buffer);
          sampler.play(bumpkit.currentTime + (index + 1)*.125);
        });
      })(j);
    };
  };

  $scope.loadDefaultKit = function() {
    for (var i = 0; i < 8; i++) {
      var index = i;
      (function(index) {
        var sampler = bumpkit.samplers[index];
        bumpkit.loadBuffer(bumpkit.samplePaths[index], function(buffer) {
          sampler.buffer(buffer);
          sampler.play((index + 1)*.125);
        });
      })(i);
    };
  };

}]);

