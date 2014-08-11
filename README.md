# Bumpkit
A DAW-inpsired library for the Web Audio API

*Work in Progress*


---


# Getting Started

Include the `dist/bumpkit.min.js` file in your project.

In your application, create a new instance of the Bumpkit class:

```js
var bumpkit = new Bumpkit();
```

This will create a new Audio Context instance with custom methods and properties.


---


# Basics

## Create a mixer with two tracks

```js
var mixer = bumpkit.createMixer().addTrack().addTrack();
```

## Create a new Sampler instrument and load an audio buffer

```js
var sampler = bumpkit.createSampler().connect(mixer.tracks[0]);

bumpkit.loadBuffer('/audio/clap.mp3', function(buffer) {
  sampler.buffer(buffer);
});
```

---


# API Documentation

## Bumpkit Class
Extends the AudioContext with additional properties and methods. Create a new instance: `var bumpkit = new Bumpkit()`

### Custom Properties
#### .buffers
An object for storing arrayBuffers. Keys are based on url. E.g. `{ /audio/sound.mp3: AudioBuffer }`

#### .isPlaying
Boolean value for if the step sequencer is running.

#### .loopLength
Integer representing the number of steps in a loop. Defaults to `null`.

#### .stepResolution
*Placeholder*
Integer representing the number of steps in a bar. Currently hard-coded to `16`.

#### .tempo
Integer representing the tempo of the step sequencer. Defaults to `120`.

#### .timeSignature
*Placeholder*
Array of two integers representing the time signature. 4/4 is represented as `[4,4]`. Currently hard-coded to 4/4.

### Custom Methods
#### .loadBuffer(url, callback)
*(Chainable)*
Makes an arraybuffer XHR request, decodes the file, stores the buffer in the `.buffers` object, and returns a Web Audio buffer.
If called a second time for the same url, it will return the stored buffer.

#### .playPause()
*(Chainable)*
Toggles playing of the step sequencer. The current step always begins at 0 when playing.

#### .trigger(source, options)
*(Chainable)*
Calls the `.start` method on the source. Options is an object with properties `when`, `offset`, and `duration`. The source should be connected to its destination before calling `.trigger()`.


---


## Mixer Object
Use the `.createMixer()` method to create a new mixer instance.
E.g. `var mixer = bumpkit.createMixer()`
The mixer is an object of tracks.
By default it includes a `.master` track object that is connected to the Bumpkit instances `.destination`.

### Mixer Methods
#### .addTrack()
*(Chainable)*
Creates a new track instance, adds it to the mixer tracks array, and connects it to the master track.

#### .removeTrack(index)
*(Chainable)*
Removes a track from the mixer tracks array at `index`.

### Mixer Track Properties
Each mixer track is a Web Audio gain node and can be directly connected to.
Tracks also include additional gain nodes for routing.

#### .mute
Use this gain node to read whether or not a track is muted. The track's volume state is maintained in the `.volume` gain node.

#### .volume
Get or set the volume for the track using this node. The volume node is also used to connect to other destinations.
Get the volume: `var level = track.volume,gain`
Set the volume: `track.volume.gain.value = .5`
*NOTE: This might change to a getter/setter method*

#### .effectsNode
A dummy gain node for connecting audio effects.

#### .effects
An array of other Web Audio nodes that can be placed between the root track node and the `.mute` node.

### Mixer Track Methods
#### .addEffect(node, index)
*(Chainable)*
Adds a node to the track effects array, and handles connections. By default, each effect is added to the end of the array. Use the `index` argument to adjust the insertion point.

#### .removeEffect(index)
*(Chainable)*
Removes `.effects[index]` from the array and reconnects the nodes.

#### .connect(node)
*(Chainable)*
Connects the `.volume` node to a destination. This handles the web audio `.disconnect(0)` call as well.

#### .toggleMute()
*(Chainable)*
Toggles the track's `.mute` node between 1 and 0.

#### .updateConnections()
*(Chainable)*
Disconnects and reconnects effects in the `.effects` array. This is used by the `.addEffect()` and `.removeEffect()` methods, but should also be called after manually reordering the effects array.


---


## Clip Object
Clips listen to Bumpkit's sequencer `step` event and triggers playback of instruments based on patterns.
Usage: `var clip = bumpkit.createClip()`

### Clip Properties
#### .pattern
An binary integer array to trigger playback of the connected instrument according to a rhythmic pattern.
The clip listens to the `step` event emitted by the Bumpkit clock sequencer.
E.g. `clip.pattern = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]` will play on each quarter note.
In the future, patterns will support more complex object arrays to account for velocity, duration, offset, envelopes, etc.

#### .active
Boolean for whether or not the clip should trigger playback.

### Clip Methods
#### .connect(node)
*(Chainable)*
Connects the clip to an instrument. The instrument must have a `.play(when)` method that accepts a when argument.

#### .toggle()
*(Chainable)*
Toggles the `.active` attribute for the clip.

#### .play(when)
*(Chainable)*
Used within the object to trigger playback from the event listener. This can be used manually, but it's prefered to manually call `.play()` directly on instruments if not using a clip.


---


## Beep Object
A simple sine-wave oscillator instrument.
Usage `var beep = bumpkit.createBeep()`

### .createBeep(options)
Returns a new Beep instance. Pass an optional argument to set property defaults.
E.g. `var customBeep = bumpkit.createBeep({ duration: .5, frequency: 512, connect: mixer.master })`

### Beep Properties
#### .duration
An integer of the length in seconds that the Beep will sound.

### Beep Methods
#### .frequency(frequency)
*Getter/Setter (Chainable Setter)*
Changes the frequency of the instrument. E.g. Set the frequency: `beep.frequency(512)` or get the frequency: `var f = beep.frequency()`

#### .connect(node)
*(Chainable)*
Connects the Beep to a destination node.

#### .play(when)
*(Chainable)*
Plays the instrument at the given `when` argument. If no argument is passed, the Beep will play immediately.


---


## Sampler Object
A simple sampler instrument for playing audio buffers.
Usage `var sampler = bumpkit.createSampler()`

### .createSampler(options)
Returns a new Sampler instance. Pass an optional argument to set property defaults.
E.g. `var customSampler = bumpkit.createSampler({ buffer: AudioBuffer, duration: .5, offset: .1, connect: mixer.master })`

### Sampler Properties
#### .offset
A number representing the offset in seconds to start playback of the sample. Defaults to 0.

#### .duration
A number representing the duration to play the sample. Defaults to 0.6.

### Sampler Methods
#### .buffer(buffer)
*Getter/Setter (Chainable Setter)*
Gets or sets the audio buffer used for the sampler. E.g. set the buffer: `sampler.buffer(AudioBuffer)` or get the buffer: `var b = sampler.buffer()`

#### .connect(node)
*(Chainable)*
Connects the sampler to a destination node.

#### .play(when)
*(Chainable)*


---


## Analysers

### .createAmplitudeAnalyser
*Work in Progress*
Creates a Web Audio analyser node with a custom method for reading the amplitude of a signal.

---


## Peak Analyser
### .analysePeaks(buffer)
Returns a Float32Array representing waveform data for the buffer.
Usage: `var waveform = bumpkit.analysePeaks(AudioBuffer)`


---


## Edge Fader
### .createEdgeFader(options)
Used internally to return a Web Audio gain node with edges faded according to the options argument.


