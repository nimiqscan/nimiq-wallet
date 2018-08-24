import Signature from '../utils/signature'
import SignatureProof from '../utils/sigProof'
import BasicTransaction from '../transaction/basicTransaction'
import KeyPair from '../utils/keyPair'
import Address from '../utils/address'
import '../transaction/extendedTransaction'
const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')
const bip39 = require('bip39')

class Wallet {
  static async generate () {
    return new Wallet(KeyPair.generate())
  }

  static fromMasterKey (seed) {
    const key = KeyPair.fromHex(seed)
    return new Wallet(key)
  }

  static fromMnemonic (mnemonic) {
    const seed = bip39.mnemonicToSeedHex(mnemonic)
    const privateKeyHex = seed.substr(0, 64)
    const publicKeyArray = ec.keyFromSecret(privateKeyHex).getPublic()
    const publicKeyHex = Buffer.from(publicKeyArray).toString('hex')
    return Wallet.fromMasterKey(privateKeyHex + publicKeyHex)
  }

  constructor (keyPair) {
    this._keyPair = keyPair
    this._address = this._keyPair.publicKey.toAddress()
  }

  getAddress () {
    return this._address.toUserFriendlyAddress()
  }

  /**
   * Create a Transaction that is signed by the owner of this Wallet.
   * @param {Address} recipient Address of the transaction receiver
   * @param {number} value Number of Satoshis to send.
   * @param {number} fee Number of Satoshis to donate to the Miner.
   * @param {number} validityStartHeight The validityStartHeight for the transaction.
   * @returns {Transaction} A prepared and signed Transaction object. This still has to be sent to the network.
   */
  createTransaction (recipient, value, fee, validityStartHeight, networkId) {
    const transaction = new BasicTransaction(this._keyPair.publicKey, recipient, value, fee, validityStartHeight, undefined, networkId)
    transaction.signature = Signature.create(this._keyPair.privateKey, this._keyPair.publicKey, transaction.serializeContent())
    return transaction
  }

  // port the createTx with user friendly address
  generateTransaction ({ to, value, fee, height, networkId = 42 }) {
    return this.createTransaction(Address.fromUserFriendlyAddress(to), value, fee, height, networkId)
  }

  /**
   * Sign a transaction by the owner of this Wallet.
   * @param {Transaction} transaction The transaction to sign.
   * @returns {SignatureProof} A signature proof for this transaction.
   */
  signTransaction (transaction) {
    const signature = Signature.create(this._keyPair.privateKey, this._keyPair.publicKey, transaction.serializeContent())
    return SignatureProof.singleSig(this._keyPair.publicKey, signature)
  }

  equals (o) {
    return o instanceof Wallet && this.keyPair.equals(o.keyPair) && this.address.equals(o.address)
  }

  get publicKey () {
    return this._keyPair.publicKey
  }

  get keyPair () {
    return this._keyPair
  }
}

export default Wallet
