
import expect from 'expect'
import Clock from '../src/Clock'

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

describe('Clock', () => {
  let clock
  let index = 0
  const inc = ({ step, when }) => {
    index = step
  }

  it('should create a clock instance', () => {
    expect(() => {
      clock = new Clock()
    }).toNotThrow()
  })

  it('should have default state', () => {
    expect(clock.state.step).toEqual(0)
    expect(clock.state.tempo).toEqual(120)
  })

  it('should have default context', () => {
    expect(clock.context).toBeAn(AudioContext)
  })

  it('should return stepDuration', () => {
    expect(clock.stepDuration).toEqual(60 / 120 / 4)
  })

  it('should return currentTime', () => {
    expect(clock.currentTime).toBeA('number')
  })

  describe('sync()', () => {
    it('should not have default sync listeners', () => {
      expect(clock.callbacks).toEqual([])
    })

    it('should add a sync listener', () => {
      clock.sync(inc)
      expect(clock.callbacks).toEqual([ inc ])
    })
  })

  describe('tick()', () => {
    it('should call the sync callback', () => {
      clock.tick({ step: 1, when: 200 })
      expect(index).toEqual(1)
    })
  })

  describe('scheduler()', () => {
    it('should start the scheduler', () => {
      expect(() => {
        clock.scheduler()
      }).toNotThrow()
    })

    it('should start the clock', (done) => {
      setTimeout(() => {
        expect(clock.currentTime).toBeGreaterThan(0)
        done()
      }, 100)
    })

    it('should call the sync listener', (done) => {
      setTimeout(() => {
        expect(index).toBeGreaterThan(0)
        done()
      }, 100)
    })
  })

})

