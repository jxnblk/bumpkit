'use strict';

var bumpkit = angular.module('bumpkit', ['ngRoute']);

bumpkit.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', { templateUrl: 'views/main.html', controller: 'MainCtrl'});
}]);

bumpkit.factory('audio', function($document){
  var tracks = [];

  for (var i = 0; i < 4; i++) {
    var audio = $document[0].createElement('audio');
    tracks[i] = audio;
  };
  return {
    tracks: tracks,
    load: function(src, i) {
      tracks[i].src = src;
    },
    loadKit: function(kit) {
      for (var i = 0; i < kit.length; i++) {
        tracks[i].src = kit[i].src;
      };
    }
  };
});

bumpkit.factory('player', function(audio){
  return {
    play: function(i){
      audio.tracks[i].currentTime = 0
      audio.tracks[i].play();
    }
  };
});

bumpkit.factory('metronome', function($timeout){
  var tempo = 120,
      currentStep = 0;

  // var stop;
  var counter = function(){
    var stop = $timeout(function(){
      if(currentStep < 16) currentStep++
      else currentStep = 1;
      console.log(currentStep);
      counter();
    }, tempo * 1000/240);
  };
  counter();
  

  return {
    tempo: tempo,
    currentStep: function(){
      return currentStep;
    },
    setTempo: function(tempo){
      metronome.tempo = tempo;
    }
  }
});

bumpkit.controller('MainCtrl', ['$scope', 'audio', 'player', 'metronome', function($scope, audio, player, metronome){
  $scope.herro = 'Bumpkit';

  $scope.audio = audio;
  $scope.player = player;
  $scope.metronome = metronome;
  $scope.currentStep = metronome.currentStep;

  $scope.kit = [
    { src: 'audio/Bassdrum-15.wav', name: 'Kick' },
    { src: 'audio/Clap03.wav', name: 'Clap' },
    { src: 'audio/ClosedHat05.wav', name: 'Hat' },
    { src: 'audio/Snare03.wav', name: 'Snare' }
  ];

  audio.loadKit($scope.kit);

  $scope.tempo = 120;
  $scope.steps = 16;
  
  $scope.pattern = [];
  for (var i = 0; i < audio.tracks.length; i++){
    var steps = [];
    for (var j = 0; j < $scope.steps; j++){
      steps[j] = false;
    };
    $scope.pattern.push({'steps': steps});
  };
  
  // $scope.currentStep = 1;

  $scope.toggleStep = function(track, step){
    console.log('toggle step');
    console.log(track + ',' + step);
    $scope.pattern[track].steps[step] = !$scope.pattern[track].steps[step];
  };

  Mousetrap.bind('a', function(){
    $scope.$apply(function(){
      player.play(0);
    });
  });
  Mousetrap.bind('s', function(){
    $scope.$apply(function(){
      player.play(1);
    });
  });
  Mousetrap.bind('d', function(){
    $scope.$apply(function(){
      player.play(2);
    });
  });
  Mousetrap.bind('f', function(){
    $scope.$apply(function(){
      player.play(3);
    });
  });

}]);
