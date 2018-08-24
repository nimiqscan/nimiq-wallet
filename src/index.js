import NimiqWallet from './wallet/wallet'
import Address from './utils/address'
import BufferUtils from './utils/bufferUtils'
import SerialBuffer from './utils/serialBuffer'
import Transaction from './transaction/index'
import KeyPair from './utils/keyPair'
import BasicTransaction from './transaction/basicTransaction'
import bip39 from 'bip39'

export {
  Address,
  BufferUtils,
  Transaction,
  BasicTransaction,
  SerialBuffer,
  KeyPair,
  bip39
}

export default NimiqWallet
