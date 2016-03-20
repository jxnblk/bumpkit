
import expect from 'expect'
import Clip from '../src/Clip'
import Bumpkit from '../src/Bumpkit'
import Beep from '../src/Beep'

describe('Clip', () => {
  let clip

  it('should not throw', () => {
    expect(() => {
      clip = new Clip()
    }).toNotThrow()
  })

  it('should be a Clip instance', () => {
    expect(clip).toBeA(Clip)
  })

  it('should have an empty pattern', () => {
    expect(clip.pattern).toEqual([])
  })

  it('should be active', () => {
    expect(clip.active).toEqual(true)
  })

  describe('toggle()', () => {
    it('should change active state', () => {
      clip.toggle()
      expect(clip.active).toEqual(false)
    })
  })

  describe('output', () => {
    let bump, beep

    it('should connect to a node', () => {
      expect(() => {
        bump = new Bumpkit()
        beep = new Beep(bump.context)
        clip.output = beep
      }).toNotThrow()
    })

    it('should have a beep for output', () => {
      expect(clip.output).toBeA(Beep)
    })

    it('should play the beep on an active step', () => {
      clip.pattern = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
      expect(() => {
        clip.play({ when: 0, step: 0 })
      }).toNotThrow()
    })
  })
})

