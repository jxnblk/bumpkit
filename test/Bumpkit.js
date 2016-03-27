
import expect from 'expect'
import Bumpkit from '../src/Bumpkit'
import Beep from '../src/Beep'
import Clip from '../src/Clip'
import Store from '../src/Store'

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
    bump.createClip(Beep)

    it('should play', () => {
      expect(() => {
        bump.play()
      }).toNotThrow()
    })

    it('should change playing state', () => {
      expect(bump.state.playing).toEqual(true)
    })

    it('should start the timer', (done) => {
      setTimeout(() => {
        const { step } = bump.getState()
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
      }, 200)
    })
  })

  describe('pause()', () => {
    it('should pause', () => {
      expect(() => {
        bump.pause()
        step = bump.getState().step
      }).toNotThrow()
    })

    it('should change playing state', () => {
      expect(bump.state.playing).toEqual(false)
    })

    it('should stop the clock scheduler', () => {
      expect(bump.getState().step).toEqual(step)
    })
  })

  describe('playPause()', () => {
    it('should start playing', () => {
      bump.playPause()
      expect(bump.getState().playing).toEqual(true)
    })

    it('should stop playing', () => {
      bump.playPause()
      expect(bump.getState().playing).toEqual(false)
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
      }).toThrow()
    })
  })
})

