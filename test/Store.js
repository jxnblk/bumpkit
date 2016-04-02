
import expect from 'expect'
import Store from '../src/Store'

describe('Store', () => {
  let store
  let index = 0
  const inc = (state) => index++

  it('should create a new instance', () => {
    expect(() => {
      store = new Store()
    }).toNotThrow()
  })

  it('should have an empty state', () => {
    expect(store.state).toEqual({})
  })

  it('should have no listeners', () => {
    expect(store.listeners).toEqual([])
  })

  it('should assign properties', () => {
    store.setState({ index })
    expect(store.state.index).toEqual(index)
  })

  it('should not override other state properties', () => {
    store.setState({ hello: 'test' })
    expect(store.state.index).toEqual(index)
    expect(store.state.hello).toEqual('test')
  })

  it('should subscribe listeners', () => {
    store.subscribe(inc)
    expect(store.listeners).toEqual([
      inc
    ])
  })

  it('should call listeners', () => {
    store.setState({ hello: 'hi' })
    expect(index).toEqual(1)
  })

  it('should not mutate state', () => {
    expect(store.state.index).toEqual(0)
  })

  it('should unsubscribe listener', () => {
    store.unsubscribe(inc)
    expect(store.listeners).toEqual([])
  })

  it('should not call listener', () => {
    store.setState({ hello: 'bumpkit' })
    expect(index).toEqual(1)
  })
})


