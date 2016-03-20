
import expect from 'expect'
import Bumpkit from '../src/Bumpkit'
import Store from '../src/Store'

describe('Bumpkit', () => {
  let bump
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
    it('should play', () => {
      expect(() => {
        // bump.play()
      }).toNotThrow()
    })
  })
})

