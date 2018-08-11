
import Serializable from './serializable'
import SerialBuffer from './serialBuffer'
import BufferUtils from './bufferUtils'
const EdDSA = require('elliptic').eddsa
const ec2 = new EdDSA('ed25519')

class Signature extends Serializable {
  constructor (arg) {
    super()
    if (!(arg instanceof Uint8Array)) throw new Error('Primitive: Invalid type')
    if (arg.length !== Signature.SIZE) throw new Error('Primitive: Invalid length')
    this._obj = arg
  }

  static copy (o) {
    if (!o) return o
    // FIXME Move this to Crypto class.
    const obj = new Uint8Array(o._obj)
    return new Signature(obj)
  }

  static create (privateKey, publicKey, data) {
    return new Signature(Signature._signatureCreate(privateKey._obj, publicKey._obj, data))
  }

  static fromPartialSignatures (commitment, signatures) {
    const raw = Signature._combinePartialSignatures(commitment.serialize(), signatures.map(s => s.serialize()))
    return new Signature(raw)
  }

  static unserialize (buf) {
    return new Signature(buf.read(Signature.SIZE))
  }

  static _combinePartialSignatures (combinedCommitment, partialSignatures) {
    const combinedSignature = Signature._aggregatePartialSignatures(partialSignatures)
    return BufferUtils.concatTypedArrays(combinedCommitment, combinedSignature)
  }

  static _aggregatePartialSignatures (partialSignatures) {
    return partialSignatures.reduce((sigA, sigB) => Signature._scalarsAdd(sigA, sigB))
  }

  static _signatureCreate (privateKey, publicKey, message) {
    const key = ec2.keyFromSecret(BufferUtils.toHex(privateKey))
    const sig = key.sign(BufferUtils.toHex(message)).toHex()
    return BufferUtils.fromHex(sig)
  }

  static _signatureVerify (publicKey, message, signature) {
    const key = ec2.keyFromPublic(BufferUtils.toHex(publicKey))
    return key.verify(BufferUtils.toHex(message), BufferUtils.toHex(signature))
  }

  get serializedSize () {
    return Signature.SIZE
  }

  serialize (buf) {
    buf = buf || new SerialBuffer(this.serializedSize)
    buf.write(this._obj)
    return buf
  }

  verify (publicKey, data) {
    return Signature._signatureVerify(publicKey._obj, data, this._obj)
  }

  equals (o) {
    return o instanceof Signature && super.equals(o)
  }
}

Signature.SIZE = 64

export default Signature
