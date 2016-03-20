
import axios from 'axios'
import Clip from './Clip'

class Buffer {
  constructor (context) {
    this.context = context
    this.sample = null
    this.load = this.load.bind(this)
  }

  decode (data) {
    const { context } = this
    return context.decodeAudioData(data)
      .then((buffer) => {
        this.sample = buffer
        return buffer
      })
      .catch((err) => {
        console.error(err)
      })
  }

  load (url) {
    return axios.get(url, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        return this.decode(response.data)
      })
      .catch((response) => {
        console.error('Buffer.load error', response)
      })
  }
}

export default Buffer

