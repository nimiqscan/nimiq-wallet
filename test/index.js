const assert = require('assert')
const NimiqWallet = require('../dist/index.cjs.js').default
const seed = '8f8008e763cf691e2c7a2ca4027ec7a180d4f3d6df7f5c49ee1f0ab1599ae8172ce617a9aef427f4c294cfb3c79ff0264a835ef2c48a62ba5e68e271a174607500'

// address: NQ49 MYQS MT0B 7QYP H4BQ NP9C REDY UXM7 4VC2
const myWallet = NimiqWallet.fromMasterKey(seed)
const tx = myWallet.generateTransaction({
  to: 'NQ49 GMD0 FDKS 9HTY DQQ7 M8D4 P2TN 5CN0 TDU9',
  value: 10000,
  fee: 0,
  height: 173976
})

describe('Nimiq Wallet', function () {
  it('Can get user friendly address', () => {
    const addr = myWallet.getAddress()
    assert.strictEqual(addr, 'NQ49 MYQS MT0B 7QYP H4BQ NP9C REDY UXM7 4VC2')
  })

  it('Can generate tx', () => {
    const hex = tx.toHex()
    const txId = tx.hash()
    assert.strictEqual(hex, '002ce617a9aef427f4c294cfb3c79ff0264a835ef2c48a62ba5e68e271a1746075855a07b67a4c77f6e307aa1a4b8b762b2c0db789000000000000271000000000000000000002a7982adbe9a28e061872b8dbe5ce2b951a3078ce8571366504d37eace43e402aaf330438c98f8da9a571fcfdafa246cf07756577fb43f3ce9b77a4d85d7cb14c312703')
    assert.strictEqual(txId, '8b1c56c9ea0796f1c3f5b651b2d07a6ecb2fc3c6898f15ba792d29ecc3da6ba2')
  })
})
