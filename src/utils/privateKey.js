import crypto from 'crypto'
import Serializable from './serializable'
import SerialBuffer from './serialBuffer'

const getRandomValues = (buf) => {
  if (!(buf instanceof Uint8Array)) {
    throw new TypeError('expected Uint8Array')
  }
  if (buf.length > 65536) {
    const e = new Error()
    e.code = 22
    e.message = `Failed to execute 'getRandomValues' on 'Crypto': The ArrayBufferView's byte length ${buf.length} exceeds the number of bytes of entropy available via this API (65536).`
    e.name = 'QuotaExceededError'
    throw e
  }
  const bytes = crypto.randomBytes(buf.length)
  buf.set(bytes)
  return buf
}

class PrivateKey extends Serializable {
  constructor (arg) {
    super()
    if (!(arg instanceof Uint8Array)) throw new Error('Primitive: Invalid type')
    if (arg.length !== PrivateKey.SIZE) throw new Error('Primitive: Invalid length')
    this._obj = arg
  }

  static generate () {
    const privateKey = new Uint8Array(PrivateKey.SIZE)
    getRandomValues(privateKey)
    return new PrivateKey(privateKey)
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
