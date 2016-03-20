
import expect from 'expect'
import { Bumpkit, Store, Beep, Clip } from '../src'

describe('Bumpkit', () => {
  let bump
  let step
  const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

  it('should create a new instance', () => {
    expect(() => {
      bump = new Bumpkit()
    }).toNotThrow()
  })

  it('should have context', () => {
    expect(bump.context).toExist()
  })

  it('should be a Store', () => {
    expect(bump).toBeA(Store)
  })

  it('should be a webaudio context', () => {
    expect(bump.context).toBeAn(AudioContext)
  })

  describe('initial state', () => {
    it('should not be playing', () => {
      expect(bump.state.playing).toEqual(false)
    })

    it('should have default tempo', () => {
      expect(bump.state.tempo).toEqual(120)
    })

    it('should have default resolution', () => {
      expect(bump.state.resolution).toEqual(16)
    })

    it('should have default time signature', () => {
      expect(bump.state.signature).toEqual(1)
    })
  })

  describe('play()', () => {
    let beep
    const beeper = ({ when, step }) => {
      if (step % 4 === 0) {
        // beep.play(when)
      }
    }

    it('should play', () => {
      expect(() => {
        bump.play()
        bump.stop()
      }).toNotThrow()
    })

    it('should change playing state', () => {
      expect(bump.state.playing).toEqual(true)
    })

    it('should start the timer', (done) => {
      setTimeout(() => {
        step = bump.clock.state.step
        expect(bump.clock.timer).toExist()
        expect(step).toBeGreaterThan(0)
        done()
      }, 200)
    })

    it('should beep four times (listen)', (done) => {
      beep = new Beep(bump.context)
      bump.clock.sync(beeper)
      setTimeout(() => {
        bump.stop()
        done()
      }, 500)
    })

  })

  describe('pause()', () => {
    it('should pause', () => {
      expect(() => {
        bump.pause()
        step = bump.clock.state.step
      }).toNotThrow()
    })

    it('should change playing state', () => {
      expect(bump.state.playing).toEqual(false)
    })

    it('should stop the clock scheduler', () => {
      expect(bump.clock.state.step).toEqual(step)
    })
  })

  describe('playPause()', () => {
    it('should start playing', () => {
      bump.playPause()
      expect(bump.state.playing).toEqual(true)
    })

    it('should stop playing', () => {
      bump.playPause()
      expect(bump.state.playing).toEqual(false)
    })
  })

  describe('createClip()', () => {
    let clip, beep
    it('should create a new clip', () => {
      expect(() => {
        bump.clock.setState({ loop: 8 })
        clip = bump.createClip([0, 0, 1, 0, 0, 0, 1, 0])
        beep = new Beep(bump.context)
        clip.connect(beep)
      }).toNotThrow()
    })

    it('should add it to the clips property', () => {
      expect(bump.clips.length).toEqual(1)
    })

    it('should return a Clip instance', () => {
      expect(clip).toBeA(Clip)
    })

    it('should play the clip', (done) => {
      expect(() => {
        // bump.play()
        bump.stop()
        setTimeout(() => {
          done()
        }, 100)
      }).toNotThrow()
    })

  })

  describe('kill()', () => {
    it('should remove the audio context', () => {
      bump.kill()
      expect(bump.context).toNotExist()
    })

    it('should not enable playback', () => {
      expect(() => {
        // WIP
        bump.play()
      }).toNotThrow()
    })
  })
})

