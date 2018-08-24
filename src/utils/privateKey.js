import Serializable from './serializable'
import SerialBuffer from './serialBuffer'

class PrivateKey extends Serializable {
  constructor (arg) {
    super()
    if (!(arg instanceof Uint8Array)) throw new Error('Primitive: Invalid type')
    if (arg.length !== PrivateKey.SIZE) throw new Error('Primitive: Invalid length')
    this._obj = arg
  }

  static unserialize (buf) {
    return new PrivateKey(buf.read(PrivateKey.SIZE))
  }

  get serializedSize () {
    return PrivateKey.SIZE
  }

  serialize (buf) {
    buf = buf || new SerialBuffer(this.serializedSize)
    buf.write(this._obj)
    return buf
  }

  overwrite (privateKey) {
    this._obj.set(privateKey._obj)
  }

  equals (o) {
    return o instanceof PrivateKey && super.equals(o)
  }
}

PrivateKey.SIZE = 32

export default PrivateKey
