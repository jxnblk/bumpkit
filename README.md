# Bumpkit
A DAW-inpsired library for the Web Audio API

*Work in Progress*

# Getting Started

# Basics

# API

## Bumpkit Class
Extends the AudioContext with additional properties and methods. Create a new instance: `var bumpkit = new Bumpkit()`

### Custom Properties
#### `.buffers`
An object for storing arrayBuffers. Keys are based on url. E.g. `{ /audio/sound.mp3: AudioBuffer }`

#### `.isPlaying`
Boolean value for is the step sequencer is running.

#### `.loopLength`
Integer representing the number of steps in a loop. Defaults to `null`.

#### `.stepResolution`
Integer representing the number of steps in a bar. Currently hard-coded to `16`.

#### `.tempo`
Integer representing the temp of the step sequencer. Defaults to `120`.

#### `.timeSignature`
Array of two integers representing the time signature. 4/4 is represented as `[4,4]`. Currently hard-coded to 4/4.

### Custom Methods
#### `.loadBuffer(url, callback)`
Makes an arraybuffer XHR request, decodes the file, stores the buffer in the `.buffers` object, and returns a Web Audio buffer.
If called a second time for the same url, it will return the stored buffer.

#### `.playPause()`
Toggles playing of the step sequencer. The current step always begins at 0 when playing.

#### `.trigger(source, options)`
Calls the `.start` method on the source. Options is an object with properties `when`, `offset`, and `duration`. The source should be connected to its destination before calling `.trigger()`.

## Mixer Object
Use the `.createMixer()` method to create a new mixer instance.
E.g. `var mixer = bumpkit.createMixer()`
The mixer is an object of tracks.
By default it includes a `.master` track object that is connected to the Bumpkit instances `.destination`.

### Mixer Track Properties
Each mixer track is a Web Audio gain node and can be directly connected to.
Tracks also include additional gain nodes for routing.

#### `.mute`
Use this gain node to read whether or not a track is muted. The track's volume state is maintained in the `.volume` gain node.

#### `.volume`
Get or set the volume for the track using this node. The volume node is also used to connect to other destinations.
Get the volume: `var level = track.volume,gain`
Set the volume: `track.volume.gain.value = .5`

#### `.effectsNode`
A dummy gain node for connecting audio effects.

#### `.effects`
An array of other Web Audio nodes that can be placed between the root track node and the `.mute` node.

### Mixer Track Methods
#### `.addEffect(node, index)`
Adds a node to the track effects array, and handles connections. By default, each effect is added to the end of the array. Use the `index` argument to adjust the insertion point.

#### `.removeEffect(index)`
Removes `.effects[index]` from the array and reconnects the nodes.

#### `.connect(node)`
Connects the `.volume` node to a destination. This handles the web audio `.disconnect(0)` call as well.

#### `.toggleMute()`
Toggles the track's `.mute` node between 1 and 0.

#### `.updateConnections()`
Disconnects and reconnects effects in the `.effects` array. This is used by the `.addEffect()` and `.removeEffect()` methods, but should also be called after manually reordering the effects array.


## Clip Object
Clips listen to Bumpkit's sequencer `step` event and triggers playback of instruments based on patterns.
Usage: `var clip = bumpkit.createClip()`

### Clip Properties
#### `.pattern`
An binary integer array to trigger playback of the connected instrument according to a rhythmic pattern.
The clip listens to the `step` event emitted by the Bumpkit clock sequencer.
E.g. `clip.pattern = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]` will play on each quarter note.
In the future, patterns will support more complex object arrays to account for velocity, duration, offset, envelopes, etc.

#### `.active`
Boolean for whether or not the clip should trigger playback.

### Clip Methods
#### `.connect(node)` *(chainable)*
Connects the clip to an instrument. The instrument must have a `.play(when)` method that accepts a when argument.

#### `.toggle()` *(chainable)*
Toggles the `.active` attribute for the clip.

#### `.play(when)` *(Chainable)*
Used within the object to trigger playback from the event listener. This can be used manually, but it's prefered to manually call `.play()` directly on instruments if not using a clip.


## Beep Object
A simple sine-wave oscillator instrument.
Usage `var beep = bumpkit.createBeep()`

## Sampler Object
A simple sampler instrument for playing audio buffers.
Usage `var sampler = bumpkit.createSampler()`

## Analysers

## Peak Analyser

## Edge Fader

