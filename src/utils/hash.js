import Serializable from './serializable'
import SerialBuffer from './serialBuffer'
import BufferUtils from './bufferUtils'
import blake from 'blakejs'

class Hash extends Serializable {
  constructor (arg, algorithm = Hash.Algorithm.BLAKE2B) {
    if (arg === null) {
      arg = new Uint8Array(Hash.getSize(algorithm))
    } else {
      if (!(arg instanceof Uint8Array)) throw new Error('Primitive: Invalid type')
      if (arg.length !== Hash.getSize(algorithm)) throw new Error('Primitive: Invalid length')
    }
    super()
    this._obj = arg
    this._algorithm = algorithm
  }

  static light (arr) {
    return Hash.blake2b(arr)
  }

  static blake2b (arr) {
    // Pure JS - blakejs
    const out = blake.blake2b(arr, null, 32)
    return new Hash(out, Hash.Algorithm.BLAKE2B)
  }

  static unserialize (buf, algorithm = Hash.Algorithm.BLAKE2B) {
    return new Hash(buf.read(Hash.getSize(algorithm)), algorithm)
  }

  serialize (buf) {
    buf = buf || new SerialBuffer(this.serializedSize)
    buf.write(this._obj)
    return buf
  }

  subarray (begin, end) {
    return this._obj.subarray(begin, end)
  }

  /** @type {number} */
  get serializedSize () {
    return Hash.SIZE.get(this._algorithm)
  }

  /** @type {Uint8Array} */
  get array () {
    return this._obj
  }

  /** @type {Hash.Algorithm} */
  get algorithm () {
    return this._algorithm
  }

  equals (o) {
    return o instanceof Hash && o._algorithm === this._algorithm && super.equals(o)
  }

  static fromBase64 (base64) {
    return new Hash(BufferUtils.fromBase64(base64))
  }

  static fromHex (hex) {
    return new Hash(BufferUtils.fromHex(hex))
  }

  static isHash (o) {
    return o instanceof Hash
  }

  static getSize (algorithm) {
    const size = Hash.SIZE.get(algorithm)
    if (typeof size !== 'number') throw new Error('Invalid hash algorithm')
    return size
  }
}

/**
* @enum {number}
*/
Hash.Algorithm = {
  BLAKE2B: 1,
  ARGON2D: 2,
  SHA256: 3,
  SHA512: 4
}
/**
* @type {Map<Hash.Algorithm, number>}
*/
Hash.SIZE = new Map()
Hash.SIZE.set(Hash.Algorithm.BLAKE2B, 32)
Hash.SIZE.set(Hash.Algorithm.ARGON2D, 32)
Hash.SIZE.set(Hash.Algorithm.SHA256, 32)
Hash.SIZE.set(Hash.Algorithm.SHA512, 64)

Hash.NULL = new Hash(new Uint8Array(32))

export default Hash
