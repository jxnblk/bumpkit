# Bumpkit

## Classes, properties and methods
### Bumpkit
Provides audio context, speaker, trigger method, and get method
- context
- speaker
- trigger(source, when, output, options)
- get(url)

#### Clock
- tempo
- stepDuration()
- nextStepTime
- currentStep
- isPlaying
- loopLength
- timerID
- scheduleStep()
- scheduler()
- stop()
- playPause()

### Bumpkit.Mixer(output)
- master object with input, mute, and volume
- tracks array with input, mute, and volume 
- addTrack()
- removeTrack(index)

### Bumpkit.Beep(output)
- duration
- frequency
- pattern
- output
- play(when)

### Bumpkit.Sampler(output)
- output
- context
- offset
- duration
- buffer
- loadBuffer(file)
- loadSample(url)
- play(when)
- pattern []

