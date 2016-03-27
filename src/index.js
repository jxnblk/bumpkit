
import log from 'loglevel'
import Bumpkit from './Bumpkit'
import Beep from './Beep'
import Clip from './Clip'
import Looper from './Looper'
import Sampler from './Sampler'

log.setLevel('info')

export {
  Bumpkit,
  Beep,
  Clip,
  Looper,
  Sampler
}

Bumpkit.Beep = Beep
Bumpkit.Clip = Clip
Bumpkit.Looper = Looper
Bumpkit.Sampler = Sampler

export default Bumpkit

