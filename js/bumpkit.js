// Bumpkit
// Main audio context with decorators

var AC = window.AudioContext || window.webkitAudioContext;

var Bumpkit = function() {};
Bumpkit.prototype = new AC();

Bumpkit.prototype.arm = 'prop';
console.log(AC);
Bumpkit.prototype.createGain = AC.createGain();



