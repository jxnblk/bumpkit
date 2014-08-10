# Bumpkit
A DAW-inpsired library for the Web Audio API

*Work in Progress*

# Getting Started

# Basics

# API

## Bumpkit Class
Extends the AudioContext with additional properties and methods

### Custom Properties
### `.buffers`
An object for storing arrayBuffers. Keys are based on url. E.g. `{ /audio/sound.mp3: AudioBuffer }`

`.isPlaying`
Boolean value for is the step sequencer is running.

`.loopLength`
Integer representing the number of steps in a loop. Defaults to `null`.

`.stepResolution`
Integer representing the number of steps in a bar. Currently hard-coded to `16`.

`.tempo`
Integer representing the temp of the step sequencer. Defaults to `120`.

`.timeSignature`
Array of two integers representing the time signature. 4/4 is represented as `[4,4]`. Currently hard-coded to 4/4.

### Custom Methods
- `.getArrayBuffer()`
- `.loadBuffer()`
- `.playPause()`
- `.trigger()`

## createMixer Method
Returns an new Mixer instance.

### Properties
### Methods

## createClip Method
Returns a new Clip instance.

## createBeep Method
Returns a new Beep instance.

### Properties
### Methods

### createSampler Method
Returns a new Sampler instance.

### Properties
### Methods
