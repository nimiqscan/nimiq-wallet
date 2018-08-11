import Address from './address'
import Serializable from './serializable'
import SerialBuffer from './serialBuffer'
import BufferUtils from './bufferUtils'
import Hash from './hash'

class PublicKey extends Serializable {
  constructor (arg) {
    super()
    if (!(arg instanceof Uint8Array)) throw new Error('Primitive: Invalid type')
    if (arg.length !== PublicKey.SIZE) throw new Error('Primitive: Invalid length')
    this._obj = arg
  }

  static copy (o) {
    if (!o) return o
    return new PublicKey(new Uint8Array(o._obj))
  }

  static sum (publicKeys) {
    publicKeys = publicKeys.slice()
    publicKeys.sort((a, b) => a.compare(b))
    return PublicKey._delinearizeAndAggregatePublicKeys(publicKeys)
  }

  static unserialize (buf) {
    return new PublicKey(buf.read(PublicKey.SIZE))
  }

  get serializedSize () {
    return PublicKey.SIZE
  }

  serialize (buf) {
    buf = buf || new SerialBuffer(this.serializedSize)
    buf.write(this._obj)
    return buf
  }

  equals (o) {
    return o instanceof PublicKey && super.equals(o)
  }

  hash () {
    return Hash.light(this.serialize())
  }

  compare (o) {
    return BufferUtils.compare(this._obj, o._obj)
  }

  toAddress () {
    return Address.fromHash(this.hash())
  }
}

PublicKey.SIZE = 32

export default PublicKey
