
import Store from './Store'
import Clock from './Clock'
import Clip from './Clip'
import Beep from './Beep'
import Sampler from './Sampler'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

/** Bumpkit */
class Bumpkit extends Store {
  constructor ({
    tempo = 120,
    resolution = 16,
    signature = 4/4
  } = {}) {
    super()

    this.context = new AudioContext()
    this.followers = []
    this.clock = new Clock(this)
    this.clock.sync(this.tick.bind(this))

    this.setState({
      playing: false,
      tempo,
      resolution,
      signature,
      step: 0
    })

    this.sync = this.sync.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.playPause = this.playPause.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)

    this.createClip = this.createClip.bind(this)
  }

  tick ({ step, when }) {
    this.followers.forEach((follower) => {
      follower({ step, when })
    })
  }

  sync (follower) {
    this.followers.push(follower)
  }

  play () {
    this.setState({ playing: true })
    this.clock.start()
  }

  pause () {
    this.setState({ playing: false })
    this.clock.stop()
  }

  playPause () {
    const { playing } = this.state
    if (playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  stop () {
    this.clock.stop()
    this.setState({ playing: false })
    this.setState({ step: 0 })
  }

  kill () {
    this.stop()
    this.context.close()
    delete this.context
  }

  createClip (Inst, opts = {}) {
    const instrument = new Inst(this.context, opts)
    const clip = new Clip(instrument)
    this.sync(clip.play)

    return clip
  }
}

export default Bumpkit

