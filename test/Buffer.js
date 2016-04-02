
import expect from 'expect'
import Bumpkit from '../src/Bumpkit'
import Buffer from '../src/Buffer'

const sample = 'http://jxnblk.s3.amazonaws.com/stepkit/dusty/kick.mp3'

describe('Buffer', () => {
  let buffer
  const bump = new Bumpkit()

  it('should create a new instance', () => {
    buffer = new Buffer(bump.context)
    expect(buffer).toBeA(Buffer)
  })

  it('should load a url', (done) => {
    expect(() => {
      buffer.load(sample)
        .then((response) => {
          done()
        })
    }).toNotThrow()
  })

  it('should have a sample')
  // to do: Fix for travis
  // it('should have a sample', () => {
  //   expect(buffer.audio).toBeAn(AudioBuffer)
  // })
})

