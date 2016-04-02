
import expect from 'expect'
import { Bumpkit, Sampler } from '../src'

const sample = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/kick.mp3'

describe('Sampler', () => {
  let sampler
  const bump = new Bumpkit()

  it('should create a new instance', () => {
    sampler = new Sampler(bump.context)
    expect(sampler).toBeA(Sampler)
  })

  it('should be a Sampler', () => {
    expect(sampler).toBeA(Sampler)
  })

  it('should have a play method', () => {
    expect(sampler.play).toBeA('function')
  })

  it('should have a decode method', () => {
    expect(sampler.decode).toBeA('function')
  })

  it('should have a load method', () => {
    expect(sampler.load).toBeA('function')
  })


  it('should load a sample', (done) => {
    expect(() => {
      sampler.load(sample)
        .then((response) => {
          done()
        })
    }).toNotThrow()
  })

  it('should have a sample')
  // it('should have a sample', () => {
  //   expect(sampler.buffer.audio).toBeAn(AudioBuffer)
  // })
})

