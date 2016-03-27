
import axios from 'axios'

class Buffer {
  constructor (context) {
    this.context = context
    this.audio = null
    this.decode = this.decode.bind(this)
    this.load = this.load.bind(this)
  }

  decode (data) {
    console.log('data', data)
    try {
      return this.context.decodeAudioData(data)
        .then((buffer) => {
          console.log('buffer', buffer)
          this.audio = buffer
          return buffer
        })
        .catch((err) => {
          console.error(err)
        })
    } catch (e) {
      // Handle Safari non-promise based
      if (e instanceof TypeError) {
        return new Promise((resolve, reject) => {
          this.context.decodeAudioData(data, (buffer) => {
            this.audio = buffer
            resolve(buffer)
          }, (err) => {
            reject(err)
          })
        })
      } else {
        console.error(e)
      }
    }
  }

  load (url) {
    this.url = url
    const { decode } = this
    return axios.get(url, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        console.log(response.data)
        return decode(response.data)
      })
      .catch((response) => {
        console.error('Buffer.load error', response)
      })
  }
}

export default Buffer

