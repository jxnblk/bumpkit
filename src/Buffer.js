
import axios from 'axios'
import log from 'loglevel'

class Buffer {
  constructor (context) {
    log.info('Buffer', context)
    this.context = context
    this.audio = null
    this.decode = this.decode.bind(this)
    this.load = this.load.bind(this)
  }

  decode (data) {
    log.debug('Buffer.decode()', data)
    try {
      return this.context.decodeAudioData(data)
        .then((buffer) => {
          log.debug('Buffer decodeAudioData', buffer)
          this.audio = buffer
          return buffer
        })
        .catch((err) => {
          log.error('Buffer decodeAudioData error', err)
        })
    } catch (e) {
      // Handle Safari non-promise based
      log.warn('Buffer decodeAudioData - non-Promise syntax for Safari', e)
      if (e instanceof TypeError) {
        return new Promise((resolve, reject) => {
          this.context.decodeAudioData(data, (buffer) => {
            log.debug('Buffer decodeAudioData', buffer)
            this.audio = buffer
            resolve(buffer)
          }, (err) => {
            log.error('Buffer decodeAudioData error', err)
            reject(err)
          })
        })
      } else {
        log.error('Buffer.decode() error', e)
      }
    }
  }

  load (url) {
    log.info('Buffer.load()', url)
    this.url = url
    const { decode } = this
    return axios.get(url, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        log.debug('Buffer.load() response', response)
        return decode(response.data)
      })
      .catch((err) => {
        log.error('Buffer.load() error', err)
      })
  }
}

export default Buffer

