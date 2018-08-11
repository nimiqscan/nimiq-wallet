import PrivateKey from './privateKey'
import PublicKey from './publicKey'
import Serializable from './serializable'
import SerialBuffer from './serialBuffer'
import BufferUtils from './bufferUtils'

class KeyPair extends Serializable {
  constructor (privateKey, publicKey) {
    if (!(privateKey instanceof Object)) throw new Error('Primitive: Invalid type')
    if (!(publicKey instanceof Object)) throw new Error('Primitive: Invalid type')
    super()
    this._publicKey = publicKey
    this._internalPrivateKey = new PrivateKey(privateKey.serialize())
  }

  static fromHex (hexBuf) {
    return KeyPair.unserialize(BufferUtils.fromHex(hexBuf))
  }

  static unserialize (buf) {
    const privateKey = PrivateKey.unserialize(buf)
    const publicKey = PublicKey.unserialize(buf)
    let locked = false
    let lockSalt = null
    if (buf.readPos < buf.byteLength) {
      const extra = buf.readUint8()
      if (extra === 1) {
        locked = true
        lockSalt = buf.read(32)
      }
    }
    return new KeyPair(privateKey, publicKey, locked, lockSalt)
  }

  toHex () {
    return BufferUtils.toHex(this.serialize())
  }

  serialize (buf) {
    buf = buf || new SerialBuffer(this.serializedSize)
    this._privateKey.serialize(buf)
    this.publicKey.serialize(buf)
    if (this._locked) {
      buf.writeUint8(1)
      buf.write(this._lockSalt)
    } else {
      buf.writeUint8(0)
    }
    return buf
  }

  get privateKey () {
    return this._privateKey
  }

  get _privateKey () {
    return this._unlockedPrivateKey || this._internalPrivateKey
  }

  get publicKey () {
    return this._publicKey || (this._publicKey = new PublicKey(this._obj.publicKey))
  }

  get serializedSize () {
    return this._privateKey.serializedSize + this.publicKey.serializedSize + (this._locked ? this._lockSalt.byteLength + 1 : 1)
  }

  equals (o) {
    return o instanceof KeyPair && super.equals(o)
  }
}
KeyPair.LOCK_KDF_ROUNDS = 256
KeyPair.EXPORT_KDF_ROUNDS = 256
KeyPair.EXPORT_CHECKSUM_LENGTH = 4
KeyPair.EXPORT_SALT_LENGTH = 16

export default KeyPair
