
import Bumpkit from '../src'

const sampleDirectory = 'demo/samples/'

const bumpkit = new Bumpkit({
  tempo: 96,
  loop: 32
})

const tracks = [
  {
    name: 'Drum',
    loops: [
      { name: 'Beat 01', url: 'forever/last-forever-beat-01.mp3', bpm: 96, loop: 16 },
      { name: 'Beat 02', url: 'forever/last-forever-beat-02.mp3', bpm: 96, loop: 16, active: false },
    ]
  },
  {
    name: 'Bass',
    loops: [
      { name: 'Bass 01', url: 'forever/last-forever-bass-01.mp3', bpm: 96, loop: 32 },
      { name: 'Bass 02', url: 'forever/last-forever-bass-02.mp3', bpm: 96, loop: 32, active: false },
      { name: 'Bass 03', url: 'forever/last-forever-bass-03.mp3', bpm: 96, loop: 32, active: false },
    ]
  },
  {
    name: 'Samples',
    loops: [
      { name: 'Vocal 01',   url: 'forever/last-forever-vocal.mp3',      bpm: 96, loop: 16 },
      { name: 'Vocal 02',   url: 'forever/last-forever-vocal-02.mp3',   bpm: 96, loop: 32, active: false },
      { name: 'Vocal 03',   url: 'forever/last-forever-vocal-03.mp3',   bpm: 96, loop: 16, active: false },
      { name: 'Vocal Fill', url: 'forever/last-forever-vocal-fill.mp3', bpm: 96, loop: 32, active: false },
    ]
  },
].map((track) => {
  track.loops = track.loops.map((l) => {
    l.url = sampleDirectory + l.url
    return l
  })
  return track
}).map((track) => {
  track.loops = track.loops.map((l) => {
    const { bpm, loop, url } = l
    l.looper = new Bumpkit.Looper(bumpkit, l)
    return l
  })
  return track
})

bumpkit.setState({ tracks })

export default bumpkit

