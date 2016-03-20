
import expect from 'expect'
import { Bumpkit, Buffer } from '../src'

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

  it('should have a buffer', () => {
    expect(buffer.buffer).toBeAn(AudioBuffer)
  })
})

