# Nimiq Wallet

> Pure JavaScript wallet for Nimiq Blockchain, with dead simple API to use

## Usage

```javascript
import NimiqWallet from 'nimiqscan-wallet'

const mnemonic = 'strategy enlist away hurt adjust firm antenna toss rocket away side rural'
const wallet = NimiqWallet.fromMnemonic(mnemonic)

const address = wallet.getAddress() // NQ95 539J MQY1 QYES MVUE 6444 0C91 DK4F U0P6

const tx = wallet.generateTransaction({
  to: 'NQXX XXXX .... XXXX',
  value: 50000, // number in satoshis
  fee: 0, // number in satoshis
  height: 170619 // validate from the block, suggest to current block height + 1
})

const hex = tx.toHex() // Raw tx data, just sendRawTransaction
const txId = tx.hash() // Transaction ID
```