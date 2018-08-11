# Nimiq Wallet

> Pure JavaScript wallet for Nimiq Blockchain, with dead simple API to use

## Usage

```javascript
import NimiqWallet from 'nimiq-wallet'

const seed = '8f8008e763cf691e2c7a2ca4027ec7a180d4f3d6df7f5c49ee1f0ab1599ae8172ce617a9aef427f4c294cfb3c79ff0264a835ef2c48a62ba5e68e271a174607500'

const wallet = NimiqWallet.fromMasterKey(seed)
const address = wallet.getAddress() // NQ49 MYQS MT0B 7QYP H4BQ NP9C REDY UXM7 4VC2

const tx = wallet.generateTransaction({
  to: 'NQXX XXXX .... XXXX',
  value: 50000, // number in satoshis
  fee: 0, // number in satoshis
  height: 170619 // validate from the block, suggest to current block height + 1
})

const hex = tx.toHex() // Raw tx data, just sendRawTransaction
const txId = tx.hash() // Transaction ID
```