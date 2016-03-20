
import assign from 'object-assign'

/** State store
*/

class Store {
  constructor (state = {}) {
    this._state = state
    this.listeners = []
    this.setState = this.setState.bind(this)
    this.getState = this.getState.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)

  }

  setState (state) {
    this._state = assign({}, this._state, state)
    this.listeners.forEach((listener) => {
      listener(this._state)
    })
  }

  getState () {
    return this._state
  }

  get state () {
    return this._state
  }

  subscribe (listener) {
    if (typeof listener !== 'function') {
      return false
    }

    this.listeners.push(listener)
  }

  unsubscribe (listener) {
    const i = this.listeners.indexOf(listener)
    if (i > -1) {
      this.listeners.splice(i, 1)
    }
  }
}

export default Store

